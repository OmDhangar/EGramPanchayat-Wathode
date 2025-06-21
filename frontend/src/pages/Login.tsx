import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Context/authContext';
import { api } from '../api/axios';

function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuthContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post('/users/login', form);
      const { accessToken, user } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/forgot-password', { email: resetEmail });
      setMessage('Reset link sent to your email.');
    } catch (err) {
      setMessage('Error sending reset link. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <motion.div
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold text-indigo-600 mb-2">
          {isForgotMode ? 'Forgot Password' : 'Login'}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isForgotMode
            ? 'Enter your email to receive a reset link.'
            : 'Login now and get full access to our app.'}
        </p>

        {isForgotMode ? (
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <motion.button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Reset Link
            </motion.button>

            {message && <p className="text-green-600 text-sm text-center mt-3">{message}</p>}

            <p className="text-sm text-gray-600 text-center mt-4">
              Remembered your password?{' '}
              <span
                onClick={() => setIsForgotMode(false)}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                Back to Login
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mb-2">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="text-right text-sm mb-4">
              <span
                className="text-indigo-600 hover:underline cursor-pointer"
                onClick={() => setIsForgotMode(true)}
              >
                Forgot Password?
              </span>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit
            </motion.button>
          </form>
        )}

        {!isForgotMode && (
          <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{' '}
            <a href="/register" className="text-indigo-600 hover:underline">
              Register
            </a>
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default Login;
