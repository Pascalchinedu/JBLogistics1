import React, { useState } from 'react';
import { Search, Lock, Package, MapPin, CheckCircle, AlertCircle, RefreshCw, CreditCard } from 'lucide-react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Header from './Header';
import AdminPaymentManagement from './AdminPaymentManagement';

const ADMIN_PASSWORD = 'jblogistics2025';

interface PackageData {
  id: string;
  trackingNumber?: string;
  waybillNumber?: string;
  status: string;
  currentLocation?: string;
  pickupAddress?: string;
  deliveryAddress?: string;
  deliveryArea?: string;
  deliveryLandmark?: string;
  packageType?: string;
  serviceType?: string;
}

const AdminStatusUpdate = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [activeTab, setActiveTab] = useState<'packages' | 'payments'>('packages');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [packageData, setPackageData] = useState<PackageData | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      setSearchError('Please enter a tracking number');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setPackageData(null);
    setUpdateSuccess('');
    setUpdateError('');

    try {
      const normalQuery = query(
        collection(db, 'shipments'),
        where('trackingNumber', '==', trackingNumber.trim())
      );

      const waybillQuery = query(
        collection(db, 'shipments'),
        where('waybillNumber', '==', trackingNumber.trim())
      );

      let querySnapshot = await getDocs(normalQuery);

      if (querySnapshot.empty) {
        querySnapshot = await getDocs(waybillQuery);
      }

      if (!querySnapshot.empty) {
        const packageDoc = querySnapshot.docs[0];
        const data = packageDoc.data() as Omit<PackageData, 'id'>;
        setPackageData({
          ...data,
          id: packageDoc.id
        });
        setNewStatus(data.status || '');
        setNewLocation(data.currentLocation || '');
      } else {
        setSearchError('Package not found. Please check the tracking number and try again.');
      }
    } catch (error) {
      console.error('Error searching package:', error);
      setSearchError('Failed to search package. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!packageData) return;

    if (!newStatus) {
      setUpdateError('Please select a status');
      return;
    }

    if (!newLocation.trim()) {
      setUpdateError('Please enter a current location');
      return;
    }

    setIsUpdating(true);
    setUpdateError('');
    setUpdateSuccess('');

    try {
      const packageRef = doc(db, 'shipments', packageData.id);
      await updateDoc(packageRef, {
        status: newStatus,
        currentLocation: newLocation.trim(),
        updatedAt: new Date(),
      });

      setUpdateSuccess(`Successfully updated package ${packageData.trackingNumber || packageData.waybillNumber}`);

      setTimeout(() => {
        setPackageData(null);
        setTrackingNumber('');
        setNewStatus('');
        setNewLocation('');
        setUpdateSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error updating package:', error);
      setUpdateError('Failed to update package. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/[-\s]/g, '');
    switch (normalizedStatus) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'enroute':
      case 'intransit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'deliveryfailed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <section className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <Lock className="h-8 w-8 text-black" />
                </div>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Admin Access
              </h1>
              <p className="text-xl md:text-2xl font-light text-amber-100 max-w-3xl mx-auto leading-relaxed">
                Update package status and tracking information
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gray-50 rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Admin Login
              </h2>
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm">{passwordError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError('');
                      }}
                      placeholder="Enter admin password"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold transition-all"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center">
                {activeTab === 'packages' ? (
                  <Package className="h-8 w-8 text-black" />
                ) : (
                  <CreditCard className="h-8 w-8 text-black" />
                )}
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Admin Dashboard
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Manage packages and payments
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'packages'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Package className="h-5 w-5" />
              <span>Package Management</span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'payments'
                  ? 'bg-yellow-400 text-black shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CreditCard className="h-5 w-5" />
              <span>Payment Management</span>
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'payments' ? (
            <AdminPaymentManagement />
          ) : (
          <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Search Package
            </h2>
            <form onSubmit={handleSearch} className="space-y-4">
              {searchError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm">{searchError}</p>
                </div>
              )}

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => {
                      setTrackingNumber(e.target.value);
                      setSearchError('');
                    }}
                    placeholder="Enter tracking or waybill number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black px-6 py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed flex items-center"
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Search
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {packageData && (
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Package Details
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Tracking Number</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {packageData.trackingNumber || packageData.waybillNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Service Type</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {packageData.serviceType || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Current Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(packageData.status)}`}>
                      {packageData.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Current Location</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {packageData.currentLocation || 'Not set'}
                    </p>
                  </div>
                  {packageData.pickupAddress && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Pickup Address</p>
                      <p className="text-gray-900">{packageData.pickupAddress}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Delivery Address</p>
                    <p className="text-gray-900">
                      {packageData.deliveryAddress ||
                       (packageData.deliveryArea && packageData.deliveryLandmark
                         ? `${packageData.deliveryArea}, ${packageData.deliveryLandmark}`
                         : 'N/A')}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUpdate} className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Update Information
                </h3>

                {updateSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-green-800 text-sm">{updateSuccess}</p>
                  </div>
                )}

                {updateError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800 text-sm">{updateError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => {
                      setNewStatus(e.target.value);
                      setUpdateError('');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">Select status</option>
                    <option value="Processing">Processing</option>
                    <option value="En Route">En Route</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Delivery Failed">Delivery Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={newLocation}
                      onChange={(e) => {
                        setNewLocation(e.target.value);
                        setUpdateError('');
                      }}
                      placeholder="e.g., Lagos Terminal, Enroute to PH, Delivered to recipient"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black px-6 py-3 rounded-lg font-semibold transition-all disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Update Package
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPackageData(null);
                      setTrackingNumber('');
                      setNewStatus('');
                      setNewLocation('');
                      setUpdateSuccess('');
                      setUpdateError('');
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminStatusUpdate;
