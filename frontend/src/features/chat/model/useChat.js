/**
 * Feature: useChat Hook
 * Путь: src/features/chat/model/useChat.js
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { chatApi } from "@/entities/chat/api/chatApi";
import { socketLib } from "@/shared/lib/socket/socket";

export const useChat = () => {
  // ✅ Читаем начальную комнату из sessionStorage (установлена при логине/регистрации)
  const initialRoom = sessionStorage.getItem("initialRoom") || "Главная";

  const [currentRoom, setCurrentRoom] = useState(initialRoom);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // ✅ НОВОЕ: Список комнат и счётчики
  const [rooms, setRooms] = useState([]);
  const [counts, setCounts] = useState({});

  // ✅ Ref для отмены запросов
  const abortControllerRef = useRef(null);

  // ✅ Очищаем sessionStorage после первого использования
  useEffect(() => {
    sessionStorage.removeItem("initialRoom");
  }, []);

  /**
   * Загрузить историю комнаты
   */
  const loadMessages = useCallback(async (room) => {
    // ✅ Отменяем предыдущий запрос
    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const response = await chatApi.getMessages(room, {
        signal: controller.signal,
      });

      // ✅ Проверяем, что запрос не отменён
      if (!controller.signal.aborted) {
        setMessages(response.data || []);
      }
    } catch (err) {
      if (err.name === "AbortError") return; // Игнорируем отменённые
      console.error("Ошибка загрузки сообщений:", err);
      setError(err.message);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Сменить комнату
   */
  const changeRoom = useCallback(
    (newRoom) => {
      if (newRoom === currentRoom) return;

      const socket = socketLib.getSocket();
      if (!socket) return;

      // ✅ Выход из старой комнаты
      socket.emit("room:leave");

      // ✅ Вход в новую комнату
      socket.emit("room:join", { room: newRoom });

      setCurrentRoom(newRoom);
      setMessages([]); // ✅ Очищаем старые сообщения
      loadMessages(newRoom);
    },
    [currentRoom, loadMessages]
  );

  /**
   * Отправить сообщение
   */
  const sendMessage = useCallback(
    async (text) => {
      if (!text || text.trim().length === 0) {
        throw new Error("Сообщение не может быть пустым");
      }

      if (text.trim().length > 1000) {
        throw new Error("Сообщение слишком длинное (макс. 1000 символов)");
      }

      try {
        setSending(true);
        setError(null);
        await chatApi.sendMessage(text.trim(), currentRoom);
      } catch (err) {
        console.error("Ошибка отправки сообщения:", err);
        setError(err.message);
        throw err;
      } finally {
        setSending(false);
      }
    },
    [currentRoom]
  );

  // ========== SOCKET LISTENERS ==========

  useEffect(() => {
    const socket = socketLib.getSocket();
    if (!socket) return;

    const handleConnect = () => {
      console.log("✅ Socket.IO подключен");
      setIsConnected(true);

      // ✅ Автоматически входим в комнату по умолчанию
      socket.emit("room:join", { room: currentRoom });
    };

    const handleDisconnect = () => {
      console.log("❌ Socket.IO отключен");
      setIsConnected(false);
    };

    const handleRoomJoined = ({ room, counts }) => {
      console.log(`✅ Присоединились к комнате "${room}"`, counts);
      setCounts(counts);
      loadMessages(room);
    };

    const handleRoomList = (data) => {
      setRooms(data);
      const newCounts = {};
      data.forEach((r) => (newCounts[r.name] = r.count));
      setCounts(newCounts);
    };

    const handleRoomCounts = (data) => {
      setCounts(data);
    };

    const handleNewMessage = (message) => {
      // ✅ Принимаем сообщения ТОЛЬКО из текущей комнаты
      if (message.room !== currentRoom) return;

      setMessages((prev) => {
        // ✅ Предотвращаем дублирование
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const handleError = (error) => {
      console.error("Socket.IO ошибка:", error);
      setError(error.message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("room:joined", handleRoomJoined);
    socket.on("room:list", handleRoomList);
    socket.on("room:counts", handleRoomCounts);
    socket.on("message:new", handleNewMessage);
    socket.on("error", handleError);

    // ✅ Если уже подключены, входим в комнату
    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("room:joined", handleRoomJoined);
      socket.off("room:list", handleRoomList);
      socket.off("room:counts", handleRoomCounts);
      socket.off("message:new", handleNewMessage);
      socket.off("error", handleError);
    };
  }, [currentRoom, loadMessages]);

  return {
    currentRoom,
    messages,
    loading,
    sending,
    error,
    isConnected,
    rooms,
    counts,
    sendMessage,
    changeRoom,
  };
};
