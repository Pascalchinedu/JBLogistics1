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
3. **Payment Integration**: Paystack for card payments, bank transfers
4. **Service Pages**: Local bike delivery, nationwide delivery, express delivery
5. **Real-time Tracking**: Package tracking with status updates
6. **Admin Panel**: Status update functionality
7. **Responsive Design**: Mobile-first, works on all devices

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

## Recent Changes (Nov 10, 2025)
- Configured Vite for Replit environment (port 5000, host 0.0.0.0)
- Set up HMR for WSS proxy support
- Configured deployment settings for autoscale
- Fixed unused import warnings in firebase.ts
- Verified build process works correctly
- **Fixed image display issues**: Renamed all image files in public folder to remove spaces
  - Old: `WhatsApp Image 2025-08-22 at 00.35.18_2c489b1f.jpg`
  - New: `delivery-person-1.jpg`, `delivery-person-2.jpg`, etc.
- Updated all image references in Hero.tsx, Industries.tsx, and WhyChooseUs.tsx

## Development Notes
- The app uses Firebase Firestore for data storage
- Payment integration uses Paystack test keys (change for production)
- Analytics disabled on localhost for development
- Large bundle size warning present (905KB) - consider code splitting for optimization
