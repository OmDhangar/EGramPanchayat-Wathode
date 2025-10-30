import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer
      role="contentinfo"
      className="font-tiro-marathi border-t-2 border-black bg-white"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 py-6">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
            ग्रामपंचायत वाठोडे, ता. शिरपूर, जि. धुळे
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            Gram Panchayat Vathode, Shirpur Dist. Dhule — Official Website
          </p>
        </div>

        {/* Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-black pt-6">
          {/* About */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 border-b border-black pb-1">
              ग्रामपंचायतीबद्दल
            </h3>
            <p className="text-gray-700 text-xs leading-relaxed">
              ग्रामपंचायत वाठोडे ग्रामविकास, पारदर्शक प्रशासन आणि नागरिकांच्या
              कल्याणासाठी कटिबद्ध आहे.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 border-b border-black pb-1">
              त्वरित दुवे
            </h3>

            {/* Desktop view (normal vertical) */}
            <ul className="hidden md:block space-y-1 text-xs">
              <li><Link to="/" className="hover:underline">मुख्यपृष्ठ</Link></li>
              <li><Link to="/schemes" className="hover:underline">शासकीय योजना</Link></li>
              <li><Link to="/apply-for-certificates" className="hover:underline">प्रमाणपत्रासाठी अर्ज</Link></li>
              <li><Link to="/notices" className="hover:underline">सार्वजनिक सूचना</Link></li>
              <li><Link to="/contact" className="hover:underline">संपर्क</Link></li>
            </ul>

            {/* Mobile view (horizontal row) */}
            <ul className="flex md:hidden overflow-x-auto no-scrollbar gap-4 text-xs mt-1">
              <li className="flex-shrink-0">
                <Link to="/" className="hover:underline whitespace-nowrap">
                  मुख्यपृष्ठ
                </Link>
              </li>
              <li className="flex-shrink-0">
                <Link to="/schemes" className="hover:underline whitespace-nowrap">
                  योजना
                </Link>
              </li>
              <li className="flex-shrink-0">
                <Link to="/apply-for-certificates" className="hover:underline whitespace-nowrap">
                  प्रमाणपत्रे
                </Link>
              </li>
              <li className="flex-shrink-0">
                <Link to="/notices" className="hover:underline whitespace-nowrap">
                  सूचना
                </Link>
              </li>
              <li className="flex-shrink-0">
                <Link to="/contact" className="hover:underline whitespace-nowrap">
                  संपर्क
                </Link>
              </li>
            </ul>
          </div>

          {/* Citizen Services */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 border-b border-black pb-1">
              नागरिक सुविधा
            </h3>
            <ul className="space-y-1 text-xs">
              <li><Link to="/apply-for-certificates" className="hover:underline">जन्म प्रमाणपत्र</Link></li>
              <li><Link to="/apply-for-certificates" className="hover:underline">मृत्यू प्रमाणपत्र</Link></li>
              <li><Link to="/apply-for-certificates" className="hover:underline">विवाह प्रमाणपत्र</Link></li>
              <li><Link to="/apply-for-certificates" className="hover:underline">डिजिटल स्वाक्षरी ७/१२</Link></li>
              <li><Link to="/apply-for-certificates" className="hover:underline">थकबाकी नसल्याचा दाखला</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 border-b border-black pb-1">
              संपर्क
            </h3>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start">
                <MapPin className="h-3.5 w-3.5 mr-2 text-black flex-shrink-0" />
                <span>ग्रामपंचायत कार्यालय, वाठोडे, ता. शिरपूर, जि. धुळे</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-3.5 w-3.5 mr-2 text-black flex-shrink-0" />
                <span>gpwathode158@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-6 border-t border-black pt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-700 text-center sm:text-left">
            <div>ही ग्रामपंचायत वाठोडे ची अधिकृत वेबसाईट आहे.</div>
            <div>शेवटचे अद्ययावत: {new Date().toLocaleDateString("en-IN")}</div> 
            {/* <div className="flex flex-wrap justify-center sm:justify-start gap-x-3 gap-y-1">
              <Link to="/privacy" className="hover:underline">गोपनीयता धोरण</Link>
              <Link to="/terms" className="hover:underline">अटी व नियम</Link>
              <Link to="/accessibility" className="hover:underline">अॅक्सेसीबिलिटी</Link>
              <Link to="/sitemap" className="hover:underline">साइटमॅप</Link>
            </div> */}
           
          </div>

          {/* Copyright */}
          <div className="mt-4 flex flex-col sm:flex-row items-center font-bold justify-between text-gray-600 gap-1">
            <p>&copy; {new Date().getFullYear()} ग्रामपंचायत वाठोडे — सर्व हक्क राखीव.</p>
            <p className="animate-blink">
  Developed by{" "}
  <span className="font-semibold  text-red">
    <a
      href="https://www.linkedin.com/in/pushkar-deore-a58506237/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline"
    >
      Pushkar
    </a>{" "}
    &amp;{" "}
    <a
      href="https://www.linkedin.com/in/om-dhangar-21219627a/"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:underline"
    >
      Om
    </a>
  </span>
</p>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
