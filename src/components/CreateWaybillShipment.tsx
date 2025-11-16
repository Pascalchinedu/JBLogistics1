import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, MapPin, User, CheckCircle, Copy, AlertCircle } from 'lucide-react';
import Header from './Header';
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import PaymentModal from './PaymentModal';

const WEBHOOK_URL = "http://localhost:5678/webhook-test/689bf1f2-081c-449f-9991-776a748c33f8";
const WEBHOOK_GET_URL = "http://localhost:5678/webhook-test/689bf1f2-081c-449f-9991-776a748c33f8";

const PORT_HARCOURT_AREAS = [
  'Rumuola', 'Eliozu', 'Rumukurushi', 'Elelenwo', 'GRA Phase 1', 'GRA Phase 2',
  'GRA Phase 3', 'Old GRA', 'Trans Amadi', 'Diobu', 'Borikiri', 'Town',
  'Aggrey Road', 'Ikwerre Road', 'Aba Road', 'East-West Road', 'Rumuokoro',
  'Rumuokwuta', 'Choba', 'Aluu', 'Alakahia', 'Eleme', 'Obio-Akpor', 'Oyigbo',
  'Port Harcourt Township', 'D-Line', 'Woji', 'Mile 1', 'Mile 2', 'Mile 3', 'Other'
];

interface FormData {
  pickupParkName: string;
  senderName: string;
  pickupRecipientName: string;
  pickupRecipientIdNumber: string;
  pickupRecipientPhone: string;
  deliveryArea: string;
  deliveryLandmark: string;
  deliveryRecipientName: string;
  deliveryRecipientPhone: string;
  deliveryRecipientEmail: string;
  packageDescription: string;
}

interface FormErrors {
  [key: string]: string;
}

const CreateWaybillShipment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState<FormData>({
    pickupParkName: '',
    senderName: '',
    pickupRecipientName: '',
    pickupRecipientIdNumber: '',
    pickupRecipientPhone: '',
    deliveryArea: '',
    deliveryLandmark: '',
    deliveryRecipientName: '',
    deliveryRecipientPhone: '',
    deliveryRecipientEmail: '',
    packageDescription: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waybillNumber, setWaybillNumber] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

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

    if (!formData.pickupParkName.trim()) newErrors.pickupParkName = 'Pickup location is required';
    if (!formData.senderName.trim()) newErrors.senderName = 'Sender name is required';
    if (!formData.pickupRecipientName.trim()) newErrors.pickupRecipientName = 'Recipient name is required';
    if (!formData.pickupRecipientIdNumber.trim()) newErrors.pickupRecipientIdNumber = 'Recipient ID number is required';
    if (!formData.pickupRecipientPhone) {
      newErrors.pickupRecipientPhone = 'Recipient phone is required';
    } else if (!validatePhone(formData.pickupRecipientPhone)) {
      newErrors.pickupRecipientPhone = 'Phone must be +234 followed by 10 digits';
    }

    if (!formData.deliveryArea) newErrors.deliveryArea = 'Delivery area is required';
    if (!formData.deliveryLandmark.trim()) newErrors.deliveryLandmark = 'Delivery landmark is required';
    if (!formData.deliveryRecipientName.trim()) newErrors.deliveryRecipientName = 'Recipient name is required';
    if (!formData.deliveryRecipientPhone) {
      newErrors.deliveryRecipientPhone = 'Recipient phone is required';
    } else if (!validatePhone(formData.deliveryRecipientPhone)) {
      newErrors.deliveryRecipientPhone = 'Phone must be +234 followed by 10 digits';
    }
    if (!formData.deliveryRecipientEmail) {
      newErrors.deliveryRecipientEmail = 'Recipient email is required';
    } else if (!validateEmail(formData.deliveryRecipientEmail)) {
      newErrors.deliveryRecipientEmail = 'Please enter a valid email address';
    }

    if (!formData.packageDescription.trim()) newErrors.packageDescription = 'Package description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'pickupRecipientPhone' | 'deliveryRecipientPhone') => {
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

  const generateWaybillNumber = (): string => {
    const timestamp = Date.now();
    const random3Digits = Math.floor(Math.random() * 900) + 100;
    return `JBL-WB-${timestamp}-${random3Digits}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData: { method: 'pickup_transfer' | 'dropoff_cod'; reference?: string }) => {
    setIsPaymentProcessing(true);
    setIsSubmitting(true);
    setSubmitError('');

    const generatedWaybillNumber = generateWaybillNumber();

    try {
      const shipmentData = {
        waybillNumber: generatedWaybillNumber,
        trackingNumber: generatedWaybillNumber,
        shipmentType: 'waybill',
        userId: user?.uid || 'guest',
        userEmail: user?.email || formData.deliveryRecipientEmail,
        userName: formData.deliveryRecipientName,
        pickupParkName: formData.pickupParkName,
        senderName: formData.senderName,
        pickupRecipientName: formData.pickupRecipientName,
        pickupRecipientIdNumber: formData.pickupRecipientIdNumber,
        pickupRecipientPhone: formData.pickupRecipientPhone,
        deliveryRecipientName: formData.deliveryRecipientName,
        deliveryRecipientPhone: formData.deliveryRecipientPhone,
        deliveryRecipientEmail: formData.deliveryRecipientEmail,
        deliveryArea: formData.deliveryArea,
        deliveryLandmark: formData.deliveryLandmark,
        packageDescription: formData.packageDescription,
        serviceType: 'Waybill Transfer',
        paymentMethod: paymentData.method,
        paymentStatus: paymentData.method === 'pickup_transfer' ? 'paid' : 'cod_pending',
        status: 'processing',
        currentLocation: 'Park pickup pending',
        price: 3000,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, 'shipments'), shipmentData);

      console.log('Waybill package saved to Firestore with ID:', docRef.id);

      const paymentRecordData = {
        userId: user?.uid || 'guest',
        trackingId: generatedWaybillNumber,
        customerName: formData.deliveryRecipientName,
        customerEmail: formData.deliveryRecipientEmail,
        amount: 3000,
        paymentMethod: paymentData.method,
        paymentReference: paymentData.reference || 'COD',
        status: paymentData.method === 'pickup_transfer' ? 'processing' as const : 'cod_pending' as const,
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, 'payments'), paymentRecordData);
      console.log('Payment record created for waybill:', generatedWaybillNumber);

      const webhookPayload = {
        waybillNumber: generatedWaybillNumber,
        trackingNumber: generatedWaybillNumber,
        shipmentType: 'waybill',
        pickupParkName: formData.pickupParkName,
        senderName: formData.senderName,
        pickupRecipientName: formData.pickupRecipientName,
        pickupRecipientIdNumber: formData.pickupRecipientIdNumber,
        pickupRecipientPhone: formData.pickupRecipientPhone,
        deliveryRecipientName: formData.deliveryRecipientName,
        deliveryRecipientPhone: formData.deliveryRecipientPhone,
        deliveryRecipientEmail: formData.deliveryRecipientEmail,
        deliveryAddress: `${formData.deliveryArea}, ${formData.deliveryLandmark}`,
        packageDescription: formData.packageDescription,
        serviceType: 'Waybill Transfer',
        price: 3000,
        paymentMethod: paymentData.method,
        paymentReference: paymentData.reference || 'COD',
        paymentStatus: paymentData.method === 'pickup_transfer' ? 'paid' : 'cod_pending',
        status: 'pending',
        firestoreId: docRef.id,
        createdAt: new Date().toISOString(),
      };

      console.log('Sending POST webhook to:', WEBHOOK_URL);
      console.log('POST payload:', webhookPayload);

      try {
        const postResponse = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
        waybillNumber: generatedWaybillNumber,
        trackingNumber: generatedWaybillNumber,
        firestoreId: docRef.id,
        shipmentType: 'waybill',
        pickupParkName: formData.pickupParkName,
        senderName: formData.senderName,
        pickupRecipientName: formData.pickupRecipientName,
        pickupRecipientIdNumber: formData.pickupRecipientIdNumber,
        pickupRecipientPhone: formData.pickupRecipientPhone,
        deliveryRecipientName: formData.deliveryRecipientName,
        deliveryRecipientPhone: formData.deliveryRecipientPhone,
        deliveryRecipientEmail: formData.deliveryRecipientEmail,
        deliveryArea: formData.deliveryArea,
        deliveryLandmark: formData.deliveryLandmark,
        serviceType: 'Waybill Transfer',
        price: '3000',
        paymentMethod: paymentData.method,
        paymentReference: paymentData.reference || 'COD',
        paymentStatus: paymentData.method === 'pickup_transfer' ? 'paid' : 'cod_pending',
      });

      const getWebhookUrl = `${WEBHOOK_GET_URL}?${getWebhookParams.toString()}`;
      console.log('Sending GET webhook to:', getWebhookUrl);

      try {
        const getResponse = await fetch(getWebhookUrl, { method: 'GET' });

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

      setWaybillNumber(generatedWaybillNumber);
      setPaymentReference(paymentData.reference || 'COD');
      setShowPaymentModal(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Package creation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setSubmitError(`Unable to create package: ${errorMessage}. Please try again or contact support.`);
    } finally {
      setIsSubmitting(false);
      setIsPaymentProcessing(false);
    }
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
  };

  const handleCopyWaybill = () => {
    navigator.clipboard.writeText(waybillNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAnother = () => {
    setWaybillNumber('');
    setFormData({
      pickupParkName: '',
      senderName: '',
      pickupRecipientName: '',
      pickupRecipientIdNumber: '',
      pickupRecipientPhone: '',
      deliveryArea: '',
      deliveryLandmark: '',
      deliveryRecipientName: '',
      deliveryRecipientPhone: '',
      deliveryRecipientEmail: '',
      packageDescription: ''
    });
    setErrors({});
    setSubmitError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (waybillNumber) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container-responsive py-8 md:py-16 lg:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-50 rounded-full w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-4 md:mb-6">
              <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-green-500" />
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 font-merienda-mobile md:font-merienda">
              Waybill Transfer Created Successfully!
            </h1>

            <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8">
              Your waybill transfer has been registered. Use the tracking number below to monitor your delivery.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 md:p-8 mb-6 md:mb-8">
              <p className="text-xs md:text-sm text-gray-600 mb-2">Tracking Number</p>
              <div className="flex items-center justify-center space-x-2">
                <p className="text-lg md:text-3xl font-bold text-yellow-600 font-mono break-all">
                  {waybillNumber}
                </p>
                <button
                  onClick={handleCopyWaybill}
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
                  <span className="font-medium">Waybill Transfer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">₦3,000</span>
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

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handlePaymentClose}
        amount={3000}
        email={formData.deliveryRecipientEmail}
        onPaymentSuccess={handlePaymentSuccess}
        packageDetails={{
          description: formData.packageDescription || 'Package',
          serviceType: 'Waybill Transfer'
        }}
        isProcessing={isPaymentProcessing}
      />

      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="container-responsive">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-bold font-merienda-mobile md:font-merienda">
              Create Waybill Transfer
            </h1>
          </div>
          <p className="text-blue-100 text-lg">
            Park pickup to local delivery in Port Harcourt
          </p>
        </div>
      </div>

      <div className="container-responsive py-12 pb-20">
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
              <MapPin className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Pickup Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Location/Park Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pickupParkName"
                  value={formData.pickupParkName}
                  onChange={handleInputChange}
                  placeholder="e.g., ABC Motors Park, Lagos"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pickupParkName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickupParkName && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupParkName}</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sender's Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleInputChange}
                  placeholder="Enter sender's full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.senderName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.senderName && (
                  <p className="text-red-500 text-sm mt-1">{errors.senderName}</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pickupRecipientName"
                  value={formData.pickupRecipientName}
                  onChange={handleInputChange}
                  placeholder="Recipient's full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pickupRecipientName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickupRecipientName && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupRecipientName}</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient ID Number (NIN) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pickupRecipientIdNumber"
                  value={formData.pickupRecipientIdNumber}
                  onChange={handleInputChange}
                  placeholder="Enter NIN"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pickupRecipientIdNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickupRecipientIdNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupRecipientIdNumber}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="pickupRecipientPhone"
                  value={formData.pickupRecipientPhone}
                  onChange={(e) => handlePhoneChange(e, 'pickupRecipientPhone')}
                  placeholder="+2348012345678"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pickupRecipientPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickupRecipientPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.pickupRecipientPhone}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-6">
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Delivery Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Area (Port Harcourt) <span className="text-red-500">*</span>
                </label>
                <select
                  name="deliveryArea"
                  value={formData.deliveryArea}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
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

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Landmark/Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="deliveryLandmark"
                  value={formData.deliveryLandmark}
                  onChange={handleInputChange}
                  placeholder="e.g., Opposite GT Bank"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.deliveryLandmark ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.deliveryLandmark && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryLandmark}</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="deliveryRecipientName"
                  value={formData.deliveryRecipientName}
                  onChange={handleInputChange}
                  placeholder="Recipient's full name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.deliveryRecipientName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.deliveryRecipientName && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryRecipientName}</p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="deliveryRecipientPhone"
                  value={formData.deliveryRecipientPhone}
                  onChange={(e) => handlePhoneChange(e, 'deliveryRecipientPhone')}
                  placeholder="+2348012345678"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.deliveryRecipientPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.deliveryRecipientPhone && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryRecipientPhone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="deliveryRecipientEmail"
                  value={formData.deliveryRecipientEmail}
                  onChange={handleInputChange}
                  placeholder="recipient@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.deliveryRecipientEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.deliveryRecipientEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.deliveryRecipientEmail}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8 mb-6">
            <div className="flex items-center space-x-2 mb-6">
              <Package className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Package Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="packageDescription"
                  value={formData.packageDescription}
                  onChange={handleInputChange}
                  placeholder="What are you sending?"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.packageDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.packageDescription && (
                  <p className="text-red-500 text-sm mt-1">{errors.packageDescription}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flat Price
                </label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-2xl font-bold text-blue-600">₦3,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row gap-3 md:gap-4 justify-center mt-8 mb-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial bg-yellow-400 hover:bg-yellow-500 text-black px-6 md:px-8 py-3 rounded-full font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  Creating waybill transfer...
                </>
              ) : (
                'Create Waybill Transfer'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-6 md:px-8 py-3 rounded-full font-semibold transition-all min-h-[44px]"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWaybillShipment;
