import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, Star, Users, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CurvyDivider from './CurvyDivider';
import { useStaggerAnimation } from '../hooks/useScrollAnimation';

const WhyChooseUs = () => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const [packagesCount, setPackagesCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const getCurrentMonth = () => {
    const months = [
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    return months[new Date().getMonth()];
  };

  const handleNavigation = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      navigate(path);
      setIsNavigating(false);
    }, 150);
  };

  const benefits = [
    {
      icon: CheckCircle,
      title: 'Reliability You Can Trust',
      description: 'Over 99% on-time delivery rate with real-time tracking for complete peace of mind',
    },
    {
      icon: Star,
      title: 'Exceptional Customer Service',
      description: 'Dedicated support team available 24/7 to assist with all your shipping needs',
    },
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'Deep understanding of Nigerian logistics landscape with local presence nationwide',
    },
    {
      icon: Award,
      title: 'Industry Recognition',
      description: 'Award-winning logistics solutions trusted by thousands of businesses across Nigeria',
    },
  ];

  const { ref: benefitsRef, visibleItems: benefitsVisible } = useStaggerAnimation(benefits.length, {
    threshold: 0.15,
    triggerOnce: true
  });

  const stats = [
    { number: '50,000+', label: 'Packages Delivered Monthly', isCounter: true },
    { number: '99.2%', label: 'On-Time Delivery Rate', isCounter: false },
    { number: '36', label: 'States Covered', isCounter: false },
    { number: '24/7', label: 'Customer Support', isCounter: false },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let currentCount = 0;
          const targetCount = 50000;
          const increment = 100;
          const duration = 2000;
          const stepTime = duration / (targetCount / increment);

          const counter = setInterval(() => {
            currentCount += increment;
            if (currentCount >= targetCount) {
              setPackagesCount(targetCount);
              clearInterval(counter);
            } else {
              setPackagesCount(currentCount);
            }
          }, stepTime);

          return () => clearInterval(counter);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="container-responsive">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
            Why Choose JB Logistics?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine Nigerian market expertise with world-class logistics technology to deliver exceptional results
          </p>
        </div>

        {/* Statistics */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className={`text-3xl lg:text-4xl font-bold text-yellow-600 mb-2 ${hasAnimated ? 'counter-pop' : ''}`}>
                {index === 0 && stat.isCounter
                  ? `${packagesCount.toLocaleString()}+`
                  : stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Benefits Grid */}
        <div ref={benefitsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isLeft = index % 2 === 0;
            return (
              <div 
                key={index} 
                className={`bg-gray-50 p-8 rounded-lg hover:bg-gray-100 transition-all duration-700 ease-out professional-shadow ${
                  benefitsVisible[index]
                    ? 'opacity-100 translate-x-0'
                    : isLeft 
                      ? 'opacity-0 -translate-x-12'
                      : 'opacity-0 translate-x-12'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-amber-900 to-amber-700 rounded-lg p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img
                src="/hello-october.jpg"
                alt="HELLO OCTOBER promotional - worker in safety vest"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                HELLO {getCurrentMonth()} - Ready to Experience the JB Logistics Difference?
              </h3>
              <p className="text-amber-100 mb-6 text-lg">
                Join thousands of satisfied customers who trust us with their logistics needs
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={() => handleNavigation('/services')}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 btn-click-feedback professional-shadow"
                  disabled={isNavigating}
                >
                  View Our Services
                </button>
                <button 
                  onClick={() => handleNavigation('/services/contact')}
                  className="border-2 border-white text-white hover:bg-white hover:text-amber-800 px-8 py-3 rounded-lg font-semibold transition-all btn-click-feedback"
                  disabled={isNavigating}
                >
                  Contact Our Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CurvyDivider variant="brown" />
    </section>
  );
};

export default WhyChooseUs;