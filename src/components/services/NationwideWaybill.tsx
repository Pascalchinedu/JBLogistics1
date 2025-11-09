import React, { useState } from 'react';
import { Truck, MapPin, Shield, Clock, CheckCircle, Phone, Mail } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../auth/LoginModal';
import Header from '../Header';
import Footer from '../Footer';

const NationwideWaybill = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    fromState: '',
    toState: '',
    packageWeight: '',
    packageType: '',
    deliverySpeed: '',
    specialRequirements: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    console.log('Nationwide waybill booking:', formData);
    alert('Thank you! We will contact you shortly with a detailed quote and shipping options.');
    setFormData({
      name: '',
      phone: '',
      email: '',
      company: '',
      fromState: '',
      toState: '',
      packageWeight: '',
      packageType: '',
      deliverySpeed: '',
      specialRequirements: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const features = [
    {
      icon: MapPin,
      title: 'Nationwide Coverage',
      description: 'Delivering to all 36 states and FCT across Nigeria',
    },
    {
      icon: Truck,
      title: 'Door-to-Door Service',
      description: 'Complete pickup and delivery service nationwide',
    },
    {
      icon: Shield,
      title: 'Secure Transport',
      description: 'Insured packages with secure handling protocols',
    },
    {
      icon: Clock,
      title: 'Flexible Timing',
      description: 'Standard, express, and economy delivery options',
    },
  ];

  const nigerianStates = [
    'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
    'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT Abuja', 'Gombe',
    'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
    'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau',
    'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
  ];

  const deliveryTimes = [
    { value: 'economy', label: 'Economy (5-7 days)', description: 'Cost-effective option' },
    { value: 'standard', label: 'Standard (3-5 days)', description: 'Most popular choice' },
    { value: 'express', label: 'Express (1-2 days)', description: 'Fast delivery' },
    { value: 'overnight', label: 'Overnight (Next day)', description: 'Urgent delivery' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <Truck className="h-6 w-6 text-black" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">Nationwide Waybill Services</h1>
              </div>
              <p className="text-xl md:text-2xl font-light text-amber-100 leading-relaxed">
                Interstate shipping across all 36 states of Nigeria with door-to-door delivery and real-time tracking.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Get Quote
                </button>
                <button
                  onClick={() => navigate('/services/tracking')}
                  className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-4 rounded-full text-lg font-semibold transition-all"
                >
                  Track Package
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/WhatsApp Image 2025-08-22 at 00.37.35_b6737063.jpg"
                alt="Nationwide waybill services"
                className="object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Nationwide Services?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine Nigerian market expertise with world-class logistics technology to deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Delivery Options</h2>
              <div className="space-y-4">
                {deliveryTimes.map((option, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{option.label}</h3>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-gray-600">{option.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Ship</h2>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Documents & Papers</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Electronics</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Clothing & Textiles</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Books & Media</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Auto Parts</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Medical Supplies</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Industrial Equipment</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">General Merchandise</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Map */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Nigeria Coverage
            </h2>
            <p className="text-xl text-gray-600">
              We deliver to all 36 states and the Federal Capital Territory
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {nigerianStates.map((state, index) => (
                <div key={index} className="bg-white p-3 rounded-md text-center hover:bg-yellow-50 transition-colors">
                  <span className="text-gray-800 font-medium">{state}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Your Nationwide Shipping Quote
            </h2>
            <p className="text-xl text-gray-600">
              Fill out the form below for a detailed quote and shipping options
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fromState" className="block text-sm font-medium text-gray-700 mb-2">
                    From State *
                  </label>
                  <select
                    id="fromState"
                    name="fromState"
                    value={formData.fromState}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">Select origin state</option>
                    {nigerianStates.map((state, index) => (
                      <option key={index} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="toState" className="block text-sm font-medium text-gray-700 mb-2">
                    To State *
                  </label>
                  <select
                    id="toState"
                    name="toState"
                    value={formData.toState}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">Select destination state</option>
                    {nigerianStates.map((state, index) => (
                      <option key={index} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="packageWeight" className="block text-sm font-medium text-gray-700 mb-2">
                    Package Weight *
                  </label>
                  <select
                    id="packageWeight"
                    name="packageWeight"
                    value={formData.packageWeight}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">Select weight range</option>
                    <option value="0-1kg">0-1 kg</option>
                    <option value="1-5kg">1-5 kg</option>
                    <option value="5-10kg">5-10 kg</option>
                    <option value="10-25kg">10-25 kg</option>
                    <option value="25-50kg">25-50 kg</option>
                    <option value="50kg+">50+ kg</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="packageType" className="block text-sm font-medium text-gray-700 mb-2">
                    Package Type *
                  </label>
                  <select
                    id="packageType"
                    name="packageType"
                    value={formData.packageType}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">Select package type</option>
                    <option value="documents">Documents</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="auto-parts">Auto Parts</option>
                    <option value="medical">Medical Supplies</option>
                    <option value="general">General Merchandise</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="deliverySpeed" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Delivery Speed *
                </label>
                <select
                  id="deliverySpeed"
                  name="deliverySpeed"
                  value={formData.deliverySpeed}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="">Select delivery speed</option>
                  {deliveryTimes.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  id="specialRequirements"
                  name="specialRequirements"
                  rows={3}
                  value={formData.specialRequirements}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Any special handling requirements, fragile items, etc..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                {isAuthenticated ? 'Get Nationwide Shipping Quote' : 'Sign In to Get Quote'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-900 to-amber-700 rounded-lg p-8 text-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">Need Help with Your Package?</h3>
              <p className="text-amber-100 mb-6">
                Our nationwide shipping experts are here to assist you with any questions
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center justify-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <span className="font-semibold">+234 (0) 802 123 4567</span>
                </div>
                <div className="flex items-center justify-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <span className="font-semibold">nationwide@jblogistics.ng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <Footer />
    </div>
  );
};

export default NationwideWaybill;