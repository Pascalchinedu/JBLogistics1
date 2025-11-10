import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';
import PackageTypeModal from './ShipmentTypeModal';
import CurvyDivider from './CurvyDivider';

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showShipmentModal, setShowShipmentModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const typewriterRef = useRef<HTMLHeadingElement>(null);

  const fullText = 'Fast Delivery Service in Nigeria';

  useEffect(() => {
    setIsLoaded(true);

    // Typewriter effect
    let currentIndex = 0;
    const typingSpeed = 70; // milliseconds per character

    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        // Show buttons after typing completes
        setTimeout(() => {
          setShowButtons(true);
        }, 500);
      }
    }, typingSpeed);

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  const customerLogos = [
    { name: 'TechCorp', placeholder: 'TC' },
    { name: 'ShopNow', placeholder: 'SN' },
    { name: 'MedSupply', placeholder: 'MS' },
    { name: 'AutoParts', placeholder: 'AP' },
    { name: 'FashionHub', placeholder: 'FH' },
    { name: 'BookStore', placeholder: 'BS' },
  ];

  const handleShipNow = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setShowShipmentModal(true);
  };

  const handleTrackPackage = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/services/tracking');
      setIsNavigating(false);
    }, 150);
  };

  return (
    <>
      <section className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white overflow-hidden hero-section-mobile">
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/5"></div>
        
        <div className="relative container-responsive pt-8 md:pt-24 pb-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-4 md:space-y-8">
              <h1
                ref={typewriterRef}
                className="text-[36px] md:text-[48px] leading-tight md:leading-[1.2] tracking-tight min-h-[60px] md:min-h-[100px] hero-typewriter-mobile"
              >
                <span className="font-extrabold md:font-bold">{displayedText}</span>
                <span className={`inline-block w-0.5 h-6 md:h-10 bg-white ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
              </h1>
              <p className="text-lg md:text-xl font-light text-amber-100 leading-relaxed max-w-2xl tracking-wide">
                Ship your package with Nigeria's trusted logistics partner for reliable nationwide delivery
              </p>
              <div className={`flex flex-row gap-4 hero-buttons-mobile ${showButtons ? 'delayed-appear' : 'opacity-0'}`}>
                <button
                  onClick={handleShipNow}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-3 md:px-6 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all shadow-lg btn-click-feedback professional-shadow floating-button"
                  disabled={isNavigating}
                >
                  {isNavigating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-black mr-2"></div>
                      <span className="text-xs md:text-base">Loading...</span>
                    </div>
                  ) : (
                    'Send Package'
                  )}
                </button>
                <button
                  onClick={handleTrackPackage}
                  className="flex-1 border-2 border-white text-white hover:bg-white hover:text-amber-800 px-4 py-3 md:px-6 md:py-3 rounded-full text-sm md:text-base font-semibold transition-all hover:shadow-lg btn-click-feedback floating-button"
                  disabled={isNavigating}
                >
                  Track Package
                </button>
              </div>
              
              {/* Customer Logos Row */}
              <div className="pt-8 border-t border-amber-600/30">
                <p className="text-amber-200 text-sm font-light mb-4 tracking-wide">
                  Trusted by leading businesses across Nigeria
                </p>
                <div className="flex items-center space-x-6 opacity-80">
                  {customerLogos.map((logo, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                      title={logo.name}
                    >
                      <span className="text-white font-light text-sm">{logo.placeholder}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className={`relative transition-all duration-1000 ease-out ${
              isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}>
              <div className="aspect-w-4 aspect-h-3 lg:aspect-w-3 lg:aspect-h-4">
                <img
                  src="/delivery-person-1.jpg"
                  alt="We're still Delivering - delivery person with yellow van"
                  className="object-cover rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-300 professional-shadow"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow-400 text-black p-4 rounded-full shadow-lg animate-pulse">
                <div className="text-center">
                  <div className="text-2xl font-medium">100%</div>
                  <div className="text-xs font-medium tracking-wide">On-Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CurvyDivider color="#f9fafb" />
      </section>
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <PackageTypeModal
        isOpen={showShipmentModal}
        onClose={() => setShowShipmentModal(false)}
      />
    </>
  );
};

export default Hero;