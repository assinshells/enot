import axios from 'axios';
import { getToken, removeToken } from './token';

/**
 * Настроенный axios instance для API запросов
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor для добавления токена к запросам
request.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor для обработки ответов
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Обработка ошибок авторизации
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || error.message || 'Произошла ошибка';
    return Promise.reject(new Error(message));
  }
);

export default request;