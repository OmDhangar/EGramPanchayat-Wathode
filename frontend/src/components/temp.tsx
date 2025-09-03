import React from "react";
import { Link, Navigate } from "react-router-dom";
import {
  FaUserShield,
  FaUser,
  FaCertificate,
  FaBell,
  FaUsers,
  FaUpload,
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "../Context/authContext";

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring" } },
  exit: { opacity: 0, y: 30, scale: 0.97, transition: { duration: 0.3 } },
};

export default function Dashboard() {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-0 md:p-6">
      {/* Header section remains the same */}
      <div className="w-full bg-gradient-to-r from-blue-700 to-green-600 py-6 px-4 shadow-lg flex flex-col md:flex-row items-center justify-between">
        {/* ...existing header code... */}
      </div>

      <div className="max-w-4xl mx-auto mt-8">
        {/* Profile Card */}
        <motion.div
          className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg p-6 mb-10 gap-6"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="relative">
            <motion.div
              className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center"
              whileHover={{ scale: 1.08, rotate: 2 }}
            >
              {user.role === 'admin' ? 
                <FaUserShield className="text-4xl text-green-600" /> :
                <FaUser className="text-4xl text-blue-600" />
              }
            </motion.div>
            <span
              className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
                user.role === "admin" ? "bg-green-500" : "bg-blue-500"
              }`}
              title={user.role === "admin" ? "Admin" : "Client"}
            />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-1">
              {user.role === "admin" ? "Admin Dashboard" : "Citizen Dashboard"}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-700">
              <span className="font-semibold flex items-center gap-1">
                {user.role === "admin" ? <FaUserShield /> : <FaUser />}
                {user.fullName}
              </span>
              <span className="text-gray-600">{user.email}</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-mono tracking-wider">
                ID: {user.id}
              </span>
            </div>
            <p className="mt-2 text-gray-500">
              Welcome, {user.fullName}!{" "}
              {user.role === "admin"
                ? "Manage certificates, users, and approvals below."
                : "Access your certificates and apply for new ones easily."}
            </p>
          </div>
        </motion.div>

        {/* Service Cards */}
        <AnimatePresence>
          {user.role === "client" ? (
            <motion.div
              className="mb-10"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-500" /> User Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  to="/user/certificates"
                  className="bg-white p-6 rounded-2xl shadow hover:bg-green-50 transition-all duration-300 hover:scale-105 flex flex-col items-center"
                >
                  <FaCertificate className="text-3xl text-blue-600 mb-2" />
                  <h3 className="text-lg font-bold mb-1 text-green-700">View Certificates</h3>
                  <p className="text-center text-gray-600 text-sm">
                    Access and download your certificates.
                  </p>
                </Link>
                {/* Add other user service cards */}
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUserShield className="text-green-600" /> Admin Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                  to="/admin/users"
                  className="bg-white p-6 rounded-2xl shadow hover:bg-yellow-50 transition-all duration-300 hover:scale-105 flex flex-col items-center"
                >
                  <FaUsers className="text-3xl text-yellow-600 mb-2" />
                  <h3 className="text-lg font-bold mb-1 text-yellow-700">Manage Users</h3>
                  <p className="text-center text-gray-600 text-sm">
                    View and manage user requests.
                  </p>
                </Link>
                {/* Add other admin service cards */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}