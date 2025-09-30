import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Context/authContext';
import { api } from '../api/axios';
import { Helmet } from 'react-helmet';

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
      const { accessToken, user, refreshToken } = response.data.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

      setUser(user);
      setIsAuthenticated(true);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('लॉगिन अयशस्वी:', error.response?.data || error.message);
      alert('लॉगिन अयशस्वी. कृपया आपली माहिती तपासा आणि पुन्हा प्रयत्न करा.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users/forgot-password', { email: resetEmail });
      setMessage('रीसेट लिंक आपल्या ई-मेलवर पाठवली आहे.');
    } catch (err) {
      setMessage('रीसेट लिंक पाठवताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Helmet>
        <title>लॉगिन - ग्रामपंचायत वाठोडे</title>
        <meta
          name="description"
          content="ग्रामपंचायत वाठोडे वेबसाइटवर लॉगिन करा. प्रमाणपत्र अर्ज, योजना आणि इतर सेवांमध्ये प्रवेश मिळवा."
        />
      </Helmet>
      <motion.div
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-semibold text-indigo-600 mb-2">
          {isForgotMode ? 'पासवर्ड विसरलात?' : 'लॉगिन'}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isForgotMode
            ? 'रीसेट लिंक मिळवण्यासाठी आपला ई-मेल टाका.'
            : 'आता लॉगिन करा आणि आमच्या सर्व सेवांचा लाभ घ्या.'}
        </p>

        {isForgotMode ? (
          <form onSubmit={handleForgotPassword}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="आपला ई-मेल टाका"
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
              रीसेट लिंक पाठवा
            </motion.button>

            {message && <p className="text-green-600 text-sm text-center mt-3">{message}</p>}

            <p className="text-sm text-gray-600 text-center mt-4">
              पासवर्ड लक्षात आला का?{' '}
              <span
                onClick={() => setIsForgotMode(false)}
                className="text-indigo-600 hover:underline cursor-pointer"
              >
                परत लॉगिनवर जा
              </span>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="ई-मेल"
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
                placeholder="पासवर्ड"
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
                पासवर्ड विसरलात?
              </span>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              सबमिट करा
            </motion.button>
          </form>
        )}

        {!isForgotMode && (
          <p className="text-sm text-center text-gray-600 mt-6">
            खाते नाहीये का?{' '}
            <a href="/register" className="text-indigo-600 hover:underline">
              नोंदणी करा
            </a>
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default Login;
