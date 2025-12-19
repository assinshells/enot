import { useState, useCallback, useMemo } from "react";

export const useFormError = () => {
  const [error, setErrorState] = useState("");

  const clearError = useCallback(() => {
    setErrorState("");
  }, []);

  const setError = useCallback((err) => {
    const message = err?.message || err || "Произошла ошибка";
    setErrorState(message);
  }, []);

  return useMemo(
    () => ({
      error,
      setError,
      clearError,
    }),
    [error, setError, clearError]
  );
};
