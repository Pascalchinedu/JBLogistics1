import React, { useState, useEffect } from 'react';
import { CreditCard, Building2, X, AlertCircle, CheckCircle } from 'lucide-react';
import { initializePaystack, initializePaystackWithBankTransfer, generatePaymentReference, isPaystackLoaded } from '../utils/paymentUtils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  email: string;
  onPaymentSuccess: (reference: string) => void;
  packageDetails: {
    description: string;
    serviceType: string;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  email,
  onPaymentSuccess,
  packageDetails
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [transactionReference, setTransactionReference] = useState('');
  const [paystackReady, setPaystackReady] = useState(false);

  useEffect(() => {
    const checkPaystack = () => {
      if (isPaystackLoaded()) {
        setPaystackReady(true);
      } else {
        setTimeout(checkPaystack, 100);
      }
    };
    checkPaystack();
  }, []);

  if (!isOpen) return null;

  const handleCardPayment = () => {
    if (!paystackReady) {
      alert('Payment system is loading. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);
    const reference = generatePaymentReference();

    initializePaystack({
      email,
      amount,
      reference,
      onSuccess: (ref: string) => {
        setIsProcessing(false);
        onPaymentSuccess(ref);
      },
      onClose: () => {
        setIsProcessing(false);
      }
    });
  };

  const handleBankTransferPayment = () => {
    if (!paystackReady) {
      alert('Payment system is loading. Please wait a moment and try again.');
      return;
    }

    setIsProcessing(true);
    const reference = generatePaymentReference();

    initializePaystackWithBankTransfer({
      email,
      amount,
      reference,
      onSuccess: (ref: string) => {
        setIsProcessing(false);
        onPaymentSuccess(ref);
      },
      onClose: () => {
        setIsProcessing(false);
      }
    });
  };

  const handleManualBankTransfer = () => {
    setShowBankDetails(true);
  };

  const handleManualTransferSubmit = () => {
    if (!transactionReference.trim()) {
      alert('Please enter your transaction reference');
      return;
    }
    onPaymentSuccess(transactionReference);
  };

  if (showBankDetails) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bank Transfer Details</h2>
            <p className="text-gray-600">Transfer ₦{amount.toLocaleString()} to the account below</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Bank Name</p>
                <p className="text-lg font-bold text-gray-900">Moniepoint</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Number</p>
                <p className="text-lg font-bold text-gray-900">6746468396</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Account Name</p>
                <p className="text-lg font-bold text-gray-900">JAYBON GLOBAL LOGISTICS SERVICES</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Amount</p>
                <p className="text-lg font-bold text-yellow-600">₦{amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Reference / Transaction ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={transactionReference}
              onChange={(e) => setTransactionReference(e.target.value)}
              placeholder="Enter your payment reference or transaction ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the reference/transaction ID from your bank transfer confirmation
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold mb-1">Important:</p>
                <p>Your package will be processed after payment verification (usually within 24 hours)</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setShowBankDetails(false)}
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-full font-semibold transition-all"
            >
              Back
            </button>
            <button
              onClick={handleManualTransferSubmit}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-3 rounded-full font-semibold transition-all"
            >
              Submit Reference
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          disabled={isProcessing}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h2>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Package:</span>
            <span className="font-medium">{packageDetails.description}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Service:</span>
            <span className="font-medium">{packageDetails.serviceType}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
            <span className="text-gray-900 font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold text-yellow-600">₦{amount.toLocaleString()}</span>
          </div>
        </div>

        {!paystackReady && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
              <p className="text-sm text-yellow-800">Loading payment system...</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleCardPayment}
            disabled={isProcessing || !paystackReady}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            <CreditCard className="h-5 w-5" />
            <span>Pay with Card</span>
          </button>

          <button
            onClick={handleBankTransferPayment}
            disabled={isProcessing || !paystackReady}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            <Building2 className="h-5 w-5" />
            <span>Bank Transfer (via Paystack)</span>
          </button>

          <button
            onClick={handleManualBankTransfer}
            disabled={isProcessing}
            className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-4 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            <Building2 className="h-5 w-5" />
            <span>Manual Bank Transfer</span>
          </button>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Secure Payment</p>
              <p>All transactions are encrypted and secure via Paystack</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
