import axios from 'axios';
import toast from 'react-hot-toast';

// Single shared axios instance. Requests stay relative until VITE_API_URL is set.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const rawToken = localStorage.getItem('auth_token');
  if (rawToken) {
    try {
      const parsed = JSON.parse(rawToken);
      if (parsed?.accessToken) {
        if (!config.headers) {
          config.headers = {} as typeof config.headers;
        }
        (config.headers as Record<string, string>).Authorization = `Bearer ${parsed.accessToken}`;
      }
    } catch {
      // ignore malformed token
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong while talking to the server.';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default apiClient;
