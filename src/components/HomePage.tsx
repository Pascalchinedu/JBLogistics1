import React from 'react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Hero from './Hero';
import NavigationTabs from './NavigationTabs';
import KeyFeatures from './KeyFeatures';
import CustomerTestimonials from './ServiceAreas';
import WhyChooseUs from './WhyChooseUs';
import Footer from './Footer';
import FAQ from './FAQ';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    // Check for email verification success
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('verified') === 'true') {
      // Show success message or redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard?verified=true';
      }, 2000);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <NavigationTabs />
      <KeyFeatures />
      <CustomerTestimonials />
      <WhyChooseUs />
      <FAQ />
      <Footer />
    </div>
  );
};

export default HomePage;