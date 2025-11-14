import React from 'react';
import { Package, ArrowRightLeft, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PackageTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PackageTypeModal: React.FC<PackageTypeModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNormalDelivery = () => {
    onClose();
    navigate('/create-shipment');
  };

  const handleWaybillTransfer = () => {
    onClose();
    navigate('/create-waybill-shipment');
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="bg-white rounded-t-3xl shadow-2xl w-full md:max-w-lg mx-auto max-h-[75vh] flex flex-col">
          <div className="relative flex-shrink-0 p-4 md:p-6 pb-3 md:pb-4 border-b border-gray-100">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <h2 className="text-lg md:text-2xl font-bold text-gray-900 text-center pr-8">
              Select Package Type
            </h2>
          </div>

          <div className="overflow-y-auto flex-grow p-4 md:p-6">
            <div className="space-y-3">
              <button
                onClick={handleNormalDelivery}
                className="group relative bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 text-left flex items-center w-full"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-50 rounded-xl mr-4 flex-shrink-0 group-hover:bg-yellow-100 transition-colors">
                  <Package className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                    Normal Delivery
                  </h3>
                  <p className="text-sm text-gray-600">
                    Door-to-door delivery service
                  </p>
                </div>
                <div className="flex items-center text-yellow-600 font-medium text-sm flex-shrink-0">
                  Select
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>

              <button
                onClick={handleWaybillTransfer}
                className="group relative bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 text-left flex items-center w-full"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mr-4 flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                  <ArrowRightLeft className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                    Waybill Transfer
                  </h3>
                  <p className="text-sm text-gray-600">
                    Park pickup to local delivery in Port Harcourt
                  </p>
                </div>
                <div className="flex items-center text-yellow-600 font-medium text-sm flex-shrink-0">
                  Select
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PackageTypeModal;
