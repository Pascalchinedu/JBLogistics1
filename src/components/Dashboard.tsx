import React, { useState, useEffect, useRef } from 'react';
import { Package, User, Clock, MapPin, Phone, Mail, Building, CreditCard as Edit, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Header from './Header';
import PackageTypeModal from './ShipmentTypeModal';
import { refreshShipmentStatus } from '../services/airtableService';

interface Package {
  id: string;
  trackingNumber?: string;
  waybillNumber?: string;
  userId: string;
  deliveryAddress?: string;
  deliveryArea?: string;
  deliveryLandmark?: string;
  status: string;
  serviceType: string;
  packageType?: string;
  currentLocation?: string;
  createdAt: any;
  paymentStatus?: 'processing' | 'received' | 'not_recorded';
}

const Dashboard = () => {
  const { user, profile, loading, resendVerification } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [shipments, setShipments] = useState<Package[]>([]);
  const [loadingShipments, setLoadingShipments] = useState(true);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [resendingVerification, setResendingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const typewriterRef = useRef<HTMLHeadingElement>(null);
  const [isShipmentModalOpen, setIsShipmentModalOpen] = useState(false);
  const [isButtonFixed, setIsButtonFixed] = useState(true);
  const shipmentSectionRef = useRef<HTMLDivElement>(null);
  const [trackingResult, setTrackingResult] = useState<any>(null);

  useEffect(() => {
    // Check for verification success from URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verified') === 'true') {
      setShowVerificationAlert(true);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (profile?.name) {
      const fullText = `Welcome, ${profile.name.split(' ')[0]}`;
      let currentIndex = 0;
      const typingSpeed = 70;

      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, typingSpeed);

      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 530);

      return () => {
        clearInterval(typingInterval);
        clearInterval(cursorInterval);
      };
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      loadShipments();
    }
  }, [user]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsButtonFixed(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -80px 0px'
      }
    );

    const currentRef = shipmentSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [activeTab, shipments.length]);

  const handleResendVerification = async () => {
    try {
      setResendingVerification(true);
      setVerificationMessage('');
      await resendVerification();
      setVerificationMessage('Verification email sent! Please check your inbox (including spam folder).');
    } catch (error) {
      console.error('Resend verification error:', error);
      if (error instanceof Error) {
        if (error.message.includes('too-many-requests') || error.message.includes('auth/too-many-requests')) {
          setVerificationMessage('Too many requests. Please wait a few minutes before trying again.');
        } else {
          setVerificationMessage(error.message);
        }
      } else {
        setVerificationMessage('Failed to send verification email. Please try again later.');
      }
    } finally {
      setResendingVerification(false);
    }
  };

  const loadShipments = async () => {
    if (!user) return;

    try {
      setLoadingShipments(true);

      try {
        const shipmentsQuery = query(
          collection(db, 'shipments'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(shipmentsQuery);
        const shipmentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Package[];

        if (shipmentsData.length > 15) {
          const oldestShipments = shipmentsData.slice(15, 20);
          for (const shipment of oldestShipments) {
            try {
              await deleteDoc(doc(db, 'shipments', shipment.id));
            } catch (deleteError) {
              console.error('Error deleting old shipment:', deleteError);
            }
          }
          setShipments(shipmentsData.slice(0, 15));
        } else {
          setShipments(shipmentsData);
        }
      } catch (indexError) {
        console.warn('Firestore index not available, using simple query:', indexError);
        const simpleQuery = query(
          collection(db, 'shipments'),
          where('userId', '==', user.uid)
        );

        const querySnapshot = await getDocs(simpleQuery);
        const shipmentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Package[];

        shipmentsData.sort((a, b) => {
          const aDate = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const bDate = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return bDate.getTime() - aDate.getTime();
        });

        if (shipmentsData.length > 15) {
          const oldestShipments = shipmentsData.slice(15, 20);
          for (const shipment of oldestShipments) {
            try {
              await deleteDoc(doc(db, 'shipments', shipment.id));
            } catch (deleteError) {
              console.error('Error deleting old shipment:', deleteError);
            }
          }
          setShipments(shipmentsData.slice(0, 15));
        } else {
          setShipments(shipmentsData);
        }
      }

      try {
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('userId', '==', user.uid)
        );

        const paymentsSnapshot = await getDocs(paymentsQuery);
        const paymentLookup: Record<string, string> = {};
        
        paymentsSnapshot.docs.forEach(doc => {
          const paymentData = doc.data();
          if (paymentData.trackingId) {
            paymentLookup[paymentData.trackingId] = paymentData.status || 'processing';
          }
        });

        setShipments(prevShipments => 
          prevShipments.map(shipment => ({
            ...shipment,
            paymentStatus: (paymentLookup[shipment.trackingNumber || shipment.waybillNumber || ''] as 'processing' | 'received') || 'not_recorded'
          }))
        );
      } catch (paymentError) {
        console.warn('Error loading payments:', paymentError);
      }
    } catch (error) {
      console.error('Error loading shipments:', error);
      setShipments([]);
    } finally {
      setLoadingShipments(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please sign in to access your dashboard.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase().replace(/[-\s]/g, '');

    switch (normalizedStatus) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'intransit':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusBadge = (paymentStatus?: 'processing' | 'received' | 'not_recorded') => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Processing
          </span>
        );
      case 'received':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Received
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
            Not Recorded
          </span>
        );
    }
  };


  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: User },
    { id: 'shipments', label: 'My Packages', icon: Package },
    { id: 'profile', label: 'Profile Settings', icon: Edit },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Email Verification Alert */}
            {showVerificationAlert && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Email verification successful!</span>
                </div>
              </div>
            )}

            {/* Email Verification Warning */}
            {!user.emailVerified && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <span className="text-yellow-800 font-medium">Email verification required</span>
                    <p className="text-yellow-700 text-sm mt-1">
                      Please check your email <strong>(including spam folder)</strong> and click the verification link to fully activate your account.
                    </p>
                    {verificationMessage && (
                      <p className={`text-sm mt-2 ${
                        verificationMessage.includes('sent') ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {verificationMessage}
                      </p>
                    )}
                    <div className="mt-3">
                      <button
                        onClick={handleResendVerification}
                        disabled={resendingVerification}
                        className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white text-sm font-medium rounded-md transition-colors disabled:cursor-not-allowed"
                      >
                        {resendingVerification ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          'Resend Verification Email'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="flex md:contents overflow-x-auto gap-4 pb-2 md:pb-0 snap-x snap-mandatory scrollbar-hide">
                <div className="bg-white p-6 rounded-lg shadow-md flex-shrink-0 w-[280px] md:w-auto snap-center">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total Packages</p>
                      <p className="text-2xl font-bold text-gray-900">{shipments.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex-shrink-0 w-[280px] md:w-auto snap-center">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">In Transit</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {shipments.filter(s => {
                          const normalized = s.status.toLowerCase().replace(/[-\s]/g, '');
                          return normalized === 'intransit';
                        }).length}
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md flex-shrink-0 w-[280px] md:w-auto snap-center">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Delivered</p>
                      <p className="text-2xl font-bold text-green-600">
                        {shipments.filter(s => s.status.toLowerCase() === 'delivered').length}
                      </p>
                    </div>
                    <MapPin className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Packages</h3>
              </div>
              {loadingShipments ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading packages...</p>
                </div>
              ) : shipments.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No packages yet</p>
                  <div ref={shipmentSectionRef}>
                    <button
                      onClick={() => setIsShipmentModalOpen(true)}
                      className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold transition-all shadow-lg"
                    >
                      Send Package
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tracking ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Destination
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Payment
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {shipments.slice(0, 3).map((shipment) => {
                          const trackingNum = shipment.trackingNumber || shipment.waybillNumber;
                          const deliveryAddr = shipment.deliveryAddress ||
                            (shipment.deliveryArea && shipment.deliveryLandmark
                              ? `${shipment.deliveryArea}, ${shipment.deliveryLandmark}`
                              : 'N/A');

                          return (
                            <tr key={shipment.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{trackingNum}</div>
                                <div className="text-sm text-gray-500">{shipment.createdAt?.toDate?.().toLocaleDateString() || new Date(shipment.createdAt).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{deliveryAddr}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                                  {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getPaymentStatusBadge(shipment.paymentStatus)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-6 border-t border-gray-200 text-center space-x-4" ref={shipmentSectionRef}>
                    {shipments.length > 3 && (
                      <button
                        onClick={() => setActiveTab('shipments')}
                        className="text-yellow-600 hover:text-yellow-700 font-semibold"
                      >
                        View All Packages →
                      </button>
                    )}
                    {shipments.length > 0 && (
                      <button
                        onClick={() => setIsShipmentModalOpen(true)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold transition-all shadow-lg"
                      >
                        Send Package
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 'shipments':
        return (
          <div className="bg-white rounded-lg shadow-md">
            <div className="sticky top-0 z-10 p-6 border-b border-gray-200 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">All Packages</h3>
            </div>
            {loadingShipments ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading packages...</p>
              </div>
            ) : shipments.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages yet</h3>
                <p className="text-gray-600 mb-6">Start shipping with JB Logistics today!</p>
                <div ref={shipmentSectionRef}>
                  <button
                    onClick={() => setIsShipmentModalOpen(true)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold transition-all shadow-lg"
                  >
                    Send Package
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tracking ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Destination
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shipments.map((shipment) => {
                      const trackingNum = shipment.trackingNumber || shipment.waybillNumber;
                      const deliveryAddr = shipment.deliveryAddress ||
                        (shipment.deliveryArea && shipment.deliveryLandmark
                          ? `${shipment.deliveryArea}, ${shipment.deliveryLandmark}`
                          : 'N/A');

                      return (
                        <tr key={shipment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{trackingNum}</div>
                            <div className="text-sm text-gray-500">{shipment.createdAt?.toDate?.().toLocaleDateString() || new Date(shipment.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{deliveryAddr}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                              {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getPaymentStatusBadge(shipment.paymentStatus)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div className="p-6 border-t border-gray-200" ref={shipmentSectionRef}>
                  <button
                    onClick={() => setIsShipmentModalOpen(true)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold transition-all shadow-lg"
                  >
                    Send Package
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile?.name || ''}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={profile?.email || ''}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                  <div className="mt-1 flex items-center">
                    {user.emailVerified ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center text-yellow-600">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs">Verification pending</span>
                        </div>
                        <button
                          onClick={handleResendVerification}
                          disabled={resendingVerification}
                          className="text-xs text-yellow-600 hover:text-yellow-700 underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {resendingVerification ? 'Sending...' : 'Resend'}
                        </button>
                      </div>
                    )}
                  </div>
                  {verificationMessage && (
                    <p className={`text-xs mt-1 ${
                      verificationMessage.includes('sent') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {verificationMessage}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={profile?.phone || ''}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={profile?.company || 'Not specified'}
                      readOnly
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center">
                <User className="h-8 w-8 text-black" />
              </div>
            </div>
            <h1 ref={typewriterRef} className="text-4xl md:text-5xl font-bold mb-4 min-h-[60px]">
              <span>{displayedText}</span>
              <span className={`inline-block w-0.5 h-10 md:h-12 bg-yellow-400 ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Manage your packages, track packages, and access your account information from your personal dashboard
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-16 lg:py-24 bg-gray-50 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="flex flex-wrap border-b border-gray-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all ${
                      activeTab === tab.id
                        ? 'border-b-2 border-yellow-400 text-yellow-600 bg-yellow-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {renderTabContent()}
          </div>
        </div>
      </section>

      <PackageTypeModal
        isOpen={isShipmentModalOpen}
        onClose={() => setIsShipmentModalOpen(false)}
      />

      {/* Fixed Send Package Button */}
      <div
        className={`fixed bottom-0 left-0 right-0 p-4 transition-all duration-300 ease-in-out z-40 ${
          isButtonFixed ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-center">
          <button
            onClick={() => setIsShipmentModalOpen(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold transition-all shadow-lg flex items-center"
          >
            <Package className="h-5 w-5 mr-2" />
            Send Package
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;