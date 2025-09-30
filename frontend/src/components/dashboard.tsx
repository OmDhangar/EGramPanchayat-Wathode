import { Link } from "react-router-dom";
import {
  FaUserShield,
  FaUser,
  FaCertificate,
  FaBell,
  FaUsers,
  FaUpload, 
  FaCheckCircle,
  FaChevronRight,
  FaChartLine,
  FaFileAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "../Context/authContext";
import { Navigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const cardVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { 
      duration: 0.6, 
      type: "spring",
      bounce: 0.2
    } 
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    scale: 0.98, 
    transition: { duration: 0.3 } 
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Dashboard() {
  const { user, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }


  const isAdmin = user.role === "admin";
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-0 md:p-4 lg:p-6">
      {/* Header with subtle animation */}
      {/* <motion.header 
        className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-200/70 py-4 px-4 md:px-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center"
              whileHover={{ rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <FaCertificate className="text-white text-sm" />
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
      
            </h1>
          </div>
          <LogoutButton />
        </div>
      </motion.header> */}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Profile Card with enhanced design */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 overflow-hidden"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-blue-100/30 to-green-100/30 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-r from-blue-100/20 to-green-100/20 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`w-28 h-28 rounded-2xl ${isAdmin ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-blue-500 to-cyan-600"} flex items-center justify-center shadow-lg`}>
                {isAdmin ? 
                  <FaUserShield className="text-4xl text-white" /> :
                  <FaUser className="text-4xl text-white" />
                }
              </div>
              <span
                className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                  isAdmin ? "bg-green-500" : "bg-blue-500"
                }`}
                title={isAdmin ? "Admin" : "Client"}
              >
                {isAdmin ? "A" : "U"}
              </span>
            </motion.div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
                {isAdmin ? "Admin Dashboard" : "Citizen Dashboard"}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-slate-600 mb-2">
                <span className="font-medium flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-sm">
                  {isAdmin ? <FaUserShield className="text-green-600" /> : <FaUser className="text-blue-600" />}
                  {user.fullName}
                </span>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                  ID: {user.email?.split('@')[0] ?? ""}
                </span>
              </div>
              <p className="text-slate-500 max-w-xl">
                Welcome back, {user.fullName?.split(' ')[0] ?? ""}
                {isAdmin
                  ? "Manage certificates, users, and approvals with ease."
                  : "Access your certificates and apply for new ones in just a few clicks."}
              </p>
            </div>
            <button
              className="bg-red-500 text-white h-full w-fit px-4 py-2 rounded-3xl font-bold hover:bg-red-600 transition"
              onClick={logout}
            >Logout</button>
            
            
          </div>
        </motion.div>

        {/* Service Cards with enhanced animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={user.role}
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-10"
          >
            <motion.h2 
              className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2"
              variants={fadeIn}
            >
              {isAdmin ? (
                <>
                  <div className="p-2 rounded-lg bg-green-100 text-green-600">
                    <FaUserShield />
                  </div>
                  Admin Services
                </>
              ) : (
                <>
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FaUser />
                  </div>
                  User Services
                </>
              )}
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={staggerContainer}
            >
              {isAdmin ? (
                // Admin cards
                <>
                  <ServiceCard
                    to="/admin/users"
                    icon={<FaUsers className="text-2xl text-yellow-600" />}
                    title={t("dashboard.admin.manageUsers.title")}
                    subtitle="वापरकर्ते व्यवस्थापित करा"
                    description={t("dashboard.admin.manageUsers.description")}
                    color="yellow"
                    delay={0}
                  />
                  <ServiceCard
                    to="/admin/blogs"
                    icon={<FaFileAlt className="text-2xl text-indigo-600" />}
                    title={t("dashboard.admin.blogs.title")}
                    subtitle="ब्लॉग्स"
                    description={t("dashboard.admin.blogs.description")}
                    color="indigo"
                    delay={0.3}
                  />
                  <ServiceCard
                    to="/admin/approvals"
                    icon={<FaCheckCircle className="text-2xl text-green-600" />}
                    title={t("dashboard.admin.certificateApprovals.title")}
                    subtitle="प्रमाणपत्र मंजुरी"
                    description={t("dashboard.admin.certificateApprovals.description")}
                    color="green"
                    delay={0.1}
                  />
                  <ServiceCard
                    to="/admin/upload"
                    icon={<FaUpload className="text-2xl text-blue-600" />}
                    title={t("dashboard.admin.uploadCertificates.title")}
                    subtitle="प्रमाणपत्र अपलोड करा"
                    description={t("dashboard.admin.uploadCertificates.description")}
                    color="blue"
                    delay={0.2}
                  />
                  
                  
                </>
              ) : (
                // User cards
                <>
                  <ServiceCard
                    to="/user/certificates"
                    icon={<FaCertificate className="text-2xl text-blue-600" />}
                    title={t("dashboard.user.viewCertificates.title")}
                    subtitle="प्रमाणपत्र पहा"
                    description={t("dashboard.user.viewCertificates.description")}
                    color="blue"
                    delay={0}
                  />
                  <ServiceCard
                    to="/apply-for-certificates"
                    icon={<FaCheckCircle className="text-2xl text-green-600" />}
                    title={t("dashboard.user.applyForCertificate.title")}
                    subtitle="प्रमाणपत्रासाठी अर्ज करा"
                    description={t("dashboard.user.applyForCertificate.description")}
                    color="green"
                    delay={0.1}
                  />
                  <ServiceCard
                    to="/user/notifications"
                    icon={<FaBell className="text-2xl text-yellow-600" />}
                    title={t("dashboard.user.notifications.title")}
                    subtitle="सूचना"
                    description={t("dashboard.user.notifications.description")}
                    color="yellow"
                    delay={0.2}
                  />
                  <ServiceCard
                    to="/user/status"
                    icon={<FaChartLine className="text-2xl text-purple-600" />}
                    title={t("dashboard.user.applicationStatus.title")}
                    subtitle="अर्जाची स्थिती"
                    description={t("dashboard.user.applicationStatus.description")}
                    color="purple"
                    delay={0.3}
                  />
                </>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Quick Stats for Mobile */}
        {isMobile && (
          <motion.div 
            className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-slate-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-medium text-slate-800 mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-2xl font-bold text-blue-700">12</p>
                <p className="text-sm text-blue-600">{isAdmin ? "Pending" : "Your Certificates"}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-2xl font-bold text-green-700">5</p>
                <p className="text-sm text-green-600">{isAdmin ? "Approved" : "Active"}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Service Card Component
function ServiceCard({ to, icon, title, subtitle, description, color, delay = 0 }) {
  const colorClasses = {
    blue: "from-blue-50 to-cyan-50 border-blue-100 hover:shadow-blue-100",
    green: "from-green-50 to-emerald-50 border-green-100 hover:shadow-green-100",
    yellow: "from-yellow-50 to-amber-50 border-yellow-100 hover:shadow-yellow-100",
    purple: "from-purple-50 to-violet-50 border-purple-100 hover:shadow-purple-100",
    indigo: "from-indigo-50 to-blue-50 border-indigo-100 hover:shadow-indigo-100",
  };

  return (
    <motion.div
      variants={fadeIn}
      custom={delay}
    >
      <Link to={to}>
        <motion.div
          className={`h-full bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col`}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="mb-4 flex justify-between items-start">
            <div className={`p-3 rounded-xl bg-${color}-100`}>
              {icon}
            </div>
            <motion.div 
              className={`text-${color}-600 opacity-0 group-hover:opacity-100 transition-opacity`}
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaChevronRight />
            </motion.div>
          </div>
          <h3 className={`text-lg font-semibold text-slate-800 mb-1`}>{title}</h3>
          <p className={`text-${color}-700 text-sm mb-2 font-medium`}>{subtitle}</p>
          <p className="text-slate-600 text-sm flex-1">{description}</p>
          <div className="mt-4 pt-3 border-t border-slate-100/50 flex justify-between items-center">
            <span className={`text-xs font-medium text-${color}-700`}>Access now</span>
            <FaChevronRight className={`text-${color}-600 text-xs`} />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}