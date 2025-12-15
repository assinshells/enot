import { useState, useEffect, useCallback, useRef } from "react";
import { chatApi } from "@/entities/chat/api/chatApi";
import { socketLib } from "@/shared/lib/socket/socket";
import { roomUtils } from "@/shared/lib/utils/roomUtils";
import { ROOM_NAMES } from "@/shared/config/rooms";

export const useChat = () => {
  const [currentRoom, setCurrentRoom] = useState(roomUtils.getInitialRoom);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [counts, setCounts] = useState({});

  const abortControllerRef = useRef(null);
  const isInitializedRef = useRef(false);
  const isChangingRoomRef = useRef(false);

  useEffect(() => {
    roomUtils.clearRoom();
  }, []);

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
  }, []);

  const changeRoom = useCallback(
    (newRoom) => {
      if (newRoom === currentRoom || !ROOM_NAMES.includes(newRoom)) {
        return;
      }

      if (isChangingRoomRef.current) {
        console.warn("Room change already in progress");
        return;
      }

      const socket = socketLib.getSocket();
      if (!socket || !socket.connected) {
        console.error("Socket not connected");
        return;
      }

      isChangingRoomRef.current = true;
      setLoading(true);
      setMessages([]);

      // Сначала выходим из текущей комнаты
      socket.emit("room:leave");

      // Затем меняем состояние и входим в новую
      setTimeout(() => {
        setCurrentRoom(newRoom);
        socket.emit("room:join", { room: newRoom });
      }, 50);
    },
    [currentRoom]
  );

  const sendMessage = useCallback(
    async (text) => {
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
        await chatApi.sendMessage(trimmedText, currentRoom);
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

  useEffect(() => {
    const socket = socketLib.getSocket();
    if (!socket) return;

    const handleConnect = () => {
      console.log("✅ Socket connected");
      setIsConnected(true);

      if (!isChangingRoomRef.current) {
        socket.emit("room:join", { room: currentRoom });
      }
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
      isInitializedRef.current = false;
    };

    const handleRoomJoined = ({ room, counts }) => {
      console.log(`✅ Joined room: ${room}`);
      setCounts(counts);
      isChangingRoomRef.current = false;

      // Загружаем сообщения для комнаты, в которую вошли
      loadMessages(room);
      isInitializedRef.current = true;
    };

    const handleRoomLeft = () => {
      console.log(`❌ Left current room`);
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
      if (message.room !== currentRoom) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const handleError = (error) => {
      console.error("Socket.IO ошибка:", error);
      setError(error.message);
      isChangingRoomRef.current = false;
      setLoading(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("room:joined", handleRoomJoined);
    socket.on("room:left", handleRoomLeft);
    socket.on("room:list", handleRoomList);
    socket.on("room:counts", handleRoomCounts);
    socket.on("message:new", handleNewMessage);
    socket.on("error", handleError);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("room:joined", handleRoomJoined);
      socket.off("room:left", handleRoomLeft);
      socket.off("room:list", handleRoomList);
      socket.off("room:counts", handleRoomCounts);
      socket.off("message:new", handleNewMessage);
      socket.off("error", handleError);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
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
    availableRooms: ROOM_NAMES,
    sendMessage,
    changeRoom,
  };
};
