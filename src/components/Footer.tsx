import React from 'react';
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import CurvyDivider from './CurvyDivider';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { label: 'Local Bike Delivery', href: '/services/local-bike-delivery' },
      { label: 'Nationwide Delivery', href: '/services/nationwide-delivery' },
      { label: 'Special Services', href: '/services/special-services' },
    ],
    support: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/services/contact' },
      { label: 'Track Package', href: '/services/tracking' },
    ],
  };

  const socialLinks = [
    { Icon: Instagram, href: 'https://instagram.com/jblogistics_ng', label: 'Instagram', clickable: true },
    { Icon: Facebook, href: 'https://www.facebook.com/share/1GV9uEYho7/', label: 'Facebook', clickable: true },
    { Icon: MessageCircle, href: '#', label: 'WhatsApp', clickable: false },
  ];

  return (
    <footer className="bg-gray-900 text-white relative">
      <div className="absolute top-0 left-0 right-0">
        <CurvyDivider color="#1e3a8a" position="top" variant="blue" />
      </div>
      <div className="container-responsive footer-compact py-12 desktop:py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-3xl font-light text-white tracking-tight">JB</span>
                  <div className="ml-1 flex space-x-1">
                    <div className="w-6 h-0.5 bg-yellow-400 transform rotate-12 translate-y-1"></div>
                    <div className="w-4 h-0.5 bg-yellow-400 transform rotate-12"></div>
                    <div className="w-3 h-0.5 bg-yellow-400 transform rotate-12 -translate-y-1"></div>
                  </div>
                </div>
                <div className="text-sm font-light text-white tracking-wider -mt-1">LOGISTICS</div>
                <div className="text-sm text-gray-400 italic -mt-0.5">on time, every time</div>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed font-light">
              Nigeria's trusted logistics partner, delivering excellence across all 36 states.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-yellow-400 mr-2" />
                <a 
                  href="https://maps.google.com/?q=Port+Harcourt,+Rivers+State,+Nigeria"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View Port Harcourt, Rivers State, Nigeria on Google Maps"
                  className="text-gray-300 hover:text-yellow-400 transition-colors cursor-pointer font-light"
                >
                  Port Harcourt, Rivers State
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-gray-300 font-light">+234 (0) 802 123 4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-yellow-400 mr-2" />
                <a 
                  href="mailto:info@jblogistics.ng"
                  aria-label="Send email to info@jblogistics.ng"
                  className="text-gray-300 hover:text-yellow-400 transition-colors cursor-pointer font-light"
                >
                  info@jblogistics.ng
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-medium mb-6">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-300 hover:text-yellow-400 transition-colors font-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-medium mb-6">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-300 hover:text-yellow-400 transition-colors font-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0 font-light">
              © {currentYear} JB Logistics. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {socialLinks.map(({ Icon, href, label, clickable }, index) => (
                clickable ? (
                  <a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                ) : (
                  <div
                    key={index}
                    aria-label={label}
                    className="text-gray-400 cursor-default"
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;