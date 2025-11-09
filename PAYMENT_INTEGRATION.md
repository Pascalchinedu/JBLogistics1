# Paystack Payment Integration Documentation

This document describes the Paystack payment integration implemented in the JB Logistics application.

## Overview

The application uses Paystack's inline JavaScript library for payment processing. Payment is required before package details are submitted to the system.

## Configuration

### Public Key
- **Test Key**: `pk_test_ec8654f9aef9127748e8bf02e809dff04d901aaa`
- **Location**: Hardcoded in `src/utils/paymentUtils.ts`

### Script Loading
The Paystack inline script is loaded in `index.html`:
```html
<script src="https://js.paystack.co/v1/inline.js"></script>
```

## Implementation Structure

### Files Created

1. **src/utils/paymentUtils.ts**
   - Contains payment utility functions
   - Handles Paystack initialization
   - Generates unique payment references
   - Exports: `initializePaystack()`, `initializePaystackWithBankTransfer()`, `generatePaymentReference()`, `isPaystackLoaded()`

2. **src/components/PaymentModal.tsx**
   - Payment modal component
   - Displays payment options (Card, Bank Transfer, Manual Transfer)
   - Shows package details and amount
   - Handles payment flow and user interactions

3. **src/types/paystack.d.ts**
   - TypeScript type definitions for Paystack
   - Ensures type safety when using `window.PaystackPop`

## Payment Flow

### 1. User Fills Shipment Form
- User enters all required shipment details
- Form validation occurs
- If valid, payment modal opens

### 2. Payment Modal Opens
- Displays three payment options:
  - **Pay with Card**: Opens Paystack card payment interface
  - **Bank Transfer (via Paystack)**: Opens Paystack bank transfer interface
  - **Manual Bank Transfer**: Shows hardcoded bank details for manual transfer

### 3. Payment Processing

#### Card Payment
```typescript
const reference = generatePaymentReference(); // Format: JBL-PAY-{timestamp}-{random}

initializePaystack({
  email: userEmail,
  amount: amount * 100, // Convert to kobo
  reference: reference,
  onSuccess: (ref) => {
    // Package creation proceeds with payment reference
  },
  onClose: () => {
    // User closed payment popup
  }
});
```

#### Bank Transfer (via Paystack)
```typescript
initializePaystackWithBankTransfer({
  email: userEmail,
  amount: amount * 100,
  reference: reference,
  channels: ['bank', 'bank_transfer'], // Restrict to bank transfer only
  onSuccess: (ref) => {
    // Package creation proceeds
  },
  onClose: () => {
    // User closed payment popup
  }
});
```

#### Manual Bank Transfer
- Shows hardcoded bank account details
- User performs transfer manually
- User inputs transaction reference
- Package creation proceeds with provided reference

### 4. Package Creation
After successful payment:
- Payment reference is stored with shipment data
- Payment status is set to 'paid'
- Data is saved to Firebase
- Webhooks are triggered with payment information
- Tracking number is generated and displayed

## Payment Reference Format

All payment references follow this pattern:
```
JBL-PAY-{timestamp}-{random6digits}
```

Example: `JBL-PAY-1730472835123-456789`

## Integration Points

### CreateShipment Component
- Normal package shipments
- Prices: ₦3,000 (Local Bike) or ₦5,000 (Express)
- Payment required before submission

### CreateWaybillShipment Component
- Waybill transfer shipments
- Fixed price: ₦3,000
- Payment required before submission

## Data Storage

Payment information is included in:

1. **Firebase Firestore** (`shipments` collection)
   ```typescript
   {
     trackingNumber: string,
     paymentReference: string,
     paymentStatus: 'paid',
     // ... other shipment data
   }
   ```

2. **Webhook Payloads** (POST and GET)
   ```typescript
   {
     paymentReference: string,
     paymentStatus: 'paid',
     // ... other shipment data
   }
   ```

## Error Handling

### Paystack Script Not Loaded
- Modal displays loading indicator
- Checks for `window.PaystackPop` availability
- Alerts user if script fails to load
- Prevents payment attempts until script is ready

### Payment Popup Closed
- `onClose` callback is triggered
- Modal remains open for retry
- No data is submitted

### Payment Failure
- Handled by Paystack's callback system
- User can retry payment
- No shipment data is created until successful payment

## Testing

### Test Credentials (Paystack Test Mode)
- **Card Number**: 4084084084084081
- **CVV**: Any 3 digits
- **Expiry**: Any future date
- **PIN**: 0000

### Test Bank Transfer
- Use Paystack's test bank transfer flow
- Follow on-screen instructions in test mode

## Security Considerations

1. **Public Key Only**: Only the public test key is exposed in the client
2. **Server Verification**: Payment verification should be implemented server-side
3. **Reference Validation**: Transaction references should be verified against Paystack API
4. **No Sensitive Data**: No card details are stored locally

## Manual Bank Transfer Details

**Bank**: Guaranty Trust Bank
**Account Number**: 0123456789
**Account Name**: JB Logistics Limited

> Note: These are placeholder details and should be updated with actual bank account information before production use.

## Currency

All transactions are in Nigerian Naira (NGN).

## Amount Conversion

Paystack requires amounts in kobo (smallest currency unit):
```typescript
const amountInKobo = amountInNaira * 100;
```

Example:
- ₦3,000 = 300,000 kobo
- ₦5,000 = 500,000 kobo

## Future Enhancements

1. **Payment Verification**: Implement server-side payment verification
2. **Payment History**: Add payment history view in user dashboard
3. **Receipt Generation**: Auto-generate payment receipts
4. **Refund Processing**: Implement refund workflow
5. **Multiple Payment Methods**: Add more payment options (USSD, QR codes)
6. **Payment Analytics**: Track payment success rates and user preferences

## Support

For payment-related issues:
1. Check browser console for Paystack errors
2. Verify Paystack script is loaded
3. Ensure test credentials are used in test mode
4. Contact Paystack support for API issues

## Additional Resources

- [Paystack Documentation](https://paystack.com/docs)
- [Paystack Inline JS Docs](https://paystack.com/docs/payments/accept-payments)
- [Paystack Test Cards](https://paystack.com/docs/payments/test-payments)
