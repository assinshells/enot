/**
 * Shared Hook: Form Error Management
 * Путь: src/shared/lib/hooks/useFormError.js
 */
import { useState, useCallback } from "react";

export const useFormError = () => {
  const [error, setError] = useState("");

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const setFormError = useCallback((err) => {
    const message = err?.message || err || "Произошла ошибка";
    setError(message);
  }, []);

  return { error, setError: setFormError, clearError };
};
