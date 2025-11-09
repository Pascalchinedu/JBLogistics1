# Quick Start Guide - Paystack Payment Integration

## Testing the Implementation

### 1. Start the Development Server
The dev server starts automatically in this environment.

### 2. Navigate to Package Creation
- Go to "Send Package" or "Create Waybill Transfer"
- Fill in all required form fields

### 3. Test Payment Flow

#### Option A: Card Payment
1. Click the submit button
2. Payment modal opens
3. Click "Pay with Card"
4. Paystack payment interface opens
5. Use these test details:
   - **Card Number**: `4084084084084081`
   - **CVV**: `408`
   - **Expiry**: `01/30`
   - **PIN**: `0000`
6. Complete payment
7. Package is created with tracking number

#### Option B: Bank Transfer (Paystack)
1. Click the submit button
2. Payment modal opens
3. Click "Bank Transfer (via Paystack)"
4. Follow Paystack's bank transfer instructions
5. Complete payment
6. Package is created with tracking number

#### Option C: Manual Bank Transfer
1. Click the submit button
2. Payment modal opens
3. Click "Manual Bank Transfer"
4. View bank details:
   - Bank: Guaranty Trust Bank
   - Account: 0123456789
   - Name: JB Logistics Limited
5. Enter any transaction reference
6. Click "Submit Reference"
7. Package is created with tracking number

## What to Verify

### ✅ Payment Modal
- [ ] Modal opens when form is submitted
- [ ] Shows correct package details
- [ ] Shows correct amount (₦3,000 or ₦5,000)
- [ ] All three payment buttons work
- [ ] Close button works without submitting

### ✅ Card Payment
- [ ] Paystack popup opens
- [ ] Test card works
- [ ] Payment success triggers package creation
- [ ] Tracking number is displayed
- [ ] Modal closes after success

### ✅ Bank Transfer
- [ ] Paystack bank transfer interface opens
- [ ] Shows bank account details
- [ ] Payment completion works
- [ ] Package created with reference

### ✅ Manual Transfer
- [ ] Shows bank details screen
- [ ] Can input transaction reference
- [ ] Submit button works
- [ ] Package created with entered reference

### ✅ Data Storage
- [ ] Check browser console for Firebase save confirmation
- [ ] Check console for webhook POST logs
- [ ] Check console for webhook GET logs
- [ ] Payment reference included in logs

### ✅ Error Handling
- [ ] Try closing payment popup (should not create package)
- [ ] Try submitting empty reference (should show error)
- [ ] Check loading states work properly

## Console Messages to Look For

### Success Flow
```
Payment complete! Reference: JBL-PAY-1730472835123-456789
Package saved to Firestore with ID: abc123
✅ n8n POST webhook triggered successfully
✅ n8n GET webhook triggered successfully
```

### Payment Cancelled
```
Payment popup closed
Transaction was not completed
```

## File Structure

```
project/
├── index.html (Paystack script added)
├── src/
│   ├── components/
│   │   ├── CreateShipment.tsx (payment integrated)
│   │   ├── CreateWaybillShipment.tsx (payment integrated)
│   │   └── PaymentModal.tsx (new)
│   ├── utils/
│   │   └── paymentUtils.ts (new)
│   └── types/
│       └── paystack.d.ts (new)
└── Documentation files
```

## Key Configuration

### Paystack Public Key
```typescript
// src/utils/paymentUtils.ts
export const PAYSTACK_PUBLIC_KEY = 'pk_test_ec8654f9aef9127748e8bf02e809dff04d901aaa';
```

### Bank Details
```typescript
// src/components/PaymentModal.tsx (Line ~117)
Bank Name: Guaranty Trust Bank
Account Number: 0123456789
Account Name: JB Logistics Limited
```

## Common Issues & Solutions

### Issue: "Payment system is not ready"
**Solution**: Wait a few seconds for Paystack script to load, then try again.

### Issue: Payment modal doesn't open
**Solution**:
1. Check browser console for errors
2. Verify form validation passes
3. Ensure all required fields are filled

### Issue: Payment succeeds but package not created
**Solution**:
1. Check browser console for errors
2. Verify Firebase connection
3. Check webhook URLs are accessible

### Issue: TypeScript errors
**Solution**:
1. Restart TypeScript server
2. Run `npm run build` to check for errors
3. Verify types in `src/types/paystack.d.ts`

## Browser DevTools Tips

### View Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "paystack" to see payment requests
4. Filter by "webhook" to see n8n calls

### View Console Logs
1. Open DevTools (F12)
2. Go to Console tab
3. Look for payment-related logs
4. Check for errors (red text)

### View Local Storage
1. Open DevTools (F12)
2. Go to Application tab
3. Check Local Storage for backup form data

## Production Deployment Checklist

Before deploying to production:

- [ ] Replace test key with live Paystack key
- [ ] Update bank account details
- [ ] Test with real payment methods
- [ ] Set up payment verification webhook
- [ ] Configure production webhook URLs
- [ ] Test error scenarios
- [ ] Set up payment monitoring
- [ ] Add payment receipt generation
- [ ] Configure email notifications
- [ ] Test on all target browsers
- [ ] Perform security audit
- [ ] Update documentation with production details

## Support & Documentation

- **Full Documentation**: See `PAYMENT_INTEGRATION.md`
- **Code Examples**: See `PAYMENT_USAGE_EXAMPLES.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Paystack Docs**: https://paystack.com/docs

## Quick Test Script

Run in browser console to verify Paystack is loaded:
```javascript
if (window.PaystackPop) {
  console.log('✅ Paystack loaded successfully');
} else {
  console.log('❌ Paystack not loaded');
}
```

## Environment Check

```bash
# Build the project
npm run build

# Start dev server (automatic in this environment)
# Navigate to: http://localhost:5173
```

## Success Indicators

✅ Payment modal opens smoothly
✅ Paystack interface loads quickly
✅ Test payments complete successfully
✅ Tracking numbers are generated
✅ Payment references are stored
✅ Webhooks are triggered
✅ No console errors
✅ Build completes without warnings

---

**Ready to test!** Start by navigating to the shipment creation page and testing each payment method.
