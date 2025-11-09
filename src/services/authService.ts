import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  User,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, UserProfile } from '../lib/firebase';

// Rate limiting for verification emails
const VERIFICATION_COOLDOWN = 60000; // 1 minute
let lastVerificationSent = 0;

export class AuthService {
  // Sign up new user
  static async signUp(email: string, password: string, name: string, phone?: string, company?: string) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        name,
        phone,
        company,
        emailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      // Send email verification
      try {
        await sendEmailVerification(user, {
          url: `${window.location.origin}/?verified=true`,
          handleCodeInApp: false
        });
        lastVerificationSent = Date.now();
      } catch (verificationError) {
        console.warn('Email verification failed:', verificationError);
        // Don't throw error for verification failure
      }

      return { user, profile: userProfile };
    } catch (error) {
      console.error('Sign up error:', error);
      throw this.handleAuthError(error as AuthError);
    }
  }

  // Sign in existing user
  static async signIn(email: string, password: string) {
    try {
      console.log('Starting sign in process for:', email);

      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('Firebase authentication successful. User ID:', user.uid);

      // Get user profile from Firestore with retry logic
      let profileDoc;
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          console.log(`Attempting to fetch user profile (attempt ${retryCount + 1}/${maxRetries})`);
          profileDoc = await getDoc(doc(db, 'users', user.uid));
          break;
        } catch (firestoreError: any) {
          console.error('Firestore read error:', firestoreError);
          retryCount++;

          if (retryCount >= maxRetries) {
            console.error('Failed to fetch user profile after maximum retries');
            throw new Error('Unable to load user profile. Please check your permissions and try again.');
          }

          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      if (!profileDoc || !profileDoc.exists()) {
        console.error('User profile not found in Firestore for user:', user.uid);
        throw new Error('User profile not found. Please contact support.');
      }

      const profile = profileDoc.data() as UserProfile;
      console.log('User profile loaded successfully');

      // Update email verification status if changed
      if (user.emailVerified !== profile.emailVerified) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            emailVerified: user.emailVerified,
            updatedAt: new Date()
          });
          profile.emailVerified = user.emailVerified;
        } catch (updateError) {
          console.warn('Failed to update email verification status:', updateError);
        }
      }

      // Send verification email if not verified
      if (!user.emailVerified) {
        try {
          await sendEmailVerification(user, {
            url: `${window.location.origin}/?verified=true`,
            handleCodeInApp: false
          });
          lastVerificationSent = Date.now();
          console.log('Verification email sent');
        } catch (verificationError) {
          console.warn('Email verification failed:', verificationError);
          // Don't throw error for verification failure
        }
      }

      console.log('Sign in completed successfully');
      return { user, profile };
    } catch (error: any) {
      console.error('Sign in error details:', {
        code: error?.code,
        message: error?.message,
        stack: error?.stack
      });

      // Check for specific Firestore permission errors
      if (error?.code === 'permission-denied' || error?.message?.includes('Missing or insufficient permissions')) {
        throw new Error('Permission denied. Please ensure Email/Password authentication is enabled in Firebase Console and Firestore security rules are properly configured.');
      }

      throw this.handleAuthError(error as AuthError);
    }
  }

  // Logout user
  static async logout() {
    try {
      await signOut(auth);
      // Clear any cached data
      localStorage.clear();
      sessionStorage.clear();
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  // Resend verification email
  static async resendVerification(user: User) {
    try {
      // Check rate limiting
      const now = Date.now();
      if (now - lastVerificationSent < VERIFICATION_COOLDOWN) {
        const remainingTime = Math.ceil((VERIFICATION_COOLDOWN - (now - lastVerificationSent)) / 1000);
        throw new Error(`Please wait ${remainingTime} seconds before requesting another verification email`);
      }

      if (user.emailVerified) {
        throw new Error('Email is already verified');
      }

      await sendEmailVerification(user, {
        url: `${window.location.origin}/?verified=true`,
        handleCodeInApp: false
      });
      
      lastVerificationSent = now;
    } catch (error) {
      console.error('Resend verification error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to send verification email. Please try again.');
    }
  }

  // Get user profile
  static async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const profileDoc = await getDoc(doc(db, 'users', uid));
      return profileDoc.exists() ? profileDoc.data() as UserProfile : null;
    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  // Update user profile
  static async updateUserProfile(uid: string, updates: Partial<UserProfile>) {
    try {
      await updateDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // Handle Firebase Auth errors
  private static handleAuthError(error: AuthError): Error {
    console.error('Handling auth error:', error.code, error.message);

    switch (error.code) {
      case 'auth/email-already-in-use':
        return new Error('An account with this email already exists. Please sign in instead.');
      case 'auth/weak-password':
        return new Error('Password should be at least 6 characters long.');
      case 'auth/invalid-email':
        return new Error('Please enter a valid email address.');
      case 'auth/user-not-found':
        return new Error('No account found with this email address.');
      case 'auth/wrong-password':
        return new Error('Incorrect password. Please try again.');
      case 'auth/invalid-credential':
        return new Error('Invalid email or password. Please check your credentials and try again.');
      case 'auth/too-many-requests':
        return new Error('Too many failed attempts. Please try again later.');
      case 'auth/network-request-failed':
        return new Error('Network error. Please check your connection and try again.');
      case 'permission-denied':
        return new Error('Permission denied. Please ensure Firebase is properly configured.');
      default:
        return new Error(error.message || 'An authentication error occurred. Please try again.');
    }
  }
}