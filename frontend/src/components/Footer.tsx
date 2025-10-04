import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer
      role="contentinfo"
      className="font-tiro-marathi border-t-4 border-black bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            ग्रामपंचायत वाठोडे, ता. शिरपूर, जि. धुळे
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Gram Panchayat Vathode, Shirpur Dist. Dhule — Official Website
          </p>
        </div>

        {/* Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-black pt-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-black pb-1">
              ग्रामपंचायतीबद्दल
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              ग्रामपंचायत वाठोडे ग्रामविकास, पारदर्शक प्रशासन आणि नागरिकांच्या
              कल्याणासाठी कटिबद्ध आहे.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-black pb-1">
              त्वरित दुवे
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:underline">
                  मुख्यपृष्ठ
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:underline">
                  शासकीय योजना
                </Link>
              </li>
              <li>
                <Link to="/applyforcertificates" className="hover:underline">
                  प्रमाणपत्रासाठी अर्ज
                </Link>
              </li>
              <li>
                <Link to="/notices" className="hover:underline">
                  सार्वजनिक सूचना
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">
                  संपर्क
                </Link>
              </li>
            </ul>
          </div>

          {/* Citizen Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-black pb-1">
              नागरिक सुविधा
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/birthCertificate" className="hover:underline">
                  जन्म प्रमाणपत्र
                </Link>
              </li>
              <li>
                <Link to="/deathCertificate" className="hover:underline">
                  मृत्यू प्रमाणपत्र
                </Link>
              </li>
              <li>
                <Link to="/marriageCertificate" className="hover:underline">
                  विवाह प्रमाणपत्र
                </Link>
              </li>
              <li>
                <Link to="/digitalSigned712" className="hover:underline">
                  डिजिटल स्वाक्षरी ७/१२
                </Link>
              </li>
              <li>
                <Link to="/noOutstandingDebts" className="hover:underline">
                  थकबाकी नसल्याचा दाखला
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 border-b border-black pb-1">
              संपर्क
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 text-black" />
                <span>
                  ग्रामपंचायत कार्यालय, वाठोडे, ता. शिरपूर, जि. धुळे
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-black" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-black" />
                <span>gpwathode158@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-10 border-t border-black pt-6 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-700">
            <div>ही ग्रामपंचायतीची अधिकृत वेबसाईट आहे.</div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <Link to="/privacy" className="hover:underline">
                गोपनीयता धोरण
              </Link>
              <Link to="/terms" className="hover:underline">
                अटी व नियम
              </Link>
              <Link to="/accessibility" className="hover:underline">
                अॅक्सेसीबिलिटी
              </Link>
              <Link to="/sitemap" className="hover:underline">
                साइटमॅप
              </Link>
            </div>
            <div className="sm:text-right">
              शेवटचे अद्ययावत:{" "}
              {new Date().toLocaleDateString("en-IN")}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-gray-600">
            <p>
              &copy; {new Date().getFullYear()} ग्रामपंचायत वाठोडे — सर्व हक्क
              राखीव.
            </p>
            <p>
              Powered by{" "}
              <span className="font-semibold text-black">
              Om dhangar and Pushkar Deore
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
