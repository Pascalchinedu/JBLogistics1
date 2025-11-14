# JB Logistics Professional Website

## Overview
A modern, responsive logistics website built with React, TypeScript, and Tailwind CSS. This professional website showcases JB Logistics' comprehensive delivery services across Nigeria, including package tracking, shipment creation, and payment integration with Paystack.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend/Auth**: Firebase (Authentication, Firestore Database)
- **Payment**: Paystack integration for online payments
- **Routing**: React Router DOM v7
- **Icons**: Lucide React

## Project Setup (Replit Environment)

### Development Server
- **Port**: 5000 (configured for Replit webview)
- **Host**: 0.0.0.0 (allows proxy access)
- **HMR**: Configured for WSS protocol on port 443
- **Command**: `npm run dev`

### Deployment Configuration
- **Target**: Autoscale (stateless web app)
- **Build**: `npm run build`
- **Run**: `npm run preview`
- **Output**: `dist/` directory

### Environment Configuration
Firebase configuration is hardcoded in `src/lib/firebase.ts` (as requested by original developer). No environment variables are required for basic operation. The Firebase API keys are public-facing client keys secured through Firebase Security Rules and domain restrictions.

## Key Features
1. **Authentication System**: User registration and login with Firebase
2. **Shipment Management**: Create and track packages
3. **Payment Integration**: 
   - Paystack for card payments and automated bank transfers
   - Manual bank transfer to Moniepoint account (6746468396)
   - Payment reference verification before shipment creation
   - Admin payment management system with confirmation workflow
4. **Service Pages**: Local bike delivery, nationwide delivery, express delivery
5. **Real-time Tracking**: Package tracking with status updates
6. **Admin Panel**: 
   - Package status update functionality
   - Payment management with filtering (All/Processing/Received)
   - Admin password: jblogistics2025
7. **Responsive Design**: Mobile-first, works on all devices
8. **Webhook Integration**: n8n webhook receives all shipment data including payment reference

## Project Structure
```
src/
├── components/         # React components
│   ├── auth/          # Login/registration components
│   ├── services/      # Service-specific pages
│   └── ...            # Other UI components
├── contexts/          # React contexts (AuthContext)
├── lib/               # Firebase configuration
├── services/          # API services (Airtable, Auth)
├── types/             # TypeScript type definitions
└── utils/             # Utility functions (payment helpers)
```

## Important Files
- `vite.config.ts`: Vite configuration with Replit proxy settings
- `src/lib/firebase.ts`: Firebase initialization and configuration
- `src/utils/paymentUtils.ts`: Paystack payment integration
- `src/components/PaymentModal.tsx`: Payment UI component
- `.replit`: Replit deployment configuration

## Services Offered
1. Local Bike Delivery - Same-day delivery within Port Harcourt
2. Nationwide Delivery - Interstate shipping to all 36 states
3. Express Delivery - Ultra-fast 1-2 hour delivery service
4. Special Services - COD and emergency delivery options

## Recent Changes (Nov 14, 2025)

### Mobile UI Optimization
- **Improved mobile responsiveness across key components (Mobile-only changes - desktop unchanged):**
  - **Package Type Selection Modal:**
    - Fixed alignment issues - modal now properly fills viewport width on mobile
    - Eliminated white space gaps on mobile screens
    - File modified: `ShipmentTypeModal.tsx`
  
  - **Admin Payment Management:**
    - Removed count numbers from filter tabs on mobile (e.g., "All" instead of "All (2)")
    - Added horizontal scroll for filter tabs on mobile when they overflow
    - Desktop view maintains count numbers and original layout
    - File modified: `AdminPaymentManagement.tsx`
  
  - **Bank Transfer Details Modal:**
    - Reduced modal height on mobile to prevent full-screen takeover
    - Reduced padding and spacing for more compact appearance on mobile
    - Modal now feels like a focused card rather than full-page experience
    - Desktop spacing and layout preserved
    - File modified: `PaymentModal.tsx`
  
  - **Package Created Successfully Pages:**
    - Made success pages more compact on mobile with reduced spacing
    - Smaller typography and icons on mobile (text-2xl vs md:text-4xl for headings)
    - Reduced padding throughout for better mobile fit
    - Desktop maintains original large typography and generous spacing
    - Files modified: `CreateShipment.tsx`, `CreateWaybillShipment.tsx`

## Previous Changes (Nov 12, 2025)

### UI/UX Improvements to Admin Panel and Package Selection Modal
- **Package Type Modal Size Adjustment:**
  - Reduced modal size on desktop/tablet screens from `max-w-2xl` to `max-w-lg` for a more moderate appearance
  - Kept mobile view unchanged (full-width `max-w-2xl`) for better mobile UX
  - File modified: `ShipmentTypeModal.tsx`

- **Admin Payment Management Enhancements:**
  - Removed "Method" and "Action" column headers from payment table for cleaner layout
  - Added "Decline Payment" functionality with red decline button alongside green confirm button
  - Added "Declined" status filter tab with live count
  - Declined payments now show red status badge with X icon
  - Updated Payment type to include 'declined' status with declinedAt and declinedBy fields
  - Consolidated status badge and action buttons into single Status column for better space utilization
  - Files modified: `AdminPaymentManagement.tsx`, `firebase.ts`

### Fixed Firebase Permissions Issue
- **Root Cause:** The `payments` collection had no security rules defined, causing all writes to be blocked by the catch-all deny rule
- **Fix Applied:** Added comprehensive security rules for the `payments` collection in `firestore.rules`:
  - `allow read: if request.auth != null` - Authenticated users can read payment records
  - `allow create: if request.auth != null` - Authenticated users can create payment records
  - `allow update: if request.auth != null` - Authenticated users can update payment status
- **Action Required:** Deploy updated `firestore.rules` to Firebase Console (see DEPLOY_FIRESTORE_RULES.md for instructions)
- **Files Modified:** `firestore.rules`

## Previous Changes (Nov 12, 2025)

### Admin Payment Management System
- **Implemented Complete Payment Management:**
  - Created Payment interface in `src/lib/firebase.ts` with fields: userId, trackingId, customerName, customerEmail, customerPhone, amount, paymentMethod, paymentReference, status, confirmedBy, confirmedAt
  - Built `AdminPaymentManagement.tsx` component with comprehensive payment table displaying:
    - Payment ID, Tracking ID, Customer info, Amount, Payment Method, Date, Status, and Action columns
    - Status filtering with All/Processing/Received buttons showing live counts
    - Confirm Payment button for processing payments
    - Optimistic UI updates for instant feedback
  - Updated `AdminStatusUpdate.tsx` with tab navigation between "Packages" and "Payments" tabs
  - Integrated payment record creation in both `CreateShipment.tsx` and `CreateWaybillShipment.tsx` forms
  - Updated user `Dashboard.tsx` to display payment status column:
    - Dual-query loading strategy (shipments first, then payments)
    - Payment lookup map by trackingId for efficient status retrieval
    - Payment status badges in both overview and full shipments tables (yellow for Processing, green for Received, gray for Not Recorded)
  - Filter state persists after confirming payments for seamless admin workflow

### Animation & Image Updates
- **Implemented Scroll-Based Animations:**
  - FAQ section now has sequential rise-up animation - each question appears one after another with 150ms staggering
  - Track Your Package section (NavigationTabs) has smooth rise-up animation for buttons and content
  - Animations use Intersection Observer API for performance
  - Auto-cleanup after trigger to prevent redundant state updates
  
- **Added New Professional Images:**
  - Generated and added `our-story-delivery.png` - Professional delivery service image for About page "Our Story" section
  - Generated and added `logistics-worker-yellow.png` - Logistics worker image for "Explore Logistics Solutions by Industry" section
  - Images are fully responsive and properly optimized
  - All placeholder images replaced with professional logistics photography

### Payment System Configuration
- **Configured Payment System with Manual Bank Transfer:**
  - Updated PaymentModal.tsx with Moniepoint bank details
  - Bank: Moniepoint, Account: 6746468396, Name: JAYBON GLOBAL LOGISTICS SERVICES
  - Users must provide payment reference/transaction ID before shipment creation
  - Payment reference is sent to n8n webhook for verification
  - Works for both Normal Delivery and Waybill Delivery forms

## Recent Changes (Nov 10, 2025)
- Configured Vite for Replit environment (port 5000, host 0.0.0.0)
- Set up HMR for WSS proxy support
- Configured deployment settings for autoscale
- Fixed unused import warnings in firebase.ts
- Verified build process works correctly
- **Uploaded and configured all brand images**:
  - `hero-delivery-van.jpg` - Main hero section image (We're still Delivering)
  - `hello-october.jpg` - Promotional banner image
  - `heavy-truck.jpg` - Heavy shipment/truck delivery image
  - `car-delivery.jpg` - Car delivery service image
  - `waybill-info.jpg` - Waybill pickup information image
- Updated all image references across:
  - Hero.tsx - Hero section with main delivery image
  - WhyChooseUs.tsx - Promotional banner background
  - Industries.tsx - All 4 industry cards
  - MainServices.tsx - All 3 delivery options and 4 industry services
- All images are now displaying correctly throughout the website

## Development Notes
- The app uses Firebase Firestore for data storage
- Payment integration uses Paystack test keys (change for production)
- Analytics disabled on localhost for development
- Large bundle size warning present (905KB) - consider code splitting for optimization
