import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API base configuration
const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds for file uploads
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and auth (future use)
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    
    // Handle specific error cases
    if (error.response?.status === 400) {
      // Validation errors - pass through for component handling
      return Promise.reject(error);
    }
    
    if (error.response?.status === 500) {
      // Server errors
      console.error('Server error:', error.response.data);
      return Promise.reject(new Error('Server error occurred. Please try again.'));
    }
    
    if (error.code === 'ECONNABORTED') {
      // Timeout errors
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    
    // Network errors
    return Promise.reject(new Error('Network error. Please check your connection.'));
  }
);

export default apiClient; 