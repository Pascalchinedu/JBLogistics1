import React from 'react';
import { useNavigate } from 'react-router-dom';
import CurvyDivider from './CurvyDivider';
import { useStaggerAnimation } from '../hooks/useScrollAnimation';

const KeyFeatures = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = React.useState(false);
  
  const cards = [
    { title: 'E-commerce Solutions', desc: 'Fast, reliable delivery for online retailers across Nigeria' },
    { title: 'Manufacturing', desc: 'Supply chain management and B2B logistics solutions' },
    { title: 'Retail Distribution', desc: 'Store-to-store and warehouse distribution services' },
    { title: 'Wholesale', desc: 'Bulk shipping and inventory management solutions' }
  ];
  
  const { ref: cardsRef, visibleItems } = useStaggerAnimation(cards.length, {
    threshold: 0.2,
    triggerOnce: true
  });

  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 150);
  };

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-responsive">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
            Explore Logistics Solutions by Industry
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex justify-center lg:justify-start">
              <div className="w-full max-w-md">
                <img
                  src="/logistics-worker-yellow.png"
                  alt="JB Logistics delivery worker with package"
                  className="w-full h-auto object-cover rounded-lg shadow-lg professional-shadow"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-medium text-gray-900 leading-tight text-center md:text-left mobile:text-center mobile:text-xl">
              From e-commerce and retail to manufacturing and wholesale, JB Logistics turns delivery challenges into growth opportunities across Nigeria
            </h3>
            
            <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cards.map((card, index) => (
                <div 
                  key={index}
                  className={`bg-gray-50 p-6 rounded-lg professional-shadow transition-all duration-700 ease-out ${
                    visibleItems[index] 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{card.title}</h4>
                  <p className="text-gray-600 text-sm">{card.desc}</p>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => handleNavigation('/services')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 btn-click-feedback professional-shadow"
              disabled={isNavigating}
            >
              {isNavigating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                  Loading...
                </div>
              ) : (
                'View Our Services'
              )}
            </button>
          </div>
        </div>
      </div>
      <CurvyDivider variant="brown" />
    </section>
  );
};

export default KeyFeatures;