import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true, // Include cookies for cross-origin requests
});