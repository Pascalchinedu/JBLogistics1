# Deploy Firestore Indexes

## Issue
The tracking page requires Firestore indexes to query shipments by `trackingNumber` and `waybillNumber`. Without these indexes, tracking queries will fail with a "failed-precondition" error.

## Solution
Deploy the `firestore.indexes.json` file to your Firebase project.

## Deployment Steps

### Option 1: Firebase Console (Recommended for Quick Fix)

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Indexes** tab
4. Click **"Create Index"** or **"Add Index"**
5. For each field that needs indexing, create a **Single Field Index**:
   
   **Index 1: trackingNumber**
   - Collection ID: `shipments`
   - Field to index: `trackingNumber`
   - Query scope: Collection
   - Order: Ascending
   
   **Index 2: waybillNumber**
   - Collection ID: `shipments`
   - Field to index: `waybillNumber`
   - Query scope: Collection
   - Order: Ascending
   
   **Index 3: userId**
   - Collection ID: `shipments`
   - Field to index: `userId`
   - Query scope: Collection
   - Order: Ascending

6. Click **"Create"** for each index
7. Wait 1-5 minutes for indexes to build
8. Test the tracking page

### Option 2: Firebase CLI (For Production Deployment)

1. Install Firebase CLI (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init firestore
   ```

4. Deploy the indexes:
   ```bash
   firebase deploy --only firestore:indexes
   ```

5. Wait for deployment to complete
6. Test the tracking page

## Verification

After deploying the indexes:

1. Go to your website's tracking page
2. Enter a tracking number (e.g., from your shipments)
3. Click "Track Package"
4. The tracking results should now display correctly
5. Check the browser console - the Firestore index warning should be gone

## Notes

- **Build Time**: Indexes typically take 1-5 minutes to build
- **Automatic Index Creation**: When you run a query that requires an index, Firebase will provide a link in the console to automatically create it
- **Combined with Security Rules**: Make sure you've also deployed the `firestore.rules` file (see DEPLOY_FIRESTORE_RULES.md)

## Troubleshooting

If tracking still doesn't work after deploying indexes:

1. Check browser console for errors
2. Verify you're logged in (tracking requires authentication)
3. Ensure the tracking number exists in your database
4. Check that Firestore security rules allow reading shipments
5. Wait a few more minutes for indexes to finish building
