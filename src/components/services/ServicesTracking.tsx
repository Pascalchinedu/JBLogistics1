import React, { useState } from 'react';
import { Package, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../auth/LoginModal';
import Header from '../Header';
import { fetchShipmentFromAirtable } from '../../services/airtableService';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const ServicesTracking = () => {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipmentType, setShipmentType] = useState<'normal' | 'waybill'>('normal');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsLoading(true);
    setError('');
    setTrackingResult(null);

    try {
      console.log('Tracking package:', { trackingNumber: trackingNumber.trim(), shipmentType });

      const airtableData = await fetchShipmentFromAirtable(trackingNumber.trim(), shipmentType);
      console.log('Airtable data:', airtableData);

      if (airtableData) {
        const timeline = [];

        if (airtableData.status === 'Processing') {
          timeline.push({
            status: 'Processing',
            location: airtableData.currentLocation,
            time: 'Recently',
            completed: true
          });
        } else if (airtableData.status === 'In Transit') {
          timeline.push(
            { status: 'Processing', location: 'Package created', time: 'Recently', completed: true },
            { status: 'In Transit', location: airtableData.currentLocation, time: 'Now', completed: true }
          );
        } else if (airtableData.status === 'Delivered') {
          timeline.push(
            { status: 'Processing', location: 'Package created', time: 'Recently', completed: true },
            { status: 'In Transit', location: 'En route', time: 'Recently', completed: true },
            { status: 'Delivered', location: airtableData.currentLocation, time: 'Now', completed: true }
          );
        }

        setTrackingResult({
          trackingNumber: trackingNumber,
          status: airtableData.status,
          currentLocation: airtableData.currentLocation || 'Processing',
          estimatedDelivery: airtableData.estimatedDelivery || 'TBD',
          timeline: timeline
        });
      } else {
        console.log('No Airtable data found, checking Firebase...');
        const fieldName = shipmentType === 'waybill' ? 'waybillNumber' : 'trackingNumber';
        console.log('Querying Firebase:', { fieldName, value: trackingNumber.trim() });

        const shipmentsQuery = query(
          collection(db, 'shipments'),
          where(fieldName, '==', trackingNumber.trim())
        );

        const querySnapshot = await getDocs(shipmentsQuery);
        console.log('Firebase query results:', { empty: querySnapshot.empty, size: querySnapshot.size });

        if (!querySnapshot.empty) {
          const shipmentData = querySnapshot.docs[0].data();

          const timeline = [];

          const normalizedStatus = shipmentData.status.charAt(0).toUpperCase() + shipmentData.status.slice(1).toLowerCase();

          if (normalizedStatus === 'Processing') {
            timeline.push({
              status: 'Processing',
              location: shipmentData.currentLocation || 'Package created',
              time: 'Recently',
              completed: true
            });
          } else if (normalizedStatus === 'In transit') {
            timeline.push(
              { status: 'Processing', location: 'Package created', time: 'Recently', completed: true },
              { status: 'In Transit', location: shipmentData.currentLocation || 'Unknown', time: 'Now', completed: true }
            );
          } else if (normalizedStatus === 'Delivered') {
            timeline.push(
              { status: 'Processing', location: 'Package created', time: 'Recently', completed: true },
              { status: 'In Transit', location: 'En route', time: 'Recently', completed: true },
              { status: 'Delivered', location: shipmentData.currentLocation || 'Destination', time: 'Now', completed: true }
            );
          }

          setTrackingResult({
            trackingNumber: trackingNumber,
            status: shipmentData.status,
            currentLocation: shipmentData.currentLocation || 'Processing',
            estimatedDelivery: 'TBD',
            timeline: timeline
          });
        } else {
          setError('Tracking number not found. Please check and try again.');
        }
      }
    } catch (error) {
      console.error('Error tracking package:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      setError(`Failed to track package: ${errorMessage}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-black" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Package Tracking
            </h1>
            <p className="text-xl md:text-2xl font-light text-amber-100 max-w-3xl mx-auto leading-relaxed">
              Track your packages in real-time with detailed status updates and delivery information
            </p>
          </div>
        </div>
      </section>

      {/* Tracking Form */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Enter Your Tracking Number
            </h2>
            <form onSubmit={handleTrack} className="space-y-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Type
                </label>
                <select
                  value={shipmentType}
                  onChange={(e) => setShipmentType(e.target.value as 'normal' | 'waybill')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500 text-base"
                >
                  <option value="normal">Normal Delivery</option>
                  <option value="waybill">Waybill Delivery</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1 md:flex-[2]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => {
                      setTrackingNumber(e.target.value);
                      setError('');
                    }}
                    placeholder={shipmentType === 'waybill' ? 'Enter waybill number (e.g., JBL-WB-...)' : 'Enter tracking number (e.g., JBL-...)'}
                    className="w-full pl-10 pr-4 py-4 border border-gray-300 rounded-lg md:rounded-r-none focus:ring-yellow-500 focus:border-yellow-500 text-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black px-6 md:px-8 py-4 rounded-lg md:rounded-l-none font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center text-base md:text-lg whitespace-nowrap"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black"></div>
                  ) : (
                    <>
                      <Package className="h-5 w-5 mr-2" />
                      <span className="hidden md:inline">{isAuthenticated ? 'Track Package' : 'Sign In to Track'}</span>
                      <span className="md:hidden">Track</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tracking Results */}
          {trackingResult && (
            <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
              <div className="border-b border-gray-200 pb-6 mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Tracking Results
                </h3>
                <p className="text-gray-600">Tracking Number: <span className="font-semibold">{trackingResult.trackingNumber}</span></p>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-6">Delivery Timeline</h4>
                <div className="space-y-6">
                  {trackingResult.timeline.map((item: any, index: number) => (
                    <div key={index} className="flex items-start relative">
                      {index < trackingResult.timeline.length - 1 && (
                        <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-green-500 -mb-6"></div>
                      )}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center mr-5 mt-0.5 z-10 ${
                        item.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        <CheckCircle className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between mb-1">
                          <h5 className="text-lg font-bold text-gray-900">
                            {item.status}
                          </h5>
                          <span className="text-sm font-medium text-gray-500">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-base text-gray-600">
                          {item.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default ServicesTracking;