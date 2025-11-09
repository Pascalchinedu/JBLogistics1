# Payment Integration Usage Examples

## Quick Start

### 1. Basic Card Payment

```typescript
import { initializePaystack, generatePaymentReference } from '../utils/paymentUtils';

const handlePayment = () => {
  const reference = generatePaymentReference();

  initializePaystack({
    email: 'user@example.com',
    amount: 5000, // ₦5,000
    reference: reference,
    onSuccess: (ref) => {
      console.log('Payment successful:', ref);
      // Proceed with order creation
    },
    onClose: () => {
      console.log('Payment cancelled');
      // Handle cancellation
    }
  });
};
```

### 2. Bank Transfer Payment

```typescript
import { initializePaystackWithBankTransfer, generatePaymentReference } from '../utils/paymentUtils';

const handleBankTransfer = () => {
  const reference = generatePaymentReference();

  initializePaystackWithBankTransfer({
    email: 'user@example.com',
    amount: 3000, // ₦3,000
    reference: reference,
    onSuccess: (ref) => {
      console.log('Payment successful:', ref);
      // Proceed with order creation
    },
    onClose: () => {
      console.log('Payment cancelled');
      // Handle cancellation
    }
  });
};
```

### 3. Using the Payment Modal Component

```typescript
import React, { useState } from 'react';
import PaymentModal from './PaymentModal';

const MyComponent = () => {
  const [showModal, setShowModal] = useState(false);

  const handlePaymentSuccess = (reference: string) => {
    console.log('Payment reference:', reference);
    setShowModal(false);
    // Create order with payment reference
  };

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Pay Now
      </button>

      <PaymentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        amount={5000}
        email="user@example.com"
        onPaymentSuccess={handlePaymentSuccess}
        packageDetails={{
          description: "Electronics",
          serviceType: "Express Delivery"
        }}
      />
    </>
  );
};
```

## Complete Payment Flow Example

```typescript
import React, { useState } from 'react';
import PaymentModal from './components/PaymentModal';
import { db } from './lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

const ShipmentForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    description: '',
    serviceType: ''
  });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentRef, setPaymentRef] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    // Open payment modal
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (reference: string) => {
    setShowPayment(false);
    setPaymentRef(reference);

    try {
      // Create shipment with payment reference
      await addDoc(collection(db, 'shipments'), {
        ...formData,
        paymentReference: reference,
        paymentStatus: 'paid',
        createdAt: new Date()
      });

      alert('Shipment created successfully!');
    } catch (error) {
      console.error('Error creating shipment:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit">Continue to Payment</button>
      </form>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={5000}
        email={formData.email}
        onPaymentSuccess={handlePaymentSuccess}
        packageDetails={{
          description: formData.description,
          serviceType: formData.serviceType
        }}
      />
    </>
  );
};
```

## Testing Payments

### Test Card Payment

```typescript
// In test mode, use these test cards:
const testCards = {
  success: {
    number: '4084084084084081',
    cvv: '408',
    expiry: '01/30',
    pin: '0000'
  },
  insufficientFunds: {
    number: '5060666666666666666',
    cvv: '123',
    expiry: '01/30',
    pin: '0000'
  }
};
```

### Checking if Paystack is Ready

```typescript
import { isPaystackLoaded } from '../utils/paymentUtils';

const PaymentButton = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkPaystack = setInterval(() => {
      if (isPaystackLoaded()) {
        setReady(true);
        clearInterval(checkPaystack);
      }
    }, 100);

    return () => clearInterval(checkPaystack);
  }, []);

  return (
    <button disabled={!ready}>
      {ready ? 'Pay Now' : 'Loading payment system...'}
    </button>
  );
};
```

## Webhook Integration

```typescript
// Include payment reference in webhook payload
const webhookPayload = {
  trackingNumber: 'JBL-12345',
  paymentReference: 'JBL-PAY-1730472835123-456789',
  paymentStatus: 'paid',
  amount: 5000,
  email: 'user@example.com',
  // ... other data
};

await fetch('https://your-webhook-url.com', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(webhookPayload)
});
```

## Error Handling

```typescript
const handlePaymentWithErrorHandling = () => {
  if (!isPaystackLoaded()) {
    alert('Payment system is not ready. Please refresh the page.');
    return;
  }

  const reference = generatePaymentReference();

  try {
    initializePaystack({
      email: 'user@example.com',
      amount: 5000,
      reference: reference,
      onSuccess: (ref) => {
        console.log('Success:', ref);
        // Handle success
      },
      onClose: () => {
        console.log('User closed payment');
        // Don't show error, user intentionally closed
      }
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    alert('Failed to start payment. Please try again.');
  }
};
```

## Custom Payment Reference

```typescript
// Default format: JBL-PAY-{timestamp}-{random}
const reference = generatePaymentReference();

// Custom format
const customReference = `ORDER-${orderId}-${Date.now()}`;

initializePaystack({
  email: 'user@example.com',
  amount: 5000,
  reference: customReference, // Use custom reference
  onSuccess: (ref) => {
    console.log('Payment ref:', ref);
  },
  onClose: () => {}
});
```

## Amount Calculation

```typescript
// Always multiply by 100 for kobo
const priceInNaira = 3000; // ₦3,000
const priceInKobo = priceInNaira * 100; // 300,000 kobo

// The utility function handles this automatically
initializePaystack({
  amount: 3000, // Pass in Naira, converted internally to 300,000 kobo
  // ... other options
});
```

## Manual Bank Transfer Flow

```typescript
const ManualTransferComponent = () => {
  const [reference, setReference] = useState('');

  const handleManualSubmit = () => {
    if (!reference.trim()) {
      alert('Please enter transaction reference');
      return;
    }

    // Proceed with reference verification
    verifyPayment(reference);
  };

  return (
    <div>
      <h3>Bank Transfer Details</h3>
      <p>Bank: Guaranty Trust Bank</p>
      <p>Account: 0123456789</p>
      <p>Amount: ₦3,000</p>

      <input
        type="text"
        placeholder="Enter transaction reference"
        value={reference}
        onChange={(e) => setReference(e.target.value)}
      />

      <button onClick={handleManualSubmit}>
        Submit Reference
      </button>
    </div>
  );
};
```

## Production Checklist

- [ ] Replace test public key with live key
- [ ] Update manual bank account details
- [ ] Implement server-side payment verification
- [ ] Set up webhook for payment notifications
- [ ] Test all payment flows in live mode
- [ ] Add payment confirmation emails
- [ ] Implement payment receipt generation
- [ ] Set up payment monitoring/alerts
