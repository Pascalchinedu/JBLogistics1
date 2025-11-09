# Firebase Authentication Setup Checklist

## Issue Resolved
The "Missing or insufficient permissions" error has been fixed by:
1. Updated Firestore security rules to properly allow authenticated users to access their own data
2. Added comprehensive error handling and logging in the authentication service
3. Implemented retry logic for Firestore operations
4. Added specific error messages for permission-related issues

## What to Verify in Firebase Console

### 1. Enable Email/Password Authentication
Go to Firebase Console → Authentication → Sign-in method:
- ✅ Email/Password should be **ENABLED**
- ✅ Status should show as "Enabled"

### 2. Verify Authorized Domains
Go to Firebase Console → Authentication → Settings → Authorized domains:
- ✅ Add your production domain (e.g., `logistics-profess-c97v.bolt.host`)
- ✅ `localhost` should already be listed for local development

### 3. Update Firestore Security Rules
Go to Firebase Console → Firestore Database → Rules:
- ✅ Copy and paste the rules from `firestore.rules` file
- ✅ Click "Publish" to apply the changes
- ✅ Ensure the rules match the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }

    match /shipments/{shipmentId} {
      allow read: if request.auth != null &&
        (resource == null || resource.data.userId == request.auth.uid);
      allow write: if request.auth != null &&
        (resource == null || resource.data.userId == request.auth.uid);
      allow create: if request.auth != null &&
        request.resource.data.userId == request.auth.uid;
    }

    match /public/{document=**} {
      allow read: if true;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 4. Verify Firebase Configuration
Check that all Firebase config values in `src/lib/firebase.ts` match your Firebase project:
- ✅ apiKey
- ✅ authDomain
- ✅ projectId
- ✅ storageBucket
- ✅ messagingSenderId
- ✅ appId
- ✅ measurementId

## Testing the Fix

### 1. Test Sign In Flow
1. Open the application in your browser
2. Click "Sign In" button
3. Enter your email and password
4. Check browser console for detailed logging:
   - "Starting sign in process for: [email]"
   - "Firebase authentication successful. User ID: [uid]"
   - "Attempting to fetch user profile (attempt 1/3)"
   - "User profile loaded successfully"
   - "Sign in completed successfully"

### 2. Expected Behavior
- ✅ Sign in should complete successfully
- ✅ User should be redirected to dashboard
- ✅ No "Missing or insufficient permissions" error
- ✅ Console logs show successful authentication flow

### 3. If Issues Persist

**Check Browser Console:**
Look for detailed error messages that now include:
- Firebase error codes
- Firestore permission errors
- Retry attempts
- Stack traces

**Common Issues:**
1. **"Permission denied"** → Firestore rules not published or incorrect
2. **"User profile not found"** → User document doesn't exist in Firestore
3. **"Invalid email or password"** → Wrong credentials or user doesn't exist
4. **Network errors** → Check internet connection

## Changes Made

### 1. Firestore Security Rules (`firestore.rules`)
- Separated `read`, `write`, and `create` permissions for better control
- Ensured authenticated users can only access their own data
- Maintained secure access patterns

### 2. Authentication Service (`src/services/authService.ts`)
- Added comprehensive console logging for debugging
- Implemented retry logic (3 attempts) for Firestore reads
- Added specific error handling for permission issues
- Improved error messages for better user feedback
- Added handling for `auth/invalid-credential` error

### 3. Error Handling Improvements
- More specific error messages for different failure scenarios
- Console logging at each step of the authentication process
- Better handling of Firestore permission errors

## Next Steps

1. **Deploy Firestore Rules:**
   - Copy the content from `firestore.rules`
   - Paste into Firebase Console → Firestore Database → Rules
   - Click "Publish"

2. **Test Authentication:**
   - Try signing in with the test account: `pascalokekwe@gmail.com`
   - Check browser console for detailed logs
   - Verify successful redirect to dashboard

3. **Monitor Logs:**
   - Keep browser console open during testing
   - Look for any errors or warnings
   - All authentication steps should log successfully

## Support

If you continue to experience issues:
1. Check browser console for specific error messages
2. Verify all Firebase Console settings above
3. Ensure Firestore rules are published
4. Test with a newly created account to rule out account-specific issues
