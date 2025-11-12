import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

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
  onPaymentSuccess
}) => {
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [transactionReference, setTransactionReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowBankDetails(true);
      setTransactionReference('');
      setIsSubmitting(false);
    } else {
      setShowBankDetails(false);
      setTransactionReference('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleManualTransferSubmit = async () => {
    if (!transactionReference.trim()) {
      alert('Please enter your transaction reference');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onPaymentSuccess(transactionReference);
    } catch (error) {
      console.error('Payment submission error:', error);
      alert('There was an error submitting your payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                <p>We will process your request after confirming payment</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleManualTransferSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-3 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Submit Reference'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentModal;
