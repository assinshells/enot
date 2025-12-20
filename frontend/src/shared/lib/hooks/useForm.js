/**
 * Універсальний хук для роботи з формами
 * Зменшує дублювання коду у формах
 */
import { useState, useCallback, useMemo } from "react";
import { useApiError } from "./useApiError";

export const useForm = (initialValues = {}, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const { error, setError, clearError } = useApiError();

  // Зміна значення поля
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Встановлення значення поля програмно
  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Позначити поле як доторкнуте
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  // Валідація полів
  const errors = useMemo(() => {
    if (!validate) return {};
    return validate(values);
  }, [values, validate]);

  // Чи є помилки валідації
  const hasValidationErrors = useMemo(
    () => Object.keys(errors).length > 0,
    [errors]
  );

  // Відображувані помилки (тільки для доторкнутих полів)
  const displayErrors = useMemo(() => {
    const display = {};
    Object.keys(errors).forEach((key) => {
      if (touched[key]) {
        display[key] = errors[key];
      }
    });
    return display;
  }, [errors, touched]);

  // Обробка відправки форми
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      clearError();

      // Позначити всі поля як доторкнуті
      const allTouched = {};
      Object.keys(values).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      // Перевірка валідації
      if (hasValidationErrors) {
        setError("Пожалуйста, исправьте ошибки в форме");
        return;
      }

      setLoading(true);

      try {
        await onSubmit(values);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [values, hasValidationErrors, onSubmit, clearError, setError]
  );

  // Скидання форми
  const reset = useCallback(() => {
    setValues(initialValues);
    setTouched({});
    clearError();
    setLoading(false);
  }, [initialValues, clearError]);

  return {
    values,
    errors: displayErrors,
    touched,
    loading,
    error,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setError,
    clearError,
    reset,
    hasErrors: hasValidationErrors,
  };
};
