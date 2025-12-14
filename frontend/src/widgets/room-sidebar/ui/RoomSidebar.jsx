// frontend/src/widgets/room-sidebar/ui/RoomSidebar.jsx
import { useState, useEffect } from "react";
import { socketLib } from "@/shared/lib/socket/socket";
import "./RoomSidebar.css";

export const RoomSidebar = ({ currentRoom, onRoomChange }) => {
  const [rooms, setRooms] = useState([]);
  const [counts, setCounts] = useState({});
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const socket = socketLib.getSocket();
    if (!socket) return;

    // Запрашиваем список комнат
    socket.emit("room:list");

    // Слушаем список комнат
    socket.on("room:list", (data) => {
      setRooms(data);
      updateCounts(data);
    });

    // Слушаем обновления счётчиков
    socket.on("room:counts", (data) => {
      setCounts(data);
      calculateTotal(data);
    });

    return () => {
      socket.off("room:list");
      socket.off("room:counts");
    };
  }, []);

  const updateCounts = (roomList) => {
    const newCounts = {};
    let total = 0;
    roomList.forEach((r) => {
      newCounts[r.name] = r.count;
      total += r.count;
    });
    setCounts(newCounts);
    setTotalUsers(total);
  };

  const calculateTotal = (countData) => {
    const total = Object.values(countData).reduce(
      (sum, count) => sum + count,
      0
    );
    setTotalUsers(total);
  };

  const handleRoomClick = (roomName) => {
    if (roomName === currentRoom) return;
    onRoomChange(roomName);
  };

  return (
    <aside className="room-sidebar border-start">
      {/* Заголовок с общим счётчиком */}
      <div className="p-3 border-bottom">
        <h5 className="mb-0 d-flex align-items-center">
          <i className="bi bi-people-fill me-2 text-primary"></i>В чате:{" "}
          {totalUsers}
        </h5>
      </div>

      {/* Список комнат */}
      <div className="p-3">
        <h6 className="text-muted mb-3">Комнаты</h6>
        <ul className="list-group">
          {rooms.map((room) => (
            <li
              key={room.name}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                currentRoom === room.name ? "active" : ""
              }`}
              onClick={() => handleRoomClick(room.name)}
              style={{ cursor: "pointer" }}
            >
              <span className="d-flex align-items-center">
                <i className="bi bi-chat-dots me-2"></i>
                <strong>{room.name}</strong>
              </span>
              <span
                className={`badge rounded-pill ${
                  currentRoom === room.name
                    ? "bg-light text-dark"
                    : "bg-primary"
                }`}
              >
                {counts[room.name] || 0}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Легенда */}
      <div className="p-3 border-top mt-auto">
        <small className="text-muted d-block">
          <i className="bi bi-info-circle me-1"></i>
          Нажмите на комнату для перехода
        </small>
      </div>
    </aside>
  );
};
