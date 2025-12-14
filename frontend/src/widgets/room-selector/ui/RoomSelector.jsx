// frontend/src/widgets/room-selector/ui/RoomSelector.jsx
import { useState, useEffect } from "react";
import { socketLib } from "@/shared/lib/socket/socket";
import "./RoomSelector.css";

export const RoomSelector = ({ currentRoom, onRoomChange }) => {
  const [rooms, setRooms] = useState([]);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const socket = socketLib.getSocket();
    if (!socket) return;

    // Запрашиваем список комнат
    socket.emit("room:list");

    // Слушаем обновления списка
    socket.on("room:list", (data) => {
      setRooms(data);
      const newCounts = {};
      data.forEach((r) => (newCounts[r.name] = r.count));
      setCounts(newCounts);
    });

    // Слушаем обновления счётчиков
    socket.on("room:counts", (data) => {
      setCounts(data);
    });

    return () => {
      socket.off("room:list");
      socket.off("room:counts");
    };
  }, []);

  const handleRoomClick = (roomName) => {
    if (roomName === currentRoom) return;
    onRoomChange(roomName);
  };

  return (
    <div className="room-selector">
      <h6 className="px-3 py-2 text-muted border-bottom">Комнаты</h6>
      <ul className="list-group list-group-flush">
        {rooms.map((room) => (
          <li
            key={room.name}
            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
              currentRoom === room.name ? "active" : ""
            }`}
            onClick={() => handleRoomClick(room.name)}
            style={{ cursor: "pointer" }}
          >
            <span>
              <i className="bi bi-chat-dots me-2"></i>
              {room.name}
            </span>
            <span className="badge bg-primary rounded-pill">
              {counts[room.name] || 0}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
