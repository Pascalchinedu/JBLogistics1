import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import CurvyDivider from './CurvyDivider';
import { useStaggerAnimation } from '../hooks/useScrollAnimation';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What areas do you deliver to?",
      answer: "We provide local bike delivery across Port Harcourt and nationwide waybill services to all 36 states in Nigeria. Our coverage includes both urban and rural areas with reliable door-to-door service."
    },
    {
      question: "How do I track my package?",
      answer: "You can track your package using the tracking number provided via SMS or email. Simply enter your tracking number on our website or contact our customer service team for real-time updates."
    },
    {
      question: "What's your delivery timeframe?",
      answer: "Local bike delivery in Port Harcourt takes 1-8 hours depending on service type. Nationwide deliveries range from next-day to 7 days based on destination and service level selected."
    },
    {
      question: "Do you handle oversized items?",
      answer: "Yes, we handle packages of various sizes including larger items. Our nationwide waybill service accommodates oversized packages with special handling and appropriate vehicle assignment."
    },
    {
      question: "What are your rates?",
      answer: "Our rates vary based on distance, package size, weight, and delivery speed. Contact us for a personalized quote or use our online quote tool for instant pricing estimates."
    },
    {
      question: "How do I schedule a pickup?",
      answer: "You can schedule a pickup through our website booking forms, call our customer service line, or use our mobile-friendly contact options. We offer same-day pickup scheduling for most areas."
    }
  ];

  const { ref: sectionRef, visibleItems } = useStaggerAnimation(faqs.length, {
    threshold: 0.2,
    triggerOnce: true
  });

  return (
    <section ref={sectionRef} className="py-16 lg:py-20 bg-gray-50 curvy-divider">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Quick answers to common questions about our logistics services
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border-b border-gray-200 last:border-b-0 transition-all duration-700 ease-out ${
                visibleItems[index] 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 text-left hover:bg-gray-50 transition-colors focus:outline-none focus:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Still have questions? We're here to help!
          </p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Contact Us
          </button>
        </div>
      </div>
      <CurvyDivider color="white" />
    </section>
  );
};

export default FAQ;