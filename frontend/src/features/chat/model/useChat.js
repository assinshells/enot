/**
 * Feature: useChat Hook
 * Путь: src/features/chat/model/useChat.js
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { chatApi } from "@/entities/chat/api/chatApi";
import { socketLib } from "@/shared/lib/socket/socket";

export const useChat = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // ✅ Используем ref для предотвращения дублирования
  const socketRef = useRef(null);

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

  const sendMessage = useCallback(async (text) => {
    // ✅ Валидация перед отправкой
    if (!text || text.trim().length === 0) {
      throw new Error("Сообщение не может быть пустым");
    }

    if (text.trim().length > 1000) {
      throw new Error("Сообщение слишком длинное (макс. 1000 символов)");
    }

    try {
      setSending(true);
      setError(null);
      await chatApi.sendMessage(text.trim());
    } catch (err) {
      console.error("Ошибка отправки сообщения:", err);
      setError(err.message);
      throw err;
    } finally {
      setSending(false);
    }
  }, []);

  useEffect(() => {
    // ✅ Проверяем, не подключен ли уже socket
    if (socketRef.current?.connected) {
      return;
    }

    const socket = socketLib.connect();
    socketRef.current = socket;

    if (socket) {
      const handleConnect = () => {
        console.log("✅ Socket.IO подключен");
        setIsConnected(true);
      };

      const handleDisconnect = () => {
        console.log("❌ Socket.IO отключен");
        setIsConnected(false);
      };

      const handleNewMessage = (message) => {
        console.log("Новое сообщение:", message);
        setMessages((prev) => {
          // ✅ Предотвращаем дублирование
          if (prev.some((m) => m._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });
      };

      const handleError = (error) => {
        console.error("Socket.IO ошибка:", error);
        setError(error.message);
      };

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);
      socket.on("message:new", handleNewMessage);
      socket.on("error", handleError);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("message:new", handleNewMessage);
        socket.off("error", handleError);
        // ✅ НЕ отключаем socket при размонтировании компонента
        // так как он может использоваться в других местах
      };
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    loading,
    sending,
    error,
    isConnected,
    sendMessage,
    loadMessages,
  };
};
