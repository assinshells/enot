import { createContext, useState, useEffect } from 'react';
import { setToken, removeToken, hasToken } from '../utils/token';
import * as authApi from '../api/authApi';
import * as userApi from '../api/userApi';

/**
 * Контекст авторизации
 */
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      if (hasToken()) {
        try {
          const response = await userApi.getProfile();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          removeToken();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Регистрация
  const registerUser = async (data) => {
    const response = await authApi.register(data);
    setToken(response.data.token);
    setUser(response.data);
    setIsAuthenticated(true);
    return response;
  };

  // Авторизация
  const loginUser = async (data) => {
    const response = await authApi.login(data);
    setToken(response.data.token);
    setUser(response.data);
    setIsAuthenticated(true);
    return response;
  };

  // Выход
  const logout = () => {
    removeToken();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        registerUser,
        loginUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};