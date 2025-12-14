/**
 * App: Auth Provider
 * Путь: src/app/providers/AuthProvider.jsx
 */
import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { tokenLib } from "@/shared/lib/token/token";
import { socketLib } from "@/shared/lib/socket/socket";
import { authApi, userApi } from "@/entities/user";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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

  useEffect(() => {
    if (isAuthenticated && tokenLib.get()) {
      socketLib.connect();
    }

    return () => {
      if (!isAuthenticated) {
        socketLib.disconnect();
      }
    };
  }, [isAuthenticated]);

  // Регистрация
  const registerUser = useCallback(async (data) => {
    try {
      const response = await authApi.register(data);
      const { token, ...userData } = response.data;
      tokenLib.set(token);
      setUser(userData);
      setIsAuthenticated(true);

      // Подключаемся к Socket.IO
      socketLib.connect();

      return response;
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  }, []);

  // Авторизация
  const loginUser = useCallback(async (data) => {
    try {
      const response = await authApi.login(data);
      const { token, ...userData } = response.data;
      tokenLib.set(token);
      setUser(userData);
      setIsAuthenticated(true);

      // Подключаемся к Socket.IO
      socketLib.connect();

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  // Выход
  const logout = useCallback(() => {
    tokenLib.remove();
    setUser(null);
    setIsAuthenticated(false);

    // Отключаемся от Socket.IO
    socketLib.disconnect();
  }, []);

  // Мемоизация значения контекста
  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      registerUser,
      loginUser,
      logout,
      setUser,
    }),
    [user, loading, isAuthenticated, registerUser, loginUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
