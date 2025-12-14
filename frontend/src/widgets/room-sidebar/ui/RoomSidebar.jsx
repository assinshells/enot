import { useState, useEffect, useMemo, memo } from "react";
import { socketLib } from "@/shared/lib/socket/socket";
import "./RoomSidebar.css";

const RoomItem = memo(({ room, count, isActive, onClick }) => (
  <li
    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
      isActive ? "active" : ""
    }`}
    onClick={onClick}
    style={{ cursor: "pointer" }}
  >
    <span className="d-flex align-items-center">
      <i className="bi bi-chat-dots me-2"></i>
      <strong>{room}</strong>
    </span>
    <span
      className={`badge rounded-pill ${
        isActive ? "bg-light text-dark" : "bg-primary"
      }`}
    >
      {count}
    </span>
  </li>
));

RoomItem.displayName = "RoomItem";

export const RoomSidebar = ({ currentRoom, onRoomChange }) => {
  const [rooms, setRooms] = useState([]);
  const [counts, setCounts] = useState({});

  const totalUsers = useMemo(() => {
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  }, [counts]);

  useEffect(() => {
    const socket = socketLib.getSocket();
    if (!socket) return;

    socket.emit("room:list");

    const handleRoomList = (data) => {
      setRooms(data);
      const newCounts = {};
      data.forEach((r) => (newCounts[r.name] = r.count));
      setCounts(newCounts);
    };
    const handleRoomCounts = (data) => {
      setCounts(data);
    };

    socket.on("room:list", handleRoomList);
    socket.on("room:counts", handleRoomCounts);

    return () => {
      socket.off("room:list", handleRoomList);
      socket.off("room:counts", handleRoomCounts);
    };
  }, []);
  const handleRoomClick = (roomName) => {
    if (roomName !== currentRoom) {
      onRoomChange(roomName);
    }
  };
  return (
    <aside className="room-sidebar border-start">
      <div className="p-3 border-bottom">
        <h5 className="mb-0 d-flex align-items-center">
          <i className="bi bi-people-fill me-2 text-primary"></i>В чате:{" "}
          {totalUsers}
        </h5>
      </div>
      <div className="p-3">
        <h6 className="text-muted mb-3">Комнаты</h6>
        <ul className="list-group">
          {rooms.map((room) => (
            <RoomItem
              key={room.name}
              room={room.name}
              count={counts[room.name] || 0}
              isActive={currentRoom === room.name}
              onClick={() => handleRoomClick(room.name)}
            />
          ))}
        </ul>
      </div>

      <div className="p-3 border-top mt-auto">
        <small className="text-muted d-block">
          <i className="bi bi-info-circle me-1"></i>
          Нажмите на комнату для перехода
        </small>
      </div>
    </aside>
  );
};
