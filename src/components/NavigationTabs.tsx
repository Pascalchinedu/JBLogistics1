import React, { useState, useEffect, useRef } from 'react';
import { Package, Calculator, Truck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';
import CurvyDivider from './CurvyDivider';

const NavigationTabs = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('track');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const tabs = [
    { id: 'track', label: 'Track', icon: Package },
    { id: 'ship', label: 'Ship', icon: Truck },
    { id: 'account', label: 'Account', icon: User },
  ];

  const requiresAuth = (tabId: string) => {
    return ['track', 'ship'].includes(tabId);
  };

  const handleTabClick = (tabId: string) => {
    if (requiresAuth(tabId) && !isAuthenticated) {
      setPendingAction(tabId);
      setShowLoginModal(true);
      return;
    }
    setActiveTab(tabId);
  };

  const handleLoginSuccess = () => {
    // User will be redirected to dashboard, so just clean up
    setPendingAction(null);
  };

  const renderTabContent = () => {
    if (!isAuthenticated && requiresAuth(activeTab)) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Please sign in to access this feature</p>
          <button 
            onClick={() => setShowLoginModal(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-md font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'track':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Track Your Package</h3>
            <button
              onClick={() => handleNavigation('/services/tracking')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-md font-semibold transition-all btn-click-feedback"
              disabled={isNavigating}
            >
              Go to Tracking Page
            </button>
          </div>
        );
      case 'ship':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Ship Your Package</h3>
            <p className="text-gray-600">Ready to ship? Send your package and print labels.</p>
            <button
              onClick={() => handleNavigation('/services')}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-md font-semibold transition-all btn-click-feedback"
              disabled={isNavigating}
            >
              Send Package
            </button>
          </div>
        );
      case 'account':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Account Access</h3>
            <p className="text-gray-600">Manage your account and view package history.</p>
            {isAuthenticated ? (
              <button 
                onClick={() => handleNavigation('/dashboard')}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-md font-semibold transition-all btn-click-feedback"
                disabled={isNavigating}
              >
                {isNavigating ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Loading...
                  </div>
                ) : (
                  'Access Profile'
                )}
              </button>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-md font-semibold transition-all btn-click-feedback"
              >
                Sign In to Access Profile
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section ref={sectionRef} className="bg-gray-50 py-8 curvy-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className={`flex flex-wrap justify-center mb-6 transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 mx-1 mb-2 rounded-lg font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-yellow-400 text-black shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          <div className={`min-h-[120px] flex items-center transition-all duration-700 ease-out delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {renderTabContent()}
          </div>
        </div>
        
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            setPendingAction(null);
          }}
          onSuccess={handleLoginSuccess}
        />
      </div>
      <CurvyDivider color="white" />
    </section>
  );
};

export default NavigationTabs;