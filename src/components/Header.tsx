import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, ChevronDown, User, LogOut, Package } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeNav, setActiveNav] = useState('');

  useEffect(() => {
    // Set active navigation based on current path
    const path = location.pathname;
    if (path === '/services' || path.startsWith('/services/')) {
      setActiveNav('services');
    } else if (path === '/tracking') {
      setActiveNav('tracking');
    } else if (path === '/about') {
      setActiveNav('about');
    } else if (path === '/contact') {
      setActiveNav('contact');
    } else {
      setActiveNav('');
    }
  }, [location.pathname]);

  const handleNavigation = async (path: string, navKey: string) => {
    setIsNavigating(true);
    setIsMenuOpen(false);
    setActiveNav(navKey);
    
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 150);
  };

  const handleLogout = async () => {
    try {
      setIsUserMenuOpen(false);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a href="/" className="flex flex-col hover:opacity-80 transition-opacity cursor-pointer">
                <div className="flex items-center">
                  <span className="text-2xl font-light text-black tracking-tight">JB</span>
                  <div className="ml-1 flex space-x-1">
                    <div className="w-6 h-0.5 bg-yellow-400 transform rotate-12 translate-y-1"></div>
                    <div className="w-4 h-0.5 bg-yellow-400 transform rotate-12"></div>
                    <div className="w-3 h-0.5 bg-yellow-400 transform rotate-12 -translate-y-1"></div>
                  </div>
                </div>
                <div className="text-xs font-light text-black tracking-wider -mt-1">LOGISTICS</div>
                <div className="text-xs text-gray-600 italic -mt-0.5">on time, every time</div>
              </a>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => handleNavigation('/services', 'services')}
                className={`nav-link px-3 py-2 text-base font-medium transition-all btn-click-feedback ${
                  activeNav === 'services' ? 'active' : 'text-gray-900 hover:text-yellow-600'
                }`}
                disabled={isNavigating}
              >
                Services
              </button>
              <button
                onClick={() => handleNavigation('/tracking', 'tracking')}
                className={`nav-link px-3 py-2 text-base font-medium transition-all btn-click-feedback ${
                  activeNav === 'tracking' ? 'active' : 'text-gray-900 hover:text-yellow-600'
                }`}
                disabled={isNavigating}
              >
                Tracking
              </button>
              <button
                onClick={() => handleNavigation('/about', 'about')}
                className={`nav-link px-3 py-2 text-base font-medium transition-all btn-click-feedback ${
                  activeNav === 'about' ? 'active' : 'text-gray-900 hover:text-yellow-600'
                }`}
                disabled={isNavigating}
              >
                About
              </button>
              <button
                onClick={() => handleNavigation('/contact', 'contact')}
                className={`nav-link px-3 py-2 text-base font-medium transition-all btn-click-feedback ${
                  activeNav === 'contact' ? 'active' : 'text-gray-900 hover:text-yellow-600'
                }`}
                disabled={isNavigating}
              >
                Contact
              </button>
            </div>
          </nav>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-gray-700 hover:text-yellow-600 cursor-pointer transition-colors">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-base font-light">Find Nearest Location</span>
            </div>
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md text-base font-medium transition-colors btn-click-feedback"
                >
                  <User className="h-4 w-4" />
                  <span>{user?.name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 professional-shadow">
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          handleNavigation('/dashboard', 'dashboard');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                      >
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        Profile
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-500" />
                        My Packages
                      </button>
                      <hr className="my-2" />
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center text-red-600"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-700 hover:text-yellow-600 px-4 py-2 text-base font-medium transition-all btn-click-feedback"
                >
                  Sign In
                </button>
                <Link
                  to="/create-account"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-md text-base font-medium transition-colors btn-click-feedback professional-shadow"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-gray-50 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 btn-click-feedback"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            <button
              onClick={() => handleNavigation('/services', 'services')}
              className={`block w-full text-left px-3 py-2 font-medium transition-all btn-click-feedback ${
                activeNav === 'services' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-900 hover:text-yellow-600'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => handleNavigation('/tracking', 'tracking')}
              className={`block w-full text-left px-3 py-2 font-medium transition-all btn-click-feedback ${
                activeNav === 'tracking' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-900 hover:text-yellow-600'
              }`}
            >
              Tracking
            </button>
            <button
              onClick={() => handleNavigation('/about', 'about')}
              className={`block w-full text-left px-3 py-2 font-medium transition-all btn-click-feedback ${
                activeNav === 'about' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-900 hover:text-yellow-600'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleNavigation('/contact', 'contact')}
              className={`block w-full text-left px-3 py-2 font-medium transition-all btn-click-feedback ${
                activeNav === 'contact' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-900 hover:text-yellow-600'
              }`}
            >
              Contact
            </button>
            
            {isAuthenticated ? (
              <div className="px-3 py-2">
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleNavigation('/dashboard', 'dashboard');
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2.5 rounded-full text-sm font-medium btn-click-feedback transition-all"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-full text-sm font-medium btn-click-feedback transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-3 py-2 space-y-2">
                <button 
                  onClick={() => setShowLoginModal(true)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-2 rounded-md text-sm font-semibold btn-click-feedback"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => handleNavigation('/create-account', '')}
                  className="block w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-md text-sm font-semibold text-center transition-all btn-click-feedback"
                >
                  Create Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Loading overlay */}
      {isNavigating && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
        </div>
      )}
      
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </header>
  );
};

export default Header;