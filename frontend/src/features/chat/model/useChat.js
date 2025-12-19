import { useState, useEffect, useCallback, useRef } from "react";
import { chatApi } from "@/entities/chat/api/chatApi";
import { useSocketEvent } from "@/shared/lib/hooks";

export const useChat = (currentRoom) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);
  const messageIdsRef = useRef(new Set());

  const loadMessages = useCallback(async (room) => {
    if (!room) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);
      setError(null);
      messageIdsRef.current.clear();

      const response = await chatApi.getMessages(room, {
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        const msgs = response.data || [];
        msgs.forEach((msg) => messageIdsRef.current.add(msg._id));
        setMessages(msgs);
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

  useSocketEvent(
    "room:joined",
    useCallback(
      ({ room }) => {
        loadMessages(room);
      },
      [loadMessages]
    )
  );

  useSocketEvent(
    "message:new",
    useCallback(
      (message) => {
        if (message.room !== currentRoom) return;
        if (messageIdsRef.current.has(message._id)) return;

        messageIdsRef.current.add(message._id);
        setMessages((prev) => [...prev, message]);
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

  useEffect(() => {
    if (currentRoom) {
      loadMessages(currentRoom);
    }
  }, [currentRoom, loadMessages]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
  };
};
