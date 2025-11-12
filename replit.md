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
4. **Service Pages**: Local bike delivery, nationwide delivery, express delivery
5. **Real-time Tracking**: Package tracking with status updates
6. **Admin Panel**: Status update functionality
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

## Recent Changes (Nov 12, 2025)
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
