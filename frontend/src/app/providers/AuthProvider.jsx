/**
 * App: Auth Provider (ИСПРАВЛЕНО)
 * Путь: src/app/providers/AuthProvider.jsx
 */
import { createContext, useState, useEffect, useMemo } from "react";
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
      const token = tokenLib.get();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await userApi.getProfile();
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        tokenLib.remove();
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Регистрация
  const registerUser = async (data) => {
    try {
      const response = await authApi.register(data);
      const { token, ...userData } = response.data;
      tokenLib.set(token);
      setUser(userData);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // Авторизация
  const loginUser = async (data) => {
    try {
      const response = await authApi.login(data);
      const { token, ...userData } = response.data;
      tokenLib.set(token);
      setUser(userData);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Выход
  const logout = () => {
    tokenLib.remove();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Мемоизация значения контекста
  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      registerUser,
      loginUser,
      logout,
      setUser, // Добавлено для использования в других компонентах
    }),
    [user, loading, isAuthenticated]
  );

  // ✅ КРИТИЧНО: возвращаем Provider с value
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
