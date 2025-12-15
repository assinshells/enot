import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { Spinner } from "@/shared/ui";
import {
  LoginPage,
  EmailConfirmationPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  ChatPage,
} from "@/pages";

/**
 * Защищенный маршрут
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Spinner fullScreen />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

/**
 * Публичный маршрут
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Spinner fullScreen />;
  }

  return !isAuthenticated ? children : <Navigate to="/" />;
};

/**
 * Роутер приложения
 */
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Защищенные маршруты */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />

        {/* Публичные маршруты */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />

        {/* Перенаправление */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};
