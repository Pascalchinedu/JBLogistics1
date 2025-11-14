import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, MapPin, Truck, CheckCircle, Copy, AlertCircle, Bike, Zap } from 'lucide-react';
import Header from './Header';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import PaymentModal from './PaymentModal';

const WEBHOOK_URL = "https://cheeduslmbot.app.n8n.cloud/webhook/689bf1f2-081c-449f-9991-776a748c33f8";
const WEBHOOK_GET_URL = "https://cheeduslmbot.app.n8n.cloud/webhook/689bf1f2-081c-449f-9991-776a748c33f8";

const PORT_HARCOURT_AREAS = [
  'Rumuola', 'Eliozu', 'Rumukurushi', 'Elelenwo', 'GRA Phase 1', 'GRA Phase 2',
  'GRA Phase 3', 'Old GRA', 'Trans Amadi', 'Diobu', 'Borikiri', 'Town',
  'Aggrey Road', 'Ikwerre Road', 'Aba Road', 'East-West Road', 'Rumuokoro',
  'Rumuokwuta', 'Choba', 'Aluu', 'Alakahia', 'Eleme', 'Obio-Akpor', 'Oyigbo',
  'Port Harcourt Township', 'D-Line', 'Woji', 'Mile 1', 'Mile 2', 'Mile 3', 'Other'
];


interface FormData {
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  pickupArea: string;
  pickupLandmark: string;
  receiverPhone: string;
  deliveryArea: string;
  deliveryLandmark: string;
  packageDescription: string;
  serviceType: string;
}

interface FormErrors {
  [key: string]: string;
}

const CreateShipment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    senderName: user?.displayName || '',
    senderEmail: user?.email || '',
    senderPhone: '',
    pickupArea: '',
    pickupLandmark: '',
    receiverPhone: '',
    deliveryArea: '',
    deliveryLandmark: '',
    packageDescription: '',
    serviceType: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+234\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.senderName.trim()) {
      newErrors.senderName = 'Sender name is required';
    }
    if (!formData.senderEmail) {
      newErrors.senderEmail = 'Sender email is required';
    } else if (!validateEmail(formData.senderEmail)) {
      newErrors.senderEmail = 'Please enter a valid email address';
    }
    if (!formData.senderPhone) {
      newErrors.senderPhone = 'Sender phone is required';
    } else if (!validatePhone(formData.senderPhone)) {
      newErrors.senderPhone = 'Phone must be +234 followed by 10 digits';
    }
    if (!formData.pickupArea) newErrors.pickupArea = 'Pickup area is required';
    if (!formData.pickupLandmark.trim()) newErrors.pickupLandmark = 'Pickup landmark is required';

    if (!formData.receiverPhone) {
      newErrors.receiverPhone = 'Receiver phone is required';
    } else if (!validatePhone(formData.receiverPhone)) {
      newErrors.receiverPhone = 'Phone must be +234 followed by 10 digits';
    }
    if (!formData.deliveryArea) newErrors.deliveryArea = 'Delivery area is required';
    if (!formData.deliveryLandmark.trim()) newErrors.deliveryLandmark = 'Delivery landmark is required';

    if (!formData.packageDescription.trim()) newErrors.packageDescription = 'Package description is required';
    if (!formData.serviceType) newErrors.serviceType = 'Service type is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'senderPhone' | 'receiverPhone') => {
    let value = e.target.value;

    if (!value.startsWith('+234')) {
      value = '+234';
    }

    const digits = value.slice(4).replace(/\D/g, '').slice(0, 10);
    value = '+234' + digits;

    setFormData(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateTrackingNumber = (): string => {
    const timestamp = Date.now();
    const random3Digits = Math.floor(Math.random() * 900) + 100;
    return `JBL-${timestamp}-${random3Digits}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    localStorage.setItem('shipmentFormBackup', JSON.stringify(formData));
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (reference: string) => {
    setShowPaymentModal(false);
    setIsSubmitting(true);
    setSubmitError('');

    const generatedTrackingNumber = generateTrackingNumber();

    try {
      const shipmentData = {
        trackingNumber: generatedTrackingNumber,
        shipmentType: 'normal',
        userId: user?.uid || 'guest',
        userEmail: user?.email || formData.senderEmail,
        userName: formData.senderName,
        senderName: formData.senderName,
        senderEmail: formData.senderEmail,
        senderPhone: formData.senderPhone,
        pickupArea: formData.pickupArea,
        pickupLandmark: formData.pickupLandmark,
        receiverPhone: formData.receiverPhone,
        deliveryArea: formData.deliveryArea,
        deliveryLandmark: formData.deliveryLandmark,
        packageDescription: formData.packageDescription,
        serviceType: formData.serviceType,
        status: 'processing',
        currentLocation: 'Pickup pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'shipments'), shipmentData);

      console.log('Package saved to Firestore with ID:', docRef.id);

      const price = formData.serviceType.includes('Local Bike') ? '3000' : '5000';
      
      const paymentData = {
        userId: user?.uid || 'guest',
        trackingId: generatedTrackingNumber,
        customerName: formData.senderName,
        customerEmail: formData.senderEmail,
        amount: parseFloat(price),
        paymentMethod: 'bank_transfer' as const,
        paymentReference: reference,
        status: 'processing' as const,
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, 'payments'), paymentData);
      console.log('Payment record created for tracking:', generatedTrackingNumber);

      const webhookPayload = {
        trackingNumber: generatedTrackingNumber,
        shipmentType: 'normal',
        senderName: formData.senderName,
        userEmail: formData.senderEmail,
        senderEmail: formData.senderEmail,
        senderPhone: formData.senderPhone,
        pickupAddress: `${formData.pickupArea}, ${formData.pickupLandmark}`,
        receiverPhone: formData.receiverPhone,
        deliveryAddress: `${formData.deliveryArea}, ${formData.deliveryLandmark}`,
        serviceType: formData.serviceType,
        status: 'pending',
        price: price,
        paymentReference: reference,
        paymentStatus: 'paid',
        firestoreId: docRef.id,
        createdAt: new Date().toISOString(),
      };

      console.log('Sending POST webhook to:', WEBHOOK_URL);
      console.log('POST payload:', webhookPayload);

      try {
        const postResponse = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        });

        console.log('POST webhook response status:', postResponse.status);
        const postResponseText = await postResponse.text();
        console.log('POST webhook response:', postResponseText);

        if (postResponse.ok) {
          console.log('✅ n8n POST webhook triggered successfully');
        } else {
          console.error('❌ POST webhook returned non-OK status:', postResponse.status, postResponseText);
        }
      } catch (webhookError) {
        console.error('❌ POST webhook notification failed:', webhookError);
      }

      const getWebhookParams = new URLSearchParams({
        email: formData.senderEmail,
        senderName: formData.senderName,
        senderPhone: formData.senderPhone,
        trackingNumber: generatedTrackingNumber,
        firestoreId: docRef.id,
        shipmentType: 'normal',
        pickupArea: formData.pickupArea,
        pickupLandmark: formData.pickupLandmark,
        deliveryArea: formData.deliveryArea,
        deliveryLandmark: formData.deliveryLandmark,
        receiverPhone: formData.receiverPhone,
        serviceType: formData.serviceType,
        price: price,
        paymentReference: reference,
        paymentStatus: 'paid',
      });

      const getWebhookUrl = `${WEBHOOK_GET_URL}?${getWebhookParams.toString()}`;
      console.log('Sending GET webhook to:', getWebhookUrl);

      try {
        const getResponse = await fetch(getWebhookUrl, {
          method: 'GET',
        });

        console.log('GET webhook response status:', getResponse.status);
        const getResponseText = await getResponse.text();
        console.log('GET webhook response:', getResponseText);

        if (getResponse.ok) {
          console.log('✅ n8n GET webhook triggered successfully');
        } else {
          console.error('❌ GET webhook returned non-OK status:', getResponse.status, getResponseText);
        }
      } catch (webhookError) {
        console.error('❌ GET webhook notification failed:', webhookError);
      }

      setTrackingNumber(generatedTrackingNumber);
      setPaymentReference(reference);
      localStorage.removeItem('shipmentFormBackup');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Package creation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmitError(`Unable to create package: ${errorMessage}. Please try again or contact support.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
  };

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAnother = () => {
    setTrackingNumber('');
    setFormData({
      senderName: user?.displayName || '',
      senderEmail: user?.email || '',
      senderPhone: '',
      pickupArea: '',
      pickupLandmark: '',
      receiverPhone: '',
      deliveryArea: '',
      deliveryLandmark: '',
      packageDescription: '',
      serviceType: '',
    });
    setErrors({});
    setSubmitError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (trackingNumber) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container-responsive py-8 md:py-16 lg:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 md:mb-6">
              <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 font-merienda-mobile md:font-merienda">
              Package Created Successfully!
            </h1>

            <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
              Your package has been registered. Use the tracking number below to monitor your delivery.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 md:p-8 mb-6 md:mb-8">
              <p className="text-xs md:text-sm text-gray-600 mb-2">Tracking Number</p>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-lg md:text-3xl font-bold text-yellow-600 font-mono break-all">
                  {trackingNumber}
                </p>
                <button
                  onClick={handleCopyTracking}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
                  title="Copy tracking number"
                >
                  {copied ? (
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 md:h-6 md:w-6 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-6 mb-6 md:mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-sm md:text-base">Package Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-medium">{formData.packageDescription}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{formData.serviceType}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <button
                onClick={handleCreateAnother}
                className="flex-1 sm:flex-initial bg-yellow-400 hover:bg-yellow-500 text-black px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold transition-all text-sm md:text-base"
              >
                Create Another
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 sm:flex-initial border-2 border-amber-800 text-amber-800 hover:bg-amber-800 hover:text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-semibold transition-all text-sm md:text-base"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getServicePrice = (): number => {
    return formData.serviceType.includes('Local Bike') ? 3000 : 5000;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handlePaymentClose}
        amount={getServicePrice()}
        email={formData.senderEmail}
        onPaymentSuccess={handlePaymentSuccess}
        packageDetails={{
          description: formData.packageDescription || 'Package',
          serviceType: formData.serviceType || 'Service'
        }}
      />

      <div className="bg-gradient-to-r from-amber-900 to-amber-700 text-white py-12">
        <div className="container-responsive">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-bold font-merienda-mobile md:font-merienda">
              Send Package
            </h1>
          </div>
          <p className="text-amber-100 text-lg">
            Fill in the details below to send your package
          </p>
        </div>
      </div>

      <div className="container-responsive py-12">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {submitError && (
            <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium mb-2">{submitError}</p>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-red-600 hover:text-red-700 font-semibold text-sm"
                >
                  Retry Submission
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-6">
            <div className="flex items-center space-x-2 mb-6">
              <MapPin className="h-5 w-5 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">Pickup Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sender Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.senderName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.senderName && (
                  <p className="text-red-500 text-sm mt-1">{errors.senderName}</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sender Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="senderEmail"
                  value={formData.senderEmail}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.senderEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.senderEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.senderEmail}</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sender Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="senderPhone"
                  value={formData.senderPhone}
                  onChange={(e) => handlePhoneChange(e, 'senderPhone')}
                  placeholder="+2348012345678"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.senderPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.senderPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.senderPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Area <span className="text-red-500">*</span>
                </label>
                <select
                  name="pickupArea"
                  value={formData.pickupArea}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.pickupArea ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select pickup area...</option>
                  {PORT_HARCOURT_AREAS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                {errors.pickupArea && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupArea}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Landmark/Specific Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pickupLandmark"
                  value={formData.pickupLandmark}
                  onChange={handleInputChange}
                  placeholder="e.g., Opposite GT Bank, Near Shoprite"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.pickupLandmark ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickupLandmark && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupLandmark}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-6">
            <div className="flex items-center space-x-2 mb-6">
              <Truck className="h-5 w-5 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">Delivery Information</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Receiver Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={(e) => handlePhoneChange(e, 'receiverPhone')}
                  placeholder="+2348012345678"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.receiverPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.receiverPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.receiverPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Area <span className="text-red-500">*</span>
                </label>
                <select
                  name="deliveryArea"
                  value={formData.deliveryArea}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.deliveryArea ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select delivery area...</option>
                  {PORT_HARCOURT_AREAS.map((area) => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                {errors.deliveryArea && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryArea}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Landmark/Specific Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="deliveryLandmark"
                  value={formData.deliveryLandmark}
                  onChange={handleInputChange}
                  placeholder="e.g., Opposite GT Bank, Near Shoprite"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.deliveryLandmark ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.deliveryLandmark && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryLandmark}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-6">
            <div className="flex items-center space-x-2 mb-6">
              <Package className="h-5 w-5 text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">Package Details</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="packageDescription"
                  value={formData.packageDescription}
                  onChange={handleInputChange}
                  placeholder="What are you sending?"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.packageDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.packageDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.packageDescription}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Service Type <span className="text-red-500">*</span></h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Delivery Service
                </label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${
                    errors.serviceType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a service...</option>
                  <option value="Local Bike Delivery (1-8 hours) - ₦3,000">Local Bike Delivery - Within Port Harcourt (1-8 hours) - ₦3,000</option>
                  <option value="Express Delivery (1-2 hours) - ₦5,000">Express Delivery - Ultra-Fast Service (1-2 hours) - ₦5,000</option>
                </select>
                {errors.serviceType && (
                  <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center mb-2">
                    <Bike className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-semibold text-blue-900">Local Bike</h4>
                  </div>
                  <p className="text-sm text-blue-700">Within Port Harcourt</p>
                  <p className="text-xs text-blue-600 mt-1">1-8 hours delivery</p>
                  <p className="text-lg font-bold text-blue-900 mt-2">₦3,000</p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center mb-2">
                    <Zap className="h-5 w-5 text-red-600 mr-2" />
                    <h4 className="font-semibold text-red-900">Express</h4>
                  </div>
                  <p className="text-sm text-red-700">Ultra-Fast Service</p>
                  <p className="text-xs text-red-600 mt-1">1-2 hours delivery</p>
                  <p className="text-lg font-bold text-red-900 mt-2">₦5,000</p>
                </div>
              </div>
            </div>
          </div>


          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="sm:w-auto w-full bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Creating your package...
                </>
              ) : (
                'Send Package'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="sm:w-auto w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShipment;
