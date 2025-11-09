export const PAYSTACK_PUBLIC_KEY = 'pk_test_ec8654f9aef9127748e8bf02e809dff04d901aaa';

export const generatePaymentReference = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  return `JBL-PAY-${timestamp}-${random}`;
};

export interface PaymentData {
  email: string;
  amount: number;
  reference: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export const initializePaystack = (paymentData: PaymentData): void => {
  if (typeof window === 'undefined' || !(window as any).PaystackPop) {
    console.error('Paystack script not loaded');
    alert('Payment system is not ready. Please refresh the page and try again.');
    return;
  }

  const handler = (window as any).PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: paymentData.email,
    amount: paymentData.amount * 100,
    currency: 'NGN',
    ref: paymentData.reference,
    callback: function(response: any) {
      console.log('Payment complete! Reference: ' + response.reference);
      paymentData.onSuccess(response.reference);
    },
    onClose: function() {
      console.log('Payment popup closed');
      paymentData.onClose();
    }
  });

  handler.openIframe();
};

export const initializePaystackWithBankTransfer = (paymentData: PaymentData): void => {
  if (typeof window === 'undefined' || !(window as any).PaystackPop) {
    console.error('Paystack script not loaded');
    alert('Payment system is not ready. Please refresh the page and try again.');
    return;
  }

  const handler = (window as any).PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: paymentData.email,
    amount: paymentData.amount * 100,
    currency: 'NGN',
    ref: paymentData.reference,
    channels: ['bank', 'bank_transfer'],
    callback: function(response: any) {
      console.log('Payment complete! Reference: ' + response.reference);
      paymentData.onSuccess(response.reference);
    },
    onClose: function() {
      console.log('Payment popup closed');
      paymentData.onClose();
    }
  });

  handler.openIframe();
};

export const isPaystackLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).PaystackPop;
};
