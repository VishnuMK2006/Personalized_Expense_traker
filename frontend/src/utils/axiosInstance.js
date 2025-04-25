import axios from "axios";
import { BASE_URL } from "./apiPaths";
import toast from "react-hot-toast";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
});

// Add authentication token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response and errors
axiosInstance.interceptors.response.use(
  // Handle successful responses
  (response) => {
    return response;
  },
  
  // Handle errors
  (error) => {
    // No response from server (network error)
    if (!error.response) {
      toast.error("Network Error: Could not connect to the server");
      return Promise.reject(error);
    }
    
    // Get status code and response data
    const { status, data } = error.response;
    
    // Handle different status codes
    switch (status) {
      case 400:
        // Bad request
        toast.error(data.message || "Bad request");
        break;
        
      case 401:
        // Unauthorized
        toast.error("Your session has expired. Please log in again");
        localStorage.removeItem("token");
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }
        break;
        
      case 403:
        // Forbidden
        toast.error("You don't have permission to access this resource");
        break;
        
      case 404:
        // Not found
        toast.error("The requested resource was not found");
        break;
        
      case 500:
        // Server error
        toast.error("Server error. Please try again later");
        break;
        
      default:
        // Other errors
        toast.error(data.message || "An unexpected error occurred");
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
