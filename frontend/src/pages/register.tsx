import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Context/authContext';
import { api } from '../api/axios';

const Register = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useAuthContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/users/register', form);
      if (response.status === 201) {
        setIsAuthenticated(true);
        console.log('नोंदणी यशस्वी:', response.data);
        const userData = {
          fullName: response.data.fullName,
          email: response.data.email,
          role: response.data.role,
          id: response.data._id,
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      navigate('/dashboard');
    } catch (error: any) {
      console.log('नोंदणी अयशस्वी:', error.response?.data || error.message);
      alert('नोंदणी अयशस्वी झाली. कृपया पुन्हा प्रयत्न करा.');
    }
  };

  return (
    <StyledWrapper>
      <motion.div
        className="form-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="title">नोंदणी</h1>
        <p className="subtitle">आता नोंदणी करा आणि आमच्या सर्व सेवांचा लाभ घ्या.</p>

        <form onSubmit={handleSubmit}>
          <div className="name-fields">
            <div className="input-group">
              <input
                type="text"
                name="fullName"
                placeholder="पूर्ण नाव"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="ई-मेल"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="पासवर्ड"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="पासवर्डची पुष्टी करा"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <motion.button
            className="submit-btn"
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            सबमिट करा
          </motion.button>
        </form>

        <p className="signin-link">
          आधीच खाते आहे का? <a href="/login">लॉगिन करा</a>
        </p>
      </motion.div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 20px;

  .form-container {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #4F46E5;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .subtitle {
    color: #6B7280;
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .name-fields {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .input-group {
    margin-bottom: 1rem;

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s;

      &:focus {
        border-color: #4F46E5;
      }

      &::placeholder {
        color: #9CA3AF;
      }
    }
  }

  .submit-btn {
    width: 100%;
    padding: 0.75rem;
    background: #4F46E5;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background: #4338CA;
    }
  }

  .signin-link {
    text-align: center;
    margin-top: 1.5rem;
    font-size: 0.875rem;
    color: #6B7280;

    a {
      color: #4F46E5;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export default Register;
