import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { FaUser } from "react-icons/fa";
import { useAuthContext } from "../Context/authContext";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  const { isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Detect scroll to add shadow and show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling down
        setShowNavbar(false);
      } else {
        // Scrolling up
        setShowNavbar(true);
      }
      lastScrollY.current = currentScrollY;
      setScrolled(currentScrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    {
      label: t("nav.village"),
      links: [
        { label: t("nav.about"), path: "/About-Vathode" },
        { label: t("gallery"), path: "/gallery" },
      ],
    },
    {
      label: t("nav.gp"),
      links: [
        { label: t("nav.members"), path: "/members" },
        { label: t("nav.meetings"), path: "/meetings" },
        { label: t("nav.schemes"), path: "/schemes" },
      ],
    },
    {
      label: t("nav.citizen"),
      links: [{ label: t("nav.apply"), path: "/apply-for-certificates" }],
    },
    {
      label: t("nav.public"),
      links: [{ label: t("nav.notices"), path: "/notices" }],
    },
    {
      label: t("nav.help"),
      links: [{ label: t("nav.contact"), path: "/contact" }],
    },
  ];

  const handleMobileDropdown = (idx: number) => {
    setMobileDropdown(mobileDropdown === idx ? null : idx);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${scrolled ? "shadow-lg bg-white" : "bg-white"} ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Top info bar */}
      <div className="bg-orange-500 text-white py-1 px-4">
        <div className="max-w-8xl mx-auto flex justify-between items-center text-xs">
          <div className="flex items-center space-x-4">
            <span>📧 example@vathode.com</span>
            <span>📞 0470-1234567</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-yellow-300 font-medium">आजची तारीख: {new Date().toLocaleDateString('hi-IN')}</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="py-3 border-b border-gray-200">
        <div className="max-w-8xl mx-auto flex items-center justify-between px-4">
          {/* Left logo */}
          <div className="flex items-center">
            <img 
              src="/images/mhlogo.png" 
              alt="Government Logo" 
              className="h-14 w-auto transition-all duration-300 hover:scale-105" 
            />
            <div className="h-10 w-px bg-gray-300 mx-4"></div>
            <img 
              src="/images/panchyatlogo.png" 
              alt="Panchayat Logo" 
              className="h-12 w-auto transition-all duration-300 hover:scale-105" 
            />
          </div>

          {/* Center title */}
          <div className="flex flex-col items-center flex-1 mx-4 text-center">
            <h1 className="text-3xl md:text-4xl text-blue-800 font-bold tracking-wide tiro-header leading-tight">
              {t("header.title")}
            </h1>
            <p className="text-xs md:text-sm text-gray-600 mt-1">{t("header.subtitle")}</p>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <img
              src="/images/azadi-ka-amrit-mahotsav-.jpg"
              alt="Other Logo"
              className="h-14 w-auto hidden md:block transition-all duration-300 hover:scale-105"
            />

            {!isAuthenticated ? (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <FaUser className="text-sm" />
                <span>{t("header.login")}</span>
              </button>
            ) : (
              <Link 
                to="/dashboard" 
                title={t("header.dashboard")}
                className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-all duration-300"
              >
                <FaUser className="text-xl text-blue-700" />
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden ml-2 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={24} className="text-blue-800" /> : <Menu size={24} className="text-blue-800" />}
            </button>
          </div>
        </div>
      </div>

      {/* Welcome marquee */}
      <div className="bg-gradient-to-r from-green-500 to-green-400 py-2">
        <div className="overflow-hidden w-full">
          <div className="animate-marquee whitespace-nowrap text-black font-tiro-devnagri text-sm md:text-base flex items-center justify-center">
            <span className="mx-2">⭐</span>
            <span className="font-tiro-marathi">{t("header.welcome")}</span>
            <span className="mx-2">⭐</span>
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-gradient-to-r from-blue-800 to-blue-900 shadow-inner">
        <div className="max-w-8xl mx-auto px-6">
          <ul className="flex justify-center space-x-1 py-0 text-white uppercase tracking-wide relative">
            <li className="relative group">
              <Link
                to="/"
                className={`flex items-center space-x-1 cursor-pointer transition-all duration-300 px-5 py-4 font-tiro-devnagri ${location.pathname === "/" ? "bg-blue-950 text-yellow-300" : "hover:bg-blue-700"}`}
              >
                <span>मुखपृष्ठ</span>
              </Link>
              <div className="absolute inset-x-0 top-full bg-blue-950 bg-opacity-95 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                <div className="py-2">
                  <Link
                    to="/"
                    className="block px-6 py-3 hover:bg-blue-800 transition-all text-lg font-tiro-devnagri"
                  >
                    मुखपृष्ठ
                  </Link>
                </div>
              </div>
            </li>
            
            {navItems.map((item, idx) => (
              <li
                key={idx}
                className="relative group"
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className={`flex items-center space-x-1 cursor-pointer transition-all duration-300 px-5 py-4 font-tiro-devnagri ${hovered === idx ? "bg-blue-700" : ""}`}>
                  <span>{item.label}</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${hovered === idx ? "rotate-180" : ""}`} />
                </div>
                
                {/* Dropdown */}
                {(hovered === idx) && (
                  <div className="absolute left-0 top-full w-56 bg-blue-950 bg-opacity-95 text-white rounded-b shadow-xl z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    {item.links.map((link, linkIdx) => (
                      <Link
                        to={link.path}
                        key={linkIdx}
                        className="block px-6 py-3 hover:bg-blue-800 transition-all duration-200 text-lg font-tiro-devnagri border-b border-blue-700 last:border-b-0"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setMobileMenuOpen(false)} 
            tabIndex={-1} 
          />
          <div className="relative bg-white h-full w-80 shadow-xl overflow-y-auto transform transition-all duration-300">
            <div className="p-5 bg-blue-800 text-white flex justify-between items-center">
              <h2 className="text-xl font-tiro-devnagri">मेनू</h2>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-blue-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex flex-col py-4">
              <Link
                to="/"
                className="px-6 py-3 text-blue-900 font-tiro-devnagri border-b border-gray-100 hover:bg-blue-50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                मुखपृष्ठ
              </Link>
              
              {navItems.map((item, idx) => (
                <div key={idx} className="border-b border-gray-100">
                  <button
                    className="flex items-center justify-between w-full text-left px-6 py-3 text-blue-900 font-tiro-devnagri hover:bg-blue-50 transition-all"
                    onClick={() => handleMobileDropdown(idx)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown 
                      size={18} 
                      className={`transition-transform duration-300 ${mobileDropdown === idx ? "rotate-180" : ""}`} 
                    />
                  </button>
                  
                  {mobileDropdown === idx && (
                    <div className="bg-blue-50 pl-6 overflow-hidden transition-all duration-300">
                      {item.links.map((link, linkIdx) => (
                        <Link
                          to={link.path}
                          key={linkIdx}
                          className="block py-3 text-blue-800 hover:bg-blue-100 transition-all border-b border-blue-100 last:border-b-0"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200">
              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all flex items-center justify-center space-x-2"
                >
                  <FaUser className="text-sm" />
                  <span>{t("header.login")}</span>
                </button>
              ) : (
                <Link
                  to="/dashboard"
                  className="block w-full py-3 bg-blue-100 text-blue-800 text-center rounded-lg hover:bg-blue-200 transition-all"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  डॅशबोर्ड
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}