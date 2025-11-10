import React from 'react';
import { ArrowRight, Bike, Truck, Zap, ShoppingCart, Store, Heart, Package, Weight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginModal from '../auth/LoginModal';
import PackageTypeModal from '../ShipmentTypeModal';
import Header from '../Header';
import Footer from '../Footer';
import CurvyDivider from '../CurvyDivider';

const MainServices = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showShipmentModal, setShowShipmentModal] = React.useState(false);

  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 150);
  };

  const mainServices = [
    {
      icon: Bike,
      title: 'Local Bike Delivery',
      subtitle: 'Within Port Harcourt',
      description: 'Fast, reliable bike delivery service across Port Harcourt with same-day and express delivery options.',
      features: ['Same-day delivery', 'Express delivery (1-3 hours)', 'Real-time tracking', 'Professional riders'],
      pricing: 'Starting from ₦500',
      deliveryTime: '1-8 hours',
      coverage: 'Port Harcourt & environs',
      link: '/services/local-bike-delivery',
      image: '/hero-delivery-van.jpg',
      color: 'bg-blue-500'
    },
    {
      icon: Truck,
      title: 'Nationwide Delivery',
      subtitle: 'All 36 States',
      description: 'Interstate shipping across all 36 states of Nigeria with door-to-door delivery and comprehensive tracking.',
      features: ['Door-to-door service', 'All 36 states coverage', 'Secure handling', 'Insurance options'],
      pricing: 'Starting from ₦1,500',
      deliveryTime: '1-7 days',
      coverage: 'Nationwide',
      link: '/services/nationwide-delivery',
      image: '/car-delivery.jpg',
      color: 'bg-green-500'
    },
    {
      icon: Zap,
      title: 'Express Delivery',
      subtitle: 'Ultra-Fast Service',
      description: 'Premium express delivery service for urgent packages that need to be delivered within 1-2 hours.',
      features: ['1-2 hour delivery', 'Priority handling', 'Dedicated courier', 'Emergency support'],
      pricing: 'Starting from ₦2,000',
      deliveryTime: '1-2 hours',
      coverage: 'Port Harcourt',
      link: '/services/express-delivery',
      image: '/waybill-info.jpg',
      color: 'bg-red-500'
    }
  ];

  const industryServices = [
    {
      icon: ShoppingCart,
      title: 'E-commerce Solutions',
      description: 'Fast delivery solutions for online retailers with same-day and next-day options',
      features: ['Order fulfillment', 'Last-mile delivery', 'Returns management', 'Real-time tracking'],
      image: '/hero-delivery-van.jpg',
    },
    {
      icon: Store,
      title: 'Food Vendor Services',
      description: 'Specialized food and perishable goods delivery with cold chain capabilities',
      features: ['Fresh produce delivery', 'Restaurant supply chains', 'Cold chain logistics', 'Perishable goods handling'],
      image: '/hello-october.jpg',
    },
    {
      icon: Heart,
      title: 'Healthcare & Pharmaceuticals',
      description: 'Specialized medical logistics with temperature-controlled and licensed transport',
      features: ['Medical equipment transport', 'Temperature-controlled delivery', 'Licensed pharmaceutical logistics', 'Hospital supply chains'],
      image: '/heavy-truck.jpg',
    },
    {
      icon: Package,
      title: 'Wholesale Distribution',
      description: 'Bulk shipping and distribution solutions for wholesale businesses',
      features: ['Bulk transportation', 'Warehousing solutions', 'Distribution networks', 'Cost optimization'],
      image: '/car-delivery.jpg',
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-900 via-amber-800 to-amber-700 text-white overflow-hidden curvy-divider">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Delivery Services
            </h1>
            <p className="text-xl md:text-2xl font-light text-amber-100 max-w-3xl mx-auto leading-relaxed">
              Choose from our comprehensive range of delivery solutions designed to meet every logistics need across Nigeria
            </p>
          </div>
        </div>
        <CurvyDivider color="white" />
      </section>

      {/* Main Services */}
      <section id="delivery-options" className="py-16 lg:py-24 bg-white curvy-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Delivery Option
            </h2>
            <p className="text-xl text-gray-600">
              Three main delivery services to meet all your logistics needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 service-card-mobile">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-32 md:h-48 object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-8">
                    <div className="flex items-center mb-3 md:mb-4">
                      <div className={`w-10 h-10 md:w-12 md:h-12 ${service.color} rounded-lg flex items-center justify-center mr-3 md:mr-4`}>
                        <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-2xl font-bold text-gray-900">{service.title}</h3>
                        <p className="text-sm md:text-base text-yellow-600 font-semibold">{service.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="grid grid-cols-1 gap-3 md:gap-4 mb-4 md:mb-6">
                      <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                        <div className="text-xs md:text-sm font-semibold text-gray-700">Pricing</div>
                        <div className="text-base md:text-lg font-bold text-green-600">{service.pricing}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                          <div className="text-xs md:text-sm font-semibold text-gray-700">Delivery Time</div>
                          <div className="text-xs md:text-sm text-gray-900">{service.deliveryTime}</div>
                        </div>
                        <div className="bg-gray-50 p-2 md:p-3 rounded-lg">
                          <div className="text-xs md:text-sm font-semibold text-gray-700">Coverage</div>
                          <div className="text-xs md:text-sm text-gray-900">{service.coverage}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full mr-2 md:mr-3"></div>
                          <span className="text-gray-700 text-xs md:text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          setShowLoginModal(true);
                        } else {
                          setShowShipmentModal(true);
                        }
                      }}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 md:px-6 py-2.5 md:py-3 rounded-lg text-sm md:text-base font-semibold transition-all flex items-center justify-center btn-click-feedback"
                      disabled={isNavigating}
                    >
                      {isNavigating ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                          <span className="text-xs md:text-base">Loading...</span>
                        </div>
                      ) : (
                        <>
                          Send Package
                          <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <CurvyDivider color="#f9fafb" />
      </section>

      {/* Industry Services */}
      <section className="py-16 lg:py-24 bg-gray-50 curvy-divider">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Industry-Specific Solutions
            </h2>
            <p className="text-xl text-gray-600">
              Specialized logistics services designed for your industry's unique requirements
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {industryServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all service-card-mobile">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={service.image}
                      alt={`${service.title} logistics`}
                      className="w-full h-32 md:h-48 object-cover"
                    />
                  </div>
                  <div className="p-4 md:p-8">
                    <div className="flex items-center mb-3 md:mb-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-3 md:mr-4">
                        <Icon className="h-5 w-5 md:h-6 md:w-6 text-black" />
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-gray-900">{service.title}</h3>
                    </div>
                    <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 leading-relaxed">{service.description}</p>
                    <div className="space-y-1.5 md:space-y-2 mb-4 md:mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-400 rounded-full mr-2 md:mr-3"></div>
                          <span className="text-xs md:text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        document.getElementById('delivery-options')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-sm md:text-base font-semibold transition-all btn-click-feedback"
                      disabled={isNavigating}
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <CurvyDivider color="white" />
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-amber-900 to-amber-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-amber-100 mb-8 max-w-3xl mx-auto">
              Contact us today to discuss your logistics needs and get a customized solution for your business
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                onClick={() => handleNavigation('/services/contact')}
                className="inline-flex items-center bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg btn-click-feedback"
                disabled={isNavigating}
              >
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button
                onClick={() => handleNavigation('/services/tracking')}
                className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-4 rounded-lg text-lg font-semibold transition-all btn-click-feedback"
                disabled={isNavigating}
              >
                Track Package
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <PackageTypeModal
        isOpen={showShipmentModal}
        onClose={() => setShowShipmentModal(false)}
      />
    </div>
  );
};

export default MainServices;