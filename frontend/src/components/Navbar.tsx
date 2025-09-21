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
        scrolled ? "shadow-md bg-white" : "bg-white"
      } ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}
    >
      {/* Top info bar */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-1 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-1 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Mail size={12} className="mr-1" />
              <span>{t("header.email")}</span>
            </div>
            <div className="flex items-center">
              <Phone size={12} className="mr-1" />
              <span>{t("header.phone")}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <Calendar size={12} className="mr-1" />
              <span>
                {t("header.date")}:{" "}
                {new Date().toLocaleDateString(
                  i18n.language === "mr" ? "hi-IN" : "en-IN"
                )}
              </span>
            </div>

            {/* Language Switcher */}
            <div className="flex gap-1">
              <button
                onClick={() => i18n.changeLanguage("en")}
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  i18n.language === "en"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-blue-700"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => i18n.changeLanguage("mr")}
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  i18n.language === "mr"
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-green-700"
                }`}
              >
                MR
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="py-2  border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
          {/* Logos */}
          <div className="flex items-center space-x-2">
            <img
              src="/images/mhlogo.png"
              alt="Gov Logo"
              className="h-10 w-auto"
            />
            <img
              src="/images/panchyatlogo.png"
              alt="Panchayat Logo"
              className="h-8 w-auto"
            />
          </div>

          {/* Center title */}
          <div className="hidden md:flex flex-col items-center flex-1 mx-4 my-2 text-center">
            <h1 className="text-3xl lg:text-3xl text-blue-800 font-bold tracking-wide">
              {t("header.title")}
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <img
                src="/images/azadi-ka-amrit-mahotsav-.jpg"
                alt="Other Logo"
                className="h-10 w-auto"
              />
            </div>

            {!isAuthenticated ? (
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md text-sm flex items-center space-x-1"
              >
                <FaUser className="text-xs" />
                <span className="hidden sm:inline">{t("header.login")}</span>
              </button>
            ) : (
              <Link
                to="/dashboard"
                className="p-1.5 bg-blue-100 rounded-full hover:bg-blue-200"
              >
                <FaUser className="text-lg text-blue-700" />
              </Link>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 bg-blue-50 rounded border border-blue-100"
            >
              {mobileMenuOpen ? (
                <X size={20} className="text-blue-800" />
              ) : (
                <Menu size={20} className="text-blue-800" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile title */}
        <div className="md:hidden mt-1 text-center px-2">
          <h1 className="text-lg text-blue-800 font-bold">{t("header.title")}</h1>
        </div>
      </div>

      {/* Welcome bar */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 py-1 text-sm text-white text-center">
        {t("header.welcome")}
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:block bg-gradient-to-r from-blue-800 to-blue-900">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex justify-center space-x-1 py-2 text-white">
            <li>
              <Link
                to="/"
                className={`flex items-center space-x-1 px-4 py-2 ${
                  location.pathname === "/"
                    ? "bg-blue-950 text-yellow-300"
                    : "hover:bg-blue-700"
                }`}
              >
                <FaHome className="text-sm" />
                <span>{t("nav.home")}</span>
              </Link>
            </li>
            {navItems.map((item, idx) => (
              <li key={idx} className="relative group">
                <div className="flex items-center space-x-1 px-4 py-2 hover:bg-blue-700 cursor-pointer">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  <ChevronDown size={14} />
                </div>
                {/* Dropdown */}
                <div className="absolute left-0 top-full w-44 bg-blue-950 hidden group-hover:block">
                  {item.links.map((link, i) => (
                    <Link
                      key={i}
                      to={link.path}
                      className="block px-4 py-2 hover:bg-blue-800 text-sm"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}