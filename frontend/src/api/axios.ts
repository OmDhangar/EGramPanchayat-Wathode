import axios from 'axios';
import toast from 'react-hot-toast';

export const api = axios.create({
  baseURL: "http://localhost:8000/api", //https://api.grampanchayatwathode.com/api
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 80000,
});

// Global refresh retry counter
let refreshRetryCount = 0;

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Show success toast for successful submissions (201 status)
    if ((response.status === 200 || response.status === 201) && response.config.method === 'post') {
      const successMessage = response.data?.message || 'Operation completed successfully';
      toast.success(successMessage);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Token refresh logic
    if (
      (error.response?.status === 401 || error.response?.status === 400) &&
      !originalRequest._retry &&
      refreshRetryCount < 3
    ) {
      originalRequest._retry = true;
      refreshRetryCount += 1;

      try {
        // Refresh token call using cookies (no body required)
        const response = await api.post(
          '/users/refresh-token',
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);

        // Reset retry counter on successful refresh
        refreshRetryCount = 0;

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // Clear tokens and redirect on failure
        refreshRetryCount = 0;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Global error toast handling for all other errors
    if (error.response) {
      // Extract error message from backend's ApiResponse structure
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        `Error: ${error.response.status} - ${error.response.statusText}`;
      
      // Show error toast (skip for 401 as it's handled above)
      if (error.response.status !== 401 || error.response.status !== 400) {
        toast.error(errorMessage);
      }
    } else if (error.request) {
      // Network error - no response received
      toast.error('Network error. Please check your internet connection.');
    } else {
      // Something else happened
      toast.error(error.message || 'An unexpected error occurred');
    }

    // Reject if not 401 or retry limit exceeded
    return Promise.reject(error);
  }
);
