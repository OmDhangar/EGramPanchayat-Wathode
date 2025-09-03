import React, { useState } from "react";
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../Context/authContext";
import { api } from "../api/axios";

const Login = () => {
  const [isActive, setIsActive] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [resetEmail, setResetEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuthContext();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login", form);
      const { accessToken, user, refreshToken } = response.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("refreshToken", JSON.stringify(refreshToken));

      setUser(user);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  // Forgot password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/users/forgot-password", { email: resetEmail });
      setMessage("Reset link sent to your email.");
    } catch {
      setMessage("Error sending reset link. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#e2e2e2] to-[#c9d6ff] p-4">
      <div
        className={`bg-white rounded-3xl shadow-lg relative overflow-hidden w-full max-w-4xl min-h-[480px] transition-all duration-[700ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
          isActive ? "active" : ""
        }`}
      >
        {/* Sign Up Form */}
        <div
          className={`absolute top-0 h-full w-1/2 transition-all duration-[700ms] ease-[cubic-bezier(0.77,0,0.175,1)] left-0 opacity-0 z-[1] ${
            isActive ? "translate-x-full opacity-100 z-[5]" : ""
          }`}
        >
          <form className="bg-white flex flex-col items-center justify-center h-full px-10">
            <h1 className="text-2xl font-bold mb-4">Create Account</h1>
            <div className="flex my-5">
              {[FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="border border-gray-300 rounded-full inline-flex justify-center items-center mx-1 w-10 h-10 hover:bg-[#fd6900] hover:text-white transition-colors"
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
            <span className="text-sm my-2">
              or use your email for registration
            </span>
            <input
              type="text"
              placeholder="Name"
              className="bg-gray-100 my-2 py-3 px-4 text-sm rounded-lg w-full outline-none font-medium"
            />
            <input
              type="email"
              placeholder="Email"
              className="bg-gray-100 my-2 py-3 px-4 text-sm rounded-lg w-full outline-none font-medium"
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-gray-100 my-2 py-3 px-4 text-sm rounded-lg w-full outline-none font-medium"
            />
            <button
              type="button"
              className="bg-[#fd6900] text-white text-xs py-3 px-11 rounded-lg font-semibold tracking-wide uppercase mt-2 cursor-pointer"
            >
              Sign Up
            </button>
          </form>
        </div>

        {/* Sign In / Forgot Password Form */}
        <div
          className={`absolute top-0 h-full w-1/2 transition-all duration-[700ms] ease-[cubic-bezier(0.77,0,0.175,1)] left-0 z-[2] ${
            isActive ? "translate-x-full" : ""
          }`}
        >
          {isForgotMode ? (
            <form
              onSubmit={handleForgotPassword}
              className="bg-white flex flex-col items-center justify-center h-full px-10"
            >
              <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
              <p className="text-sm text-gray-500 mb-4">
                Enter your email to receive a reset link.
              </p>
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="bg-gray-100 my-2 py-3 px-4 text-sm rounded-lg w-full outline-none font-medium"
              />
              <motion.button
                type="submit"
                className="bg-[#fd6900] text-white text-xs py-3 px-11 rounded-lg font-semibold tracking-wide uppercase mt-4 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Send Reset Link
              </motion.button>
              {message && (
                <p className="text-green-600 text-sm text-center mt-3">
                  {message}
                </p>
              )}
              <p
                className="text-sm text-indigo-600 hover:underline cursor-pointer mt-4"
                onClick={() => setIsForgotMode(false)}
              >
                Back to Login
              </p>
            </form>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white flex flex-col items-center justify-center h-full px-10"
            >
              <h1 className="text-2xl font-bold mb-4">Sign In</h1>
              <div className="flex my-5">
                {[FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn].map(
                  (Icon, idx) => (
                    <a
                      key={idx}
                      href="#"
                      className="border border-gray-300 rounded-full inline-flex justify-center items-center mx-1 w-10 h-10 hover:bg-[#fd6900] hover:text-white transition-colors"
                    >
                      <Icon />
                    </a>
                  )
                )}
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="bg-gray-100 my-2 py-3 px-4 text-sm rounded-lg w-full outline-none font-medium"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="bg-gray-100 my-2 py-3 px-4 text-sm rounded-lg w-full outline-none font-medium"
              />
              <p
                className="text-gray-700 text-xs mt-3 mb-2 cursor-pointer hover:underline"
                onClick={() => setIsForgotMode(true)}
              >
                Forgot Your Password?
              </p>
              <motion.button
                type="submit"
                className="bg-[#fd6900] text-white text-xs py-3 px-11 rounded-lg font-semibold tracking-wide uppercase mt-2 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign In
              </motion.button>
            </form>
          )}
        </div>

        {/* Toggle Container */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-[700ms] ease-[cubic-bezier(0.77,0,0.175,1)] rounded-l-[150px] rounded-r-none z-[1000] ${
            isActive ? "-translate-x-full rounded-l-none rounded-r-[150px]" : ""
          }`}
        >
          <div
            className={`bg-gradient-to-r from-[#3bfd00] to-[#48a82d] text-white relative -left-full h-full w-[200%] transition-all duration-[700ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
              isActive ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Left Panel */}
            <div
              className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 transition-all duration-[700ms] ease-[cubic-bezier(0.77,0,0.175,1)] -translate-x-[200%] ${
                isActive ? "translate-x-0" : ""
              }`}
            >
              <h1 className="text-2xl font-bold">Welcome back!</h1>
              <p className="text-sm leading-5 tracking-wide my-5 font-medium">
                Enter your personal details to use all of site features
              </p>
              <button
                onClick={() => setIsActive(false)}
                className="bg-transparent text-white text-xs py-3 px-11 rounded-lg border-2 border-white font-semibold tracking-wide uppercase cursor-pointer"
              >
                Sign In
              </button>
            </div>
            {/* Right Panel */}
            <div
              className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 right-0 transition-all duration-[700ms] ease-[cubic-bezier(0.77,0,0.175,1)] ${
                isActive ? "translate-x-[200%]" : "translate-x-0"
              }`}
            >
              <h1 className="text-2xl font-bold">Hello, Friends!</h1>
              <p className="text-sm leading-5 tracking-wide my-5 font-medium">
                Register with your personal details to use all of site features
              </p>
              <button
                onClick={() => setIsActive(true)}
                className="bg-transparent text-white text-xs py-3 px-11 rounded-lg border-2 border-white font-semibold tracking-wide uppercase cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
