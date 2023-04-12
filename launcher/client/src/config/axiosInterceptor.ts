import axios from 'axios';
import { useAuth } from 'src/hooks/auth';

// Create a new Axios instance with the desired defaults
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_JOB_LAUNCHER_SERVER_URL,
});

// Add an interceptor for requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('cmatoken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Add an interceptor for responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const { logout } = useAuth();
    // If the error is a 401 and the original request hasn't already been retried
    if (error.response.status === 401 && !originalRequest._retry) {
      //   originalRequest._retry = true;
      logout();
      //   localStorage.removeItem('cmatoken');
      window.location.replace('/');
      //   try {
      //     // Attempt to renew the token
      //     const response = await axios.post(
      //       `${process.env.REACT_APP_API_URL}/auth/refresh`,
      //       {
      //         token: localStorage.getItem('token'),
      //       }
      //     );

      //     const { token } = response.data;
      //     localStorage.setItem('token', token);

      //     // Update the Authorization header and retry the original request
      //     axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      //     originalRequest.headers.Authorization = `Bearer ${token}`;
      //     return axiosInstance(originalRequest);
      //   } catch (err) {
      //     // If refreshing the token fails, log the user out
      //     localStorage.removeItem('token');
      //     window.location.replace('/login');
      //   }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
