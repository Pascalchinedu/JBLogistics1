import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  email: string;
  onPaymentSuccess: (paymentData: { method: 'pickup_transfer' | 'dropoff_cod'; reference?: string }) => void;
  packageDetails: {
    description: string;
    serviceType: string;
  };
  isProcessing?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  onPaymentSuccess,
  isProcessing = false
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'pickup_transfer' | 'dropoff_cod' | ''>('pickup_transfer');
  const [senderName, setSenderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPaymentMethod('pickup_transfer');
      setSenderName('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handlePaymentSubmit = async () => {
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    if (paymentMethod === 'pickup_transfer' && !senderName.trim()) {
      alert('Please enter the sender\'s name');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onPaymentSuccess({
        method: paymentMethod,
        reference: paymentMethod === 'pickup_transfer' ? senderName : undefined
      });
    } catch (error) {
      console.error('Payment submission error:', error);
      alert('There was an error submitting your payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const handleClose = () => {
    if (isProcessing || isSubmitting) {
      alert('Please wait for the payment to be processed before closing.');
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-4 md:p-6 relative max-h-[85vh] md:max-h-[90vh] overflow-y-auto my-auto">
        <button
          onClick={handleClose}
          disabled={isProcessing || isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title={isProcessing || isSubmitting ? 'Please wait for payment processing' : 'Close'}
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">Payment Method</h2>
          <p className="text-sm md:text-base text-gray-600">Choose how you want to pay for your shipment</p>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Select Payment Option:</p>
          
          <div className="space-y-3">
            {/* Pickup Pays Option */}
            <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              paymentMethod === 'pickup_transfer' 
                ? 'border-yellow-500 bg-yellow-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="pickup_transfer"
                checked={paymentMethod === 'pickup_transfer'}
                onChange={(e) => setPaymentMethod(e.target.value as 'pickup_transfer')}
                className="mt-1 h-4 w-4 text-yellow-500 focus:ring-yellow-500"
                disabled={isProcessing}
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold text-gray-900">Pickup Pays (Transfer Now)</p>
                <p className="text-sm text-gray-600 mt-1">Make a bank transfer and provide reference</p>
              </div>
            </label>

            {/* Drop-off Pays Option */}
            <label className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              paymentMethod === 'dropoff_cod' 
                ? 'border-yellow-500 bg-yellow-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="dropoff_cod"
                checked={paymentMethod === 'dropoff_cod'}
                onChange={(e) => setPaymentMethod(e.target.value as 'dropoff_cod')}
                className="mt-1 h-4 w-4 text-yellow-500 focus:ring-yellow-500"
                disabled={isProcessing}
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold text-gray-900">Drop-off Pays (Cash on Delivery)</p>
                <p className="text-sm text-gray-600 mt-1">Receiver pays upon delivery</p>
              </div>
            </label>
          </div>
        </div>

        {/* Confirmation Message */}
        {paymentMethod && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">You selected:</span> {
                paymentMethod === 'pickup_transfer' 
                  ? 'Pickup Pays (Transfer Now)' 
                  : 'Drop-off Pays (Cash on Delivery)'
              } for <span className="font-bold">₦{amount.toLocaleString()}</span>
            </p>
          </div>
        )}

        {/* Bank Transfer Details (Conditional) */}
        {paymentMethod === 'pickup_transfer' && (
          <>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
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

            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sender's Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Enter sender's full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                disabled={isProcessing}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the full name of the person sending the money
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-1">Important:</p>
                  <p>We will process your request after confirming payment</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Cash on Delivery Message (Conditional) */}
        {paymentMethod === 'dropoff_cod' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-green-800">
                <p className="font-semibold mb-2">Cash on Delivery Selected</p>
                <p className="mb-1">The receiver will pay <span className="font-bold">₦{amount.toLocaleString()}</span> to our delivery agent upon package delivery.</p>
                <p className="text-xs mt-2 italic">Note: Make sure the receiver is aware of this payment requirement before delivery.</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            disabled={isSubmitting || isProcessing}
            className="flex-1 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handlePaymentSubmit}
            disabled={!paymentMethod || isSubmitting || isProcessing}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-3 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                Processing...
              </div>
            ) : (
              paymentMethod === 'dropoff_cod' ? 'Confirm COD' : 'Submit Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
