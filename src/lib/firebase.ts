import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration - hardcoded as requested
const firebaseConfig = {
  apiKey: "AIzaSyC6apxhPOMfN8sZCLC0QB3Zv0Ys27YAzfM",
  authDomain: "jblogistics-91fe4.firebaseapp.com",
  projectId: "jblogistics-91fe4",
  storageBucket: "jblogistics-91fe4.firebasestorage.app",
  messagingSenderId: "145924067290",
  appId: "1:145924067290:web:ef8a339ef042da49a1bae3",
  measurementId: "G-CRGCFY54JG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize analytics only in production and when supported
let analytics;
try {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn('Analytics not available:', error);
}
export { analytics };

// Export the app instance
export default app;

// Types for our application
export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shipment {
  id: string;
  userId: string;
  trackingNumber: string;
  recipient: string;
  destination: string;
  status: 'processing' | 'in-transit' | 'delivered' | 'cancelled';
  service: string;
  createdAt: Date | any;
  estimatedDelivery?: Date;
}

export interface Payment {
  id: string;
  userId: string;
  trackingId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentMethod: 'bank_transfer' | 'card' | 'other';
  paymentReference: string;
  status: 'processing' | 'received' | 'declined';
  createdAt: Date | any;
  confirmedAt?: Date | any;
  confirmedBy?: string;
  declinedAt?: Date | any;
  declinedBy?: string;
}