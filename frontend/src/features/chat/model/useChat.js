/**
 * Feature: useChat Hook
 * Путь: src/features/chat/model/useChat.js
 */
import { useState, useEffect, useCallback } from "react";
import { chatApi } from "@/entities/chat/api/chatApi";
import { socketLib } from "@/shared/lib/socket/socket";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Загрузка сообщений
  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chatApi.getMessages();
      setMessages(response.data || []);
    } catch (err) {
      console.error("Ошибка загрузки сообщений:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Отправка сообщения
  const sendMessage = useCallback(async (text) => {
    try {
      setSending(true);
      setError(null);
      await chatApi.sendMessage(text);
    } catch (err) {
      console.error("Ошибка отправки сообщения:", err);
      setError(err.message);
      throw err;
    } finally {
      setSending(false);
    }
  }, []);

  // Подписка на новые сообщения через Socket.IO
  useEffect(() => {
    // Подключаемся к Socket.IO
    const socket = socketLib.connect();

    if (socket) {
      // Обработчик новых сообщений
      const handleNewMessage = (message) => {
        console.log("Новое сообщение:", message);
        setMessages((prev) => [...prev, message]);
      };

      socketLib.on("message:new", handleNewMessage);

      // Очистка при размонтировании
      return () => {
        socketLib.off("message:new", handleNewMessage);
      };
    }
  }, []);

  // Загрузка сообщений при монтировании
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    loadMessages,
  };
};
