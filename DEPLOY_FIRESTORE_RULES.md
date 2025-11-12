# Deploy Updated Firestore Security Rules

## The Problem
Your Firestore database was blocking payment record creation because the `payments` collection had no security rules defined.

## What Was Fixed
Added security rules for the `payments` collection in `firestore.rules`:

```javascript
match /payments/{paymentId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow update: if request.auth != null;
}
```

## How to Deploy the Rules

### Option 1: Firebase Console (Easiest)
1. Go to https://console.firebase.google.com/
2. Select your project: **jblogistics-91fe4**
3. Click on **Firestore Database** in the left menu
4. Click on the **Rules** tab at the top
5. Copy the entire content from the `firestore.rules` file in this project
6. Paste it into the Firebase Console rules editor
7. Click **Publish** button

### Option 2: Firebase CLI (Advanced)
If you have Firebase CLI installed:
```bash
firebase login
firebase deploy --only firestore:rules
```

## After Deploying
Once the rules are deployed:
1. Wait 30-60 seconds for the rules to propagate
2. Try creating a shipment again with a payment reference
3. The error should be gone and shipments should be created successfully

## What This Allows
- ✅ Authenticated users can create payment records
- ✅ Authenticated users can read all payment records (needed for admin panel)
- ✅ Authenticated users can update payment status (needed for admin confirmations)
- ✅ Security maintained - only authenticated users have access
