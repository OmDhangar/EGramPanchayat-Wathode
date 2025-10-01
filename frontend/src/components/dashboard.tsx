import { Link, Navigate } from "react-router-dom";
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
import { useTranslation } from "react-i18next";
import { useAuthContext } from "../Context/authContext";
import { Variants } from "framer-motion";
import { useState, useEffect } from "react";

const cardVariants: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.6, type: "spring", bounce: 0.2 } 
  },
  exit: { opacity: 0, y: 20, scale: 0.98, transition: { duration: 0.3 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthContext();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const isAdmin = user.role === "admin";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-0 md:p-4 lg:p-6">
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Profile Card */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 overflow-hidden"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`w-28 h-28 rounded-2xl ${isAdmin ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-blue-500 to-cyan-600"} flex items-center justify-center shadow-lg`}>
                {isAdmin ? <FaUserShield className="text-4xl text-white" /> : <FaUser className="text-4xl text-white" />}
              </div>
              <span
                className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${isAdmin ? "bg-green-500" : "bg-blue-500"}`}
                title={isAdmin ? t("dashboard.adminTitle") : t("dashboard.userTitle")}
              >
                {isAdmin ? "A" : "U"}
              </span>
            </motion.div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
                {isAdmin ? t("dashboard.adminTitle") : t("dashboard.userTitle")}
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
                {t("dashboard.welcome", { name: user.fullName?.split(' ')[0] ?? "" })}{" "}
                {isAdmin ? t("dashboard.adminSubtitle") : t("dashboard.userSubtitle")}
              </p>
            </div>
            <button
              className="bg-red-500 text-white h-full w-fit px-4 py-2 rounded-3xl font-bold hover:bg-red-600 transition"
              onClick={logout}
            >
              {t("common.logout")}
            </button>
          </div>
        </motion.div>

        {/* Services */}
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
                  {t("services.adminTitle")}
                </>
              ) : (
                <>
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    <FaUser />
                  </div>
                  {t("services.userTitle")}
                </>
              )}
            </motion.h2>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              variants={staggerContainer}
            >
              {isAdmin ? (
                <>
                  <ServiceCard
                    to="/admin/users"
                    icon={<FaUsers className="text-2xl text-yellow-600" />}
                    title={t("services.manageUsers.title")}
                    description={t("services.manageUsers.desc")}
                    color="yellow"
                  />
                  <ServiceCard
                    to="/admin/blogs"
                    icon={<FaFileAlt className="text-2xl text-indigo-600" />}
                    title={t("services.blogs.title")}
                    description={t("services.blogs.desc")}
                    color="indigo"
                  />
                  <ServiceCard
                    to="/admin/approvals"
                    icon={<FaCheckCircle className="text-2xl text-green-600" />}
                    title={t("services.certificateApprovals.title")}
                    description={t("services.certificateApprovals.desc")}
                    color="green"
                  />
                  <ServiceCard
                    to="/admin/upload"
                    icon={<FaUpload className="text-2xl text-blue-600" />}
                    title={t("services.uploadCertificates.title")}
                    description={t("services.uploadCertificates.desc")}
                    color="blue"
                  />
                </>
              ) : (
                <>
                  <ServiceCard
                    to="/user/certificates"
                    icon={<FaCertificate className="text-2xl text-blue-600" />}
                    title={t("services.viewCertificates.title")}
                    description={t("services.viewCertificates.desc")}
                    color="blue"
                  />
                  <ServiceCard
                    to="/apply-for-certificates"
                    icon={<FaCheckCircle className="text-2xl text-green-600" />}
                    title={t("services.applyCertificate.title")}
                    description={t("services.applyCertificate.desc")}
                    color="green"
                  />
                  <ServiceCard
                    to="/user/notifications"
                    icon={<FaBell className="text-2xl text-yellow-600" />}
                    title={t("services.notifications.title")}
                    description={t("services.notifications.desc")}
                    color="yellow"
                  />
                  <ServiceCard
                    to="/user/status"
                    icon={<FaChartLine className="text-2xl text-purple-600" />}
                    title={t("services.applicationStatus.title")}
                    description={t("services.applicationStatus.desc")}
                    color="purple"
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
            <h3 className="text-lg font-medium text-slate-800 mb-4">
              {t("dashboard.quickStats")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-2xl font-bold text-blue-700">12</p>
                <p className="text-sm text-blue-600">
                  {isAdmin ? t("dashboard.pending") : t("dashboard.yourCertificates")}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-2xl font-bold text-green-700">5</p>
                <p className="text-sm text-green-600">
                  {isAdmin ? t("dashboard.approved") : t("dashboard.active")}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Service Card Component
function ServiceCard({ to, icon, title, description, color, delay = 0 }) {
  return (
    <motion.div variants={fadeIn} custom={delay}>
      <Link to={to}>
        <motion.div
          className={`h-full bg-gradient-to-br from-${color}-50 to-${color}-100 border rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col`}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="mb-4 flex justify-between items-start">{icon}</div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-600 text-sm flex-1">{description}</p>
          <div className="mt-4 pt-3 border-t border-slate-100/50 flex justify-between items-center">
            <span className={`text-xs font-medium text-${color}-700`}>
              {/* Already localized */}
              {title}
            </span>
            <FaChevronRight className={`text-${color}-600 text-xs`} />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
