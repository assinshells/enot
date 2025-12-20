/**
 * Централізований хук для обробки API помилок
 * Замінює дублювання в useFormError
 */
import { useState, useCallback, useMemo } from "react";

export const useApiError = (initialError = "") => {
  const [error, setErrorState] = useState(initialError);

  const setError = useCallback((err) => {
    if (!err) {
      setErrorState("");
      return;
    }

    // Обробка різних типів помилок
    let message = "";

    if (typeof err === "string") {
      message = err;
    } else if (err.response?.data?.message) {
      message = err.response.data.message;
    } else if (err.message) {
      message = err.message;
    } else if (err.response?.data?.errors) {
      message = Array.isArray(err.response.data.errors)
        ? err.response.data.errors.join(", ")
        : err.response.data.errors;
    } else {
      message = "Произошла ошибка";
    }

    setErrorState(message);
  }, []);

  const clearError = useCallback(() => {
    setErrorState("");
  }, []);

  const hasError = useMemo(() => Boolean(error), [error]);

  return {
    error,
    setError,
    clearError,
    hasError,
  };
};
