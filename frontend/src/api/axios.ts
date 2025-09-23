import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
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
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Reject if not 401 or retry limit exceeded
    return Promise.reject(error);
  }
);
