import React, { useEffect, useState } from 'react';
import { ShoppingCart, Factory, Store, Package2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CurvyDivider from './CurvyDivider';

const Industries = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 150);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('industries-section');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const industries = [
    {
      icon: ShoppingCart,
      title: 'E-commerce',
      description: 'Fast delivery solutions for online retailers with same-day and next-day options',
      features: ['Order fulfillment', 'Last-mile delivery', 'Returns management', 'Real-time tracking'],
      image: '/delivery-person-1.jpg',
    },
    {
      icon: Package2,
      title: 'Healthcare & Pharmaceuticals',
      description: 'Specialized medical logistics with temperature-controlled and licensed transport',
      features: ['Medical equipment transport', 'Temperature-controlled delivery', 'Licensed pharmaceutical logistics', 'Hospital supply chains'],
      image: '/delivery-person-2.jpg',
    },
    {
      icon: Store,
      title: 'Food Vendor',
      description: 'Specialized food and perishable goods delivery with cold chain capabilities',
      features: ['Fresh produce delivery', 'Restaurant supply chains', 'Cold chain logistics', 'Perishable goods handling'],
      image: '/delivery-person-4.jpg',
    },
    {
      icon: Factory,
      title: 'Wholesale',
      description: 'Bulk shipping and distribution solutions for wholesale businesses',
      features: ['Bulk transportation', 'Warehousing solutions', 'Distribution networks', 'Cost optimization'],
      image: '/delivery-person-3.jpg',
    },
  ];

  return (
    <section id="industries-section" className="py-16 lg:py-24 bg-gray-50 curvy-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Industries We Serve
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tailored logistics solutions designed specifically for your industry's unique requirements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {industries.map((industry, index) => {
            const Icon = industry.icon;
            const isLeftSide = index % 2 === 0;
            const animationClass = isVisible 
              ? (isLeftSide ? 'animate-slide-in-left' : 'animate-slide-in-right')
              : 'opacity-0 translate-x-12';
            
            return (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-500 ${animationClass}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={industry.image}
                    alt={`${industry.title} logistics`}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center mr-4">
                      <Icon className="h-6 w-6 text-black" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{industry.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{industry.description}</p>
                  <div className="space-y-2 mb-6">
                    {industry.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      handleNavigation('/services');
                      setTimeout(() => {
                        const element = document.querySelector('h2:has-text("Choose Your Delivery Option")') || 
                                      document.querySelector('[id*="delivery-option"]') ||
                                      document.querySelector('h2');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 500);
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-all btn-click-feedback"
                    disabled={isNavigating}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Don't See Your Industry?
            </h3>
            <p className="text-gray-600 mb-6">
              We work with businesses across all sectors. Contact us to discuss your specific logistics needs.
            </p>
            <button 
              onClick={() => handleNavigation('/services')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold transition-all btn-click-feedback"
              disabled={isNavigating}
            >
              View Our Services
            </button>
          </div>
        </div>
      </div>
      <CurvyDivider color="white" />
    </section>
  );
};

export default Industries;