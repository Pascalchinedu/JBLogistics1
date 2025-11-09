import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CurvyDivider from './CurvyDivider';

const CustomerTestimonials = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = React.useState(false);

  const handleGetStarted = () => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate('/create-account');
      setIsNavigating(false);
    }, 150);
  };
  const testimonials = [
    {
      quote: "JB Logistics has transformed our e-commerce business. Their same-day delivery in Port Harcourt and reliable nationwide shipping have helped us grow our customer base significantly. On time, every time - they truly deliver on their promise!",
      name: "Adaora Okafor",
      company: "FashionHub Nigeria",
      location: "Port Harcourt",
      avatar: "AO",
      rating: 5
    },
    {
      quote: "As a medical supplies distributor, reliability is everything. JB Logistics handles our temperature-sensitive shipments with exceptional care. Their nationwide coverage and professional service have made them our trusted logistics partner.",
      name: "Dr. Ibrahim Musa",
      company: "MedSupply Solutions",
      location: "Lagos",
      avatar: "IM",
      rating: 5
    },
    {
      quote: "We've been using JB Logistics for our wholesale distribution across Nigeria for over two years. Their tracking system is excellent, and their customer service team always goes above and beyond to ensure our shipments arrive safely.",
      name: "Chioma Nwankwo",
      company: "TechCorp Distribution",
      location: "Abuja",
      avatar: "CN",
      rating: 5
    },
    {
      quote: "The COD service from JB Logistics has been a game-changer for our online store. They collect payments reliably and transfer funds quickly. Their bike delivery service in Port Harcourt is incredibly fast and professional.",
      name: "Emeka Okonkwo",
      company: "ShopNow Online",
      location: "Port Harcourt",
      avatar: "EO",
      rating: 5
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 lg:py-24 bg-gray-50 hidden md:block curvy-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it - hear from businesses across Nigeria who trust JB Logistics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">{testimonial.avatar}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <Quote className="h-6 w-6 text-yellow-400 mr-2" />
                    <div className="flex space-x-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  <blockquote className="text-gray-700 leading-relaxed mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-yellow-600 font-medium">{testimonial.company}</div>
                    <div className="text-gray-500 text-sm">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Join Our Satisfied Customers
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Experience the reliability and professionalism that has made JB Logistics the trusted choice for businesses across Nigeria
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              {!isAuthenticated && (
                <button 
                  onClick={handleGetStarted}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 btn-click-feedback"
                  disabled={isNavigating}
                >
                  {isNavigating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Loading...
                    </div>
                  ) : (
                    'Get Started Today'
                  )}
                </button>
              )}
              <button 
                onClick={() => window.location.href = '/services'}
                className="border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-black px-8 py-3 rounded-lg font-semibold transition-all"
              >
                View Our Services
              </button>
            </div>
          </div>
        </div>
      </div>
      <CurvyDivider color="white" />
    </section>
  );
};

export default CustomerTestimonials;