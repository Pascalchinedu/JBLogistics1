import React from 'react';
import { Target, Eye, Users, Award, MapPin, Clock, Shield, CheckCircle } from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';

const ServicesAbout = () => {
  const values = [
    {
      icon: CheckCircle,
      title: 'Reliability',
      description: 'On-time delivery is our promise, not just our tagline',
    },
    {
      icon: Users,
      title: 'Customer Focus',
      description: 'Every decision we make puts our customers first',
    },
    {
      icon: MapPin,
      title: 'Local Expertise',
      description: 'Deep understanding of Nigerian logistics landscape',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Constantly improving our services and technology',
    },
  ];

  const capabilities = [
    {
      icon: MapPin,
      title: 'Nationwide Coverage',
      description: 'Delivering to all 36 states and FCT with our extensive network',
    },
    {
      icon: Clock,
      title: 'Time-Definite Delivery',
      description: 'Same-day, next-day, and scheduled delivery options available',
    },
    {
      icon: Shield,
      title: 'Secure Handling',
      description: 'Your packages are insured and handled with utmost care',
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'ISO certified processes and quality management systems',
    },
  ];

  const stats = [
    { number: '50,000+', label: 'Packages Delivered Monthly' },
    { number: '99.2%', label: 'On-Time Delivery Rate' },
    { number: '36', label: 'States Covered' },
    { number: '24/7', label: 'Customer Support' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Our Services
            </h1>
            <p className="text-xl md:text-2xl font-light text-amber-100 max-w-3xl mx-auto leading-relaxed">
              Learn about our comprehensive logistics solutions and the commitment that drives our success
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                  <Target className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                To bridge the gap between online vendors and their customers by providing reliable, efficient, and professional logistics services that enable businesses to thrive and customers to receive their orders on time, every time.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Reliable delivery services</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Supporting online businesses</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Customer satisfaction focus</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                  <Eye className="h-6 w-6 text-black" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                To become Nigeria's most trusted logistics partner, expanding beyond Port Harcourt to serve businesses and customers across West Africa with innovative delivery solutions that set the standard for reliability and excellence.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">National expansion plans</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Technology-driven solutions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-gray-700">Regional leadership goal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Performance
            </h2>
            <p className="text-xl text-gray-600">
              Numbers that speak to our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl lg:text-4xl font-bold text-yellow-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center bg-gray-50 p-6 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Service Capabilities */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Capabilities
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive logistics solutions powered by expertise and technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{capability.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{capability.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-amber-900 to-amber-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience Our Services Today
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
              Ready to see why thousands of businesses trust JB Logistics with their delivery needs?
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                Get Started
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesAbout;