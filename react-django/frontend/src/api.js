import axios from "axios"; // import axios library to make HTTP requests
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // set base URL for API requests
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN); // get access token from local storage
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // if token exists, add it to authorization headers
    }

    return config; // return modified configurations
  },

  // if an error occurs during the request, reject the promise
  (error) => {
    return Promise.reject(error);
  }
);

export default api;