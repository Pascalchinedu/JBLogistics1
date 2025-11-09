import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import LoginModal from './auth/LoginModal';

const Contact = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      details: '+234 (0) 802 123 4567',
      subtext: 'Available for all inquiries',
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: 'info@jblogistics.ng',
      subtext: 'We respond within 24 hours',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Port Harcourt, Rivers State',
      subtext: 'Nigeria',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon - Fri: 8AM - 6PM',
      subtext: 'Sat: 9AM - 4PM, Sun: Closed',
    },
  ];

  return (
    <section id="contact" className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white curvy-divider-top">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Contact Information
          </h2>
          <p className="text-lg text-gray-600">
            Reach out to us through any of the following channels
          </p>
        </div>

        <div className="space-y-6">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div
                key={index}
                className="flex items-center space-x-6 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                style={{
                  animation: `slideUp 0.6s ease-out ${index * 0.15}s both`
                }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Icon className="h-7 w-7 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{info.title}</h3>
                  <p className="text-lg text-gray-800 font-medium">{info.details}</p>
                  <p className="text-gray-500 text-sm mt-1">{info.subtext}</p>
                </div>
              </div>
            );
          })}
        </div>

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;