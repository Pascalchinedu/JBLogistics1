import React, { useState } from 'react';
import { Star, CreditCard, Zap, Shield, CheckCircle, Phone, Mail, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../auth/LoginModal';
import Header from '../Header';
import Footer from '../Footer';

const SpecialServices = () => {
  const { isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    serviceType: '',
    pickupAddress: '',
    deliveryAddress: '',
    packageValue: '',
    urgencyLevel: '',
    specialInstructions: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    
    console.log('Special services booking:', formData);
    alert('Thank you! Our special services team will contact you shortly to arrange your delivery.');
    setFormData({
      name: '',
      phone: '',
      email: '',
      serviceType: '',
      pickupAddress: '',
      deliveryAddress: '',
      packageValue: '',
      urgencyLevel: '',
      specialInstructions: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const specialServices = [
    {
      icon: CreditCard,
      title: 'Cash-on-Delivery (COD)',
      description: 'Collect payment from recipients upon delivery',
      features: [
        'Secure payment collection',
        'Real-time payment confirmation',
        'Multiple payment methods accepted',
        'Instant fund transfer to sender'
      ],
      image: '/WhatsApp Image 2025-08-22 at 00.44.08_4064b679.jpg'
    },
    {
      icon: Zap,
      title: 'Emergency Delivery',
      description: 'Urgent deliveries for critical situations',
      features: [
        '24/7 availability',
        'Priority handling',
        'Dedicated courier assignment',
        'Real-time status updates'
      ],
      image: '/WhatsApp Image 2025-08-22 at 00.35.18_2c489b1f.jpg'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Handling',
      description: 'All special deliveries are handled with extra security measures',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock support for emergency and special deliveries',
    },
    {
      icon: Star,
      title: 'Premium Service',
      description: 'White-glove treatment for your most important shipments',
    },
    {
      icon: CheckCircle,
      title: 'Guaranteed Delivery',
      description: 'Money-back guarantee on our special service commitments',
    },
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
                  <Star className="h-6 w-6 text-black" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">Special Services</h1>
              </div>
              <p className="text-xl md:text-2xl font-light text-amber-100 leading-relaxed">
                Premium logistics solutions including Cash-on-Delivery (COD) and emergency delivery services for your most critical shipments.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                >
                  Request Service
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                  Emergency Hotline
                </button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/WhatsApp Image 2025-08-22 at 00.44.08_4064b679.jpg"
                alt="Special services - HELLO OCTOBER promotional"
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
              Why Choose Our Special Services?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Premium logistics solutions designed for your most important and time-sensitive deliveries
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

      {/* Special Services Details */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Special Services
            </h2>
            <p className="text-xl text-gray-600">
              Tailored solutions for unique delivery requirements
            </p>
          </div>

          <div className="space-y-16">
            {specialServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-black" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{service.title}</h3>
                    </div>
                    <p className="text-xl text-gray-600 leading-relaxed">{service.description}</p>
                    <div className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                      Learn More
                    </button>
                  </div>
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COD Details */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Cash-on-Delivery (COD) Process</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Package Pickup</h4>
                    <p className="text-gray-600">We collect your package and COD amount details</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Secure Delivery</h4>
                    <p className="text-gray-600">Package is delivered and payment collected from recipient</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Payment Transfer</h4>
                    <p className="text-gray-600">Collected amount is transferred to your account within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Emergency Delivery</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <Zap className="h-6 w-6 text-red-600 mr-2" />
                  <h3 className="text-lg font-semibold text-red-800">24/7 Emergency Service</h3>
                </div>
                <p className="text-red-700 mb-4">
                  For critical deliveries that can't wait - medical supplies, legal documents, emergency parts, and more.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-red-700 text-sm">Available 24/7, 365 days a year</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-red-700 text-sm">Dedicated emergency hotline</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-red-600 mr-2" />
                    <span className="text-red-700 text-sm">Priority handling and routing</span>
                  </div>
                </div>
                <button className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                  Emergency Hotline: +234 (0) 800 URGENT
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form" className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Request Special Services
            </h2>
            <p className="text-xl text-gray-600">
              Fill out the form below and our special services team will contact you
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
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type *
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="">Select service type</option>
                  <option value="cod">Cash-on-Delivery (COD)</option>
                  <option value="emergency">Emergency Delivery</option>
                  <option value="both">Both COD and Emergency</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Address *
                  </label>
                  <input
                    type="text"
                    id="pickupAddress"
                    name="pickupAddress"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <input
                    type="text"
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="packageValue" className="block text-sm font-medium text-gray-700 mb-2">
                    Package Value (for COD)
                  </label>
                  <input
                    type="text"
                    id="packageValue"
                    name="packageValue"
                    value={formData.packageValue}
                    onChange={handleChange}
                    placeholder="₦ 0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label htmlFor="urgencyLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Urgency Level *
                  </label>
                  <select
                    id="urgencyLevel"
                    name="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  >
                    <option value="">Select urgency</option>
                    <option value="standard">Standard (Same day)</option>
                    <option value="urgent">Urgent (Within 4 hours)</option>
                    <option value="emergency">Emergency (ASAP)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions *
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  rows={4}
                  value={formData.specialInstructions}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Please describe your special requirements, package contents, and any specific instructions..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                {isAuthenticated ? 'Request Special Services' : 'Sign In to Request'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white">
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Emergency Delivery Hotline</h3>
              <p className="text-red-100 mb-6">
                For urgent deliveries that can't wait - available 24/7, 365 days a year
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center justify-center">
                  <Phone className="h-5 w-5 mr-2" />
                  <span className="font-semibold text-lg">+234 (0) 800 URGENT</span>
                </div>
                <div className="flex items-center justify-center">
                  <Mail className="h-5 w-5 mr-2" />
                  <span className="font-semibold">emergency@jblogistics.ng</span>
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

export default SpecialServices;