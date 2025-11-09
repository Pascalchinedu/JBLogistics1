import React from 'react';
import { MapPin, Target, Eye, Users, Truck, Bike, CheckCircle, ArrowRight } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const AboutUs = () => {
  const milestones = [
    {
      year: '2021',
      title: 'JB Logistics Founded',
      description: 'Started in Port Harcourt to solve local delivery challenges',
    },
    {
      year: '2022',
      title: 'Local Bike Network',
      description: 'Expanded same-day delivery coverage across Port Harcourt',
    },
    {
      year: '2023',
      title: 'Nationwide Services',
      description: 'Launched interstate waybill services to all 36 states',
    },
    {
      year: '2024',
      title: 'Special Services',
      description: 'Added COD and emergency delivery options',
    },
  ];

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

  const services = [
    {
      icon: Bike,
      title: 'Local Bike Delivery',
      description: 'Same-day delivery across Port Harcourt',
    },
    {
      icon: Truck,
      title: 'Nationwide Waybill',
      description: 'Interstate shipping to all 36 states',
    },
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
              About JB Logistics
            </h1>
            <p className="text-xl md:text-2xl font-light text-amber-100 max-w-3xl mx-auto leading-relaxed">
              Born in Port Harcourt, serving Nigeria. We're bridging the gap between online vendors and their customers with reliable logistics solutions.
            </p>
            <div className="mt-8">
              <span className="inline-block bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold text-lg">
                on time, every time
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Our Story
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                JB Logistics was born in 2021 from a simple observation: Port Harcourt needed better delivery services. As online commerce grew, we witnessed countless frustrated vendors and disappointed customers dealing with unreliable logistics providers.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded right here in Rivers State, we started with a clear mission - to bridge the gap between online vendors and their customers through dependable, professional delivery services. What began as a local solution has grown into a trusted logistics partner serving customers across Nigeria.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Founded in Port Harcourt</h4>
                  <p className="text-gray-600">Rivers State, Nigeria - 2021</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/WhatsApp Image 2025-08-22 at 00.35.18_2c489b1f.jpg"
                alt="JB Logistics delivery service"
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-lg shadow-xl">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">2021</div>
                  <div className="text-sm font-semibold text-gray-700">Founded</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
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

            <div className="bg-white p-8 rounded-lg shadow-lg">
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

      {/* Why We Started */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why We Started
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The problem was clear: Port Harcourt's delivery services weren't meeting the needs of growing online businesses and their customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">😤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The Problem</h3>
              <p className="text-gray-600">
                Unreliable delivery services were frustrating online vendors and disappointing customers across Port Harcourt.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The Solution</h3>
              <p className="text-gray-600">
                We saw an opportunity to create a logistics service that actually delivered on its promises - on time, every time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The Result</h3>
              <p className="text-gray-600">
                A trusted logistics partner that has helped countless businesses grow and customers receive their orders reliably.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              From a local startup to a nationwide logistics provider
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-yellow-400"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="text-2xl font-bold text-yellow-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
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

      {/* What We Do Today */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What We Do Today
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive logistics solutions for businesses of all sizes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-lg shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="h-6 w-6 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 text-lg">{service.description}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Plus Special Services
              </h3>
              <p className="text-gray-600 mb-6">
                Cash-on-Delivery (COD) and emergency delivery options for your most critical packages
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">COD Services</span>
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">Emergency Delivery</span>
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">Real-time Tracking</span>
                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-amber-900 to-amber-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience the JB Logistics Difference?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
              Join thousands of businesses and customers who trust us with their logistics needs. From Port Harcourt to nationwide, we deliver on time, every time.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="/"
                className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                View Our Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <button className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;