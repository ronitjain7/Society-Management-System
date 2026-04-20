import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add a request interceptor to include JWT token
client.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
