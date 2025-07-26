import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-tr from-blue-900 via-blue-800 to-blue-900 text-white relative overflow-hidden">
      {/* Decorative SVG wave */}
      <div className="absolute top-0 left-0 w-full -translate-y-full pointer-events-none">
        <svg viewBox="0 0 1440 90" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
          <path fill="#1e3a8a" fillOpacity="1" d="M0,32L48,53.3C96,75,192,117,288,117.3C384,117,480,75,576,69.3C672,64,768,96,864,117.3C960,139,1056,149,1152,133.3C1248,117,1344,75,1392,53.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-wide text-yellow-300">ग्राम पंचायत</h3>
            <p className="mb-4 text-blue-100">
              Serving the community with dedication and transparency.<br />
              Working towards rural development and empowerment.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-yellow-300 transition-colors" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-yellow-300 transition-colors" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-yellow-300 transition-colors" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-wide text-yellow-300">Quick Links</h3>
            <ul className="space-y-3 text-blue-100">
              <li>
                <Link to="/" className="hover:text-yellow-300 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:text-yellow-300 transition-colors">Government Schemes</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-yellow-300 transition-colors">Gallery</Link>
              </li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4 tracking-wide text-yellow-300">Contact Us</h3>
            <ul className="space-y-3 text-blue-100">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-1 text-yellow-300" />
                <span>Gram Panchayat Office,<br />Village Name, District,<br />State - PIN</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-yellow-300" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-yellow-300" />
                <span>grampanchayat@example.com</span>
              </li>
            </ul>
          </div>
        </div>
        {/* Divider */}
        <div className="border-t border-blue-800 mt-10 pt-6 text-center text-blue-200 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Powered By <span className="text-yellow-300 font-semibold">Byte Solutions Pvt Ltd.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;