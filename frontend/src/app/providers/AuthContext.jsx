/**
 * App: Auth Provider
 * Путь: src/app/providers/AuthProvider.jsx
 */
import { createContext, useState, useEffect } from "react";
import { tokenLib } from "@/shared/lib/token/token";
import { authApi, userApi } from "@/entities/user";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      if (tokenLib.has()) {
        try {
          const response = await userApi.getProfile();
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          tokenLib.remove();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Регистрация
  const registerUser = async (data) => {
    try {
      const response = await authApi.register(data);
      tokenLib.set(response.data.token);
      setUser(response.data);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Авторизация
  const loginUser = async (data) => {
    try {
      const response = await authApi.login(data);
      tokenLib.set(response.data.token);
      setUser(response.data);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Выход
  const logout = () => {
    tokenLib.remove();
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
