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
  const roomChangeTimeoutRef = useRef(null);

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

      const socket = socketLib.getSocket();
      if (!socket?.connected) {
        console.error("Socket not connected");
        return;
      }

      if (roomChangeTimeoutRef.current) {
        clearTimeout(roomChangeTimeoutRef.current);
      }

      setLoading(true);
      setMessages([]);

      socket.emit("room:leave");

      roomChangeTimeoutRef.current = setTimeout(() => {
        setCurrentRoom(newRoom);
        socket.emit("room:join", { room: newRoom });
        roomChangeTimeoutRef.current = null;
      }, 50);
    },
    [currentRoom]
  );

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

  useEffect(() => {
    const socket = socketLib.getSocket();
    if (!socket) return;

    const handleConnect = () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
      socket.emit("room:join", { room: currentRoom });
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    };

    const handleRoomJoined = ({ room, counts: newCounts }) => {
      console.log(`✅ Joined room: ${room}`);
      setCounts(newCounts);
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
      if (message.room !== currentRoom) return;

      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const handleError = (err) => {
      console.error("Socket.IO ошибка:", err);
      setError(err.message);
      setLoading(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("room:joined", handleRoomJoined);
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
      socket.off("room:list", handleRoomList);
      socket.off("room:counts", handleRoomCounts);
      socket.off("message:new", handleNewMessage);
      socket.off("error", handleError);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      if (roomChangeTimeoutRef.current) {
        clearTimeout(roomChangeTimeoutRef.current);
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
