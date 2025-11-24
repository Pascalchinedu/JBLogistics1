import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './components/HomePage';
import CreateAccount from './components/auth/CreateAccount';
import Dashboard from './components/Dashboard';
import MainServices from './components/services/MainServices';
import NationwideWaybill from './components/services/NationwideWaybill';
import SpecialServices from './components/services/SpecialServices';
import ServicesTracking from './components/services/ServicesTracking';
import ServicesAbout from './components/services/ServicesAbout';
import ServicesContact from './components/services/ServicesContact';
import CreateShipment from './components/CreateShipment';
import CreateWaybillShipment from './components/CreateWaybillShipment';
import AdminStatusUpdate from './components/AdminStatusUpdate';

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname]);

  return null;
};

// Page transition wrapper
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition">
      {children}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/create-account" element={<PageTransition><CreateAccount /></PageTransition>} />
          <Route path="/services" element={<PageTransition><MainServices /></PageTransition>} />
          <Route path="/tracking" element={<PageTransition><ServicesTracking /></PageTransition>} />
          <Route path="/about" element={<PageTransition><ServicesAbout /></PageTransition>} />
          <Route path="/contact" element={<PageTransition><ServicesContact /></PageTransition>} />
          <Route path="/services/nationwide-waybill" element={<PageTransition><NationwideWaybill /></PageTransition>} />
          <Route path="/services/special-services" element={<PageTransition><SpecialServices /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
          <Route path="/create-shipment" element={<PageTransition><CreateShipment /></PageTransition>} />
          <Route path="/create-waybill-shipment" element={<PageTransition><CreateWaybillShipment /></PageTransition>} />
          <Route path="/admin/update-status" element={<PageTransition><AdminStatusUpdate /></PageTransition>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;