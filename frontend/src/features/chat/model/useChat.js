import { useState, useEffect, useCallback, useRef } from "react";
import { chatApi } from "@/entities/chat/api/chatApi";
import {
  useSocketEvent,
  useSocketConnection,
  useSocketEmit,
} from "@/shared/lib/hooks/useSocket";
import { useSessionStorage } from "@/shared/lib/hooks/useSessionStorage";
import { ROOM_NAMES, DEFAULT_ROOM } from "@/shared/config/rooms";

export const useChat = () => {
  const [currentRoom, setCurrentRoom] = useSessionStorage(
    "currentRoom",
    DEFAULT_ROOM
  );
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [counts, setCounts] = useState({});

  const isConnected = useSocketConnection();
  const emit = useSocketEmit();
  const abortControllerRef = useRef(null);

  // Загрузка сообщений (стабильная функция)
  const loadMessages = useCallback(async (room) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);

      const response = await chatApi.getMessages(room, {
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setMessages(response.data || []);
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") {
        return;
      }

      if (!controller.signal.aborted) {
        console.error("Error loading messages:", err);
        setError(err.message);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []); // Нет зависимостей - функция стабильна

  // Смена комнаты
  const changeRoom = useCallback(
    (newRoom) => {
      if (newRoom === currentRoom || !ROOM_NAMES.includes(newRoom)) {
        return;
      }

      setLoading(true);
      setMessages([]);
      emit("room:leave");

      setTimeout(() => {
        setCurrentRoom(newRoom);
        emit("room:join", { room: newRoom });
      }, 50);
    },
    [currentRoom, emit, setCurrentRoom]
  );

  // Отправка сообщения
  const sendMessage = useCallback(
    async (text, recipient = null) => {
      const trimmedText = text.trim();

      if (!trimmedText) {
        throw new Error("Сообщение не может быть пустым");
      }

      if (trimmedText.length > 1000) {
        throw new Error("Сообщение слишком длинное (макс. 1000 символов)");
      }

      try {
        setSending(true);
        setError(null);
        await chatApi.sendMessage(trimmedText, currentRoom, recipient);
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

  // Socket.IO обработчики
  useSocketEvent(
    "room:joined",
    useCallback(
      ({ room, counts: newCounts }) => {
        console.log(`✅ Joined room: ${room}`);
        setCounts(newCounts);
        loadMessages(room);
      },
      [loadMessages]
    )
  );

  useSocketEvent(
    "room:list",
    useCallback((data) => {
      setRooms(data);
      const newCounts = {};
      data.forEach((r) => (newCounts[r.name] = r.count));
      setCounts(newCounts);
    }, [])
  );

  useSocketEvent("room:counts", setCounts);

  useSocketEvent(
    "message:new",
    useCallback(
      (message) => {
        if (message.room !== currentRoom) return;

        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      },
      [currentRoom]
    )
  );

  useSocketEvent(
    "error",
    useCallback((err) => {
      console.error("Socket.IO ошибка:", err);
      setError(err.message);
      setLoading(false);
    }, [])
  );

  // Подключение к комнате при старте
  useEffect(() => {
    if (isConnected && ROOM_NAMES.includes(currentRoom)) {
      emit("room:join", { room: currentRoom });
    }
  }, [isConnected, currentRoom, emit]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    currentRoom,
    messages,
    loading,
    sending,
    error,
    isConnected,
    rooms,
    counts,
    availableRooms: ROOM_NAMES,
    sendMessage,
    changeRoom,
  };
};
