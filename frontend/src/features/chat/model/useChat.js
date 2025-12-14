import { useState, useEffect, useCallback, useRef } from "react";
import { chatApi } from "@/entities/chat/api/chatApi";
import { socketLib } from "@/shared/lib/socket/socket";
import { ROOM_NAMES, DEFAULT_ROOM, isValidRoom } from "@/shared/config/rooms";

export const useChat = () => {
  const getInitialRoom = () => {
    const stored = sessionStorage.getItem("initialRoom");
    return stored && isValidRoom(stored) ? stored : DEFAULT_ROOM;
  };

  const [currentRoom, setCurrentRoom] = useState(getInitialRoom);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [counts, setCounts] = useState({});

  const abortControllerRef = useRef(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    sessionStorage.removeItem("initialRoom");
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
        setLoading(false);
      }
    } catch (err) {
      if (err.name === "CanceledError" || err.name === "AbortError") {
        return;
      }

      if (!controller.signal.aborted) {
        console.error("Error loading messages:", err);
        setError(err.message);
        setLoading(false);
      }
    }
  }, []);

  const changeRoom = useCallback(
    (newRoom) => {
      if (newRoom === currentRoom || !isValidRoom(newRoom)) return;

      const socket = socketLib.getSocket();
      if (!socket) return;

      setLoading(true);
      let handled = false;

      const handleLeft = () => {
        if (handled) return;
        handled = true;
        setMessages([]);
        setCurrentRoom(newRoom);
        socket.emit("room:join", { room: newRoom });
        socket.off("room:left", handleLeft);
      };

      socket.emit("room:leave");
      socket.once("room:left", handleLeft);

      setTimeout(() => {
        if (!handled) {
          console.warn("Server didn't respond, forcing room change");
          handleLeft();
        }
      }, 3000);
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
      setIsConnected(true);
      socket.emit("room:join", { room: currentRoom });
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleRoomJoined = ({ room, counts }) => {
      setCounts(counts);

      if (!isInitializedRef.current) {
        loadMessages(room);
        isInitializedRef.current = true;
      }
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
