import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Phone, Mail, Calendar } from "lucide-react";
import { FaUser, FaHome } from "react-icons/fa";
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
  const { t, i18n } = useTranslation();

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
      icon: "🏡",
      links: [
        { label: t("nav.about"), path: "/About-Vathode" },
        { label: t("nav.gallery"), path: "/gallery" },
      ],
    },
    {
      label: t("nav.gp"),
      icon: "🏛",
      links: [
        { label: t("nav.members"), path: "/members" },
        { label: t("nav.meetings"), path: "/meetings" },
        { label: t("nav.schemes"), path: "/schemes" },
      ],
    },
    {
      label: t("nav.citizen"),
      icon: "👥",
      links: [{ label: t("nav.apply"), path: "/apply-for-certificates" }],
    },
    {
      label: t("nav.public"),
      icon: "📢",
      links: [{ label: t("nav.notices"), path: "/notices" }],
    },
    {
      label: t("nav.help"),
      icon: "❓",
      links: [{ label: t("nav.contact"), path: "/contact" }],
    },
  ];

  const handleMobileDropdown = (idx: number) => {
    setMobileDropdown(mobileDropdown === idx ? null : idx);
  };

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        scrolled ? "shadow-lg bg-white" : "bg-white"
      } ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Top info bar */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 px-4">
        <div className="max-w-8xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs space-y-1 sm:space-y-0">
          {/* Left side - Email + Phone */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Mail size={14} className="mr-1" />
              <span>{t("header.email")}</span>
            </div>
            <div className="flex items-center">
              <Phone size={14} className="mr-1" />
              <span>{t("header.phone")}</span>
            </div>
          </div>

          {/* Right side - Date + Language Switcher */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <span className="font-medium">
                {t("header.date")}:{" "}
                {new Date().toLocaleDateString(
                  i18n.language === "mr" ? "hi-IN" : "en-IN"
                )}
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex gap-2">
              <button
                onClick={() => i18n.changeLanguage("en")}
                className={`px-2 py-1 rounded text-xs font-bold ${
                  i18n.language === "en"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-blue-700"
                }`}
              >
                English
              </button>
              <button
                onClick={() => i18n.changeLanguage("mr")}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  i18n.language === "mr"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-green-700"
                }`}
              >
                मराठी
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="py-3 border-b border-gray-200 bg-white">
        <div className="max-w-8xl mx-auto flex items-center justify-between px-4">
          {/* Left logo */}
          <div className="flex items-center">
            <div className="flex items-center bg-blue-50 p-1 rounded-lg border border-blue-100">
              <img
                src="/images/mhlogo.png"
                alt={t("header.govLogoAlt")}
                className="h-14 w-auto transition-all duration-300 hover:scale-105"
              />
              <div className="h-10 w-px bg-blue-200 mx-3"></div>
              <img
                src="/images/panchyatlogo.png"
                alt={t("header.panchayatLogoAlt")}
                className="h-12 w-auto transition-all duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Center title */}
          <div className="hidden md:flex flex-col items-center flex-1 mx-4 text-center">
            <h1 className="text-4xl lg:text-3xl text-blue-800 font-bold tracking-wide tiro-header leading-tight">
              {t("header.title")}
            </h1>
            {/* <p className="text-xs text-gray-600 mt-1">{t("header.subtitle")}</p> */}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block bg-orange-100 p-1 rounded-lg border border-orange-200">
              <img
                src="/images/azadi-ka-amrit-mahotsav-.jpg"
                alt={t("header.otherLogoAlt")}
                className="h-14 w-auto transition-all duration-300 hover:scale-105"
              />
            </div>

            {!isAuthenticated ? (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <FaUser className="text-sm" />
                <span className="hidden sm:inline">{t("header.login")}</span>
              </button>
            ) : (
              <Link
                to="/dashboard"
                title={t("header.dashboard")}
                className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-all duration-300 shadow-sm"
              >
                <FaUser className="text-xl text-blue-700" />
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-2 p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all border border-blue-100 md:hidden"
              aria-label={t("header.menu")}
            >
              {mobileMenuOpen ? (
                <X size={24} className="text-blue-800" />
              ) : (
                <Menu size={24} className="text-blue-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile title */}
        <div className="md:hidden mt-2 text-center px-4">
          <h1 className="text-xl text-blue-800 font-bold tiro-header">
            {t("header.title")}
          </h1>
          <p className="text-xs text-gray-600">{t("header.subtitle")}</p>
        </div>
      </div>

      {/* Welcome marquee */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 py-2 shadow-inner">
        <div className="overflow-hidden w-full">
          <div className="animate-marquee whitespace-nowrap text-white font-tiro-devnagri text-sm flex items-center justify-center">
            <span className="mx-2">⭐</span>
            <span className="font-tiro-marathi">{t("header.welcome")}</span>
            <span className="mx-2">⭐</span>
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-gradient-to-r from-blue-800 to-blue-900 shadow-inner">
        <div className="max-w-8xl mx-auto px-6">
          <ul className="flex justify-center space-x-1 py-0 text-white tracking-wide relative">
            <li className="relative group">
              <Link
                to="/"
                className={`flex items-center space-x-1 cursor-pointer transition-all duration-300 px-5 py-4 font-tiro-devnagri ${
                  location.pathname === "/"
                    ? "bg-blue-950 text-yellow-300"
                    : "hover:bg-blue-700"
                }`}
              >
                <FaHome className="text-sm font-bold" />
                <span>{t("nav.home")}</span>
              </Link>
            </li>

            {navItems.map((item, idx) => (
              <li
                key={idx}
                className="relative group"
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                <div
                  className={`flex items-center space-x-1 cursor-pointer transition-all duration-300 px-5 py-4 font-tiro-devnagri ${
                    hovered === idx ||
                    location.pathname.includes(item.links[0].path)
                      ? "bg-blue-700"
                      : ""
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      hovered === idx ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Dropdown */}
                {hovered === idx && (
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
          <div className="relative bg-white h-full w-80 max-w-full shadow-xl overflow-y-auto transform transition-all duration-300">
            <div className="p-5 bg-gradient-to-r from-blue-800 to-blue-900 text-white flex justify-between items-center">
              <h2 className="text-xl font-tiro-devnagri">{t("header.menuTitle")}</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-full hover:bg-blue-700 transition-colors"
                aria-label={t("header.closeMenu")}
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col py-4">
              <Link
                to="/"
                className="flex items-center px-6 py-4 text-blue-900 font-tiro-devnagri border-b border-gray-100 hover:bg-blue-50 transition-all"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FaHome className="mr-3 text-blue-700" />
                <span>{t("nav.home")}</span>
              </Link>

              {navItems.map((item, idx) => (
                <div key={idx} className="border-b border-gray-100">
                  <button
                    className="flex items-center justify-between w-full text-left px-6 py-4 text-blue-900 font-tiro-devnagri hover:bg-blue-50 transition-all"
                    onClick={() => handleMobileDropdown(idx)}
                  >
                    <div className="flex items-center">
                      <span className="mr-3 text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${
                        mobileDropdown === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {mobileDropdown === idx && (
                    <div className="bg-blue-50 overflow-hidden transition-all duration-300">
                      {item.links.map((link, linkIdx) => (
                        <Link
                          to={link.path}
                          key={linkIdx}
                          className="block py-3 pl-14 pr-6 text-blue-800 hover:bg-blue-100 transition-all border-b border-blue-100 last:border-b-0"
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

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              {!isAuthenticated ? (
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 bg-gradient-to-r font-tiro-marathi from-blue-600 to-blue-700 text-white rounded-lg  hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center space-x-2 shadow-md"
                >
                  <FaUser className="text-sm" />
                  <span>{t("header.login")}</span>
                </button>
              ) : (
                <Link
                  to="/dashboard"
                  className="block w-full py-3 bg-blue-100 text-blue-800 text-center rounded-lg hover:bg-blue-200 transition-all shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t("header.dashboard")}
                </Link>
              )}
            </div>

            {/* Contact info in mobile menu */}
            <div className="px-6 py-4 bg-gray-100 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                <div className="flex items-center mb-2">
                  <Mail size={14} className="mr-2 text-blue-600" />
                  <span>{t("header.email")}</span>
                </div>
                <div className="flex items-center">
                  <Phone size={14} className="mr-2 text-blue-600" />
                  <span>{t("header.phone")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}