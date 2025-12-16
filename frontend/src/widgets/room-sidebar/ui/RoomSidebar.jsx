import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { socketLib } from "@/shared/lib/socket/socket";
import { getColorValue } from "@/shared/config/colors";
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

const UserItem = memo(({ user, onUserClick }) => {
  const userColor = getColorValue(user.color);

  const handleClick = useCallback(() => {
    onUserClick(user.nickname);
  }, [user.nickname, onUserClick]);

  return (
    <li
      className="list-group-item d-flex align-items-center"
      style={{ cursor: "pointer" }}
      onClick={handleClick}
    >
      <div
        className="rounded-circle me-2"
        style={{
          width: "8px",
          height: "8px",
          backgroundColor: userColor,
        }}
      ></div>
      <span style={{ color: userColor }}>{user.nickname}</span>
    </li>
  );
});

UserItem.displayName = "UserItem";

export const RoomSidebar = ({ currentRoom, onRoomChange, onUserClick }) => {
  const [rooms, setRooms] = useState([]);
  const [counts, setCounts] = useState({});
  const [users, setUsers] = useState([]);

  const totalUsers = useMemo(() => {
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  }, [counts]);

  const handleRoomClick = useCallback(
    (roomName) => {
      if (roomName !== currentRoom) {
        onRoomChange(roomName);
      }
    },
    [currentRoom, onRoomChange]
  );

  useEffect(() => {
    const socket = socketLib.getSocket();
    if (!socket) return;

    const handleRoomList = (data) => {
      setRooms(data);
      const newCounts = {};
      data.forEach((r) => (newCounts[r.name] = r.count));
      setCounts(newCounts);
    };

    const handleRoomCounts = (data) => {
      setCounts(data);
    };

    const handleRoomUsers = (data) => {
      setUsers(data);
    };

    socket.emit("room:list");
    socket.on("room:list", handleRoomList);
    socket.on("room:counts", handleRoomCounts);
    socket.on("room:users", handleRoomUsers);

    return () => {
      socket.off("room:list", handleRoomList);
      socket.off("room:counts", handleRoomCounts);
      socket.off("room:users", handleRoomUsers);
    };
  }, []);

  return (
    <aside className="room-sidebar border-start d-flex flex-column">
      <div className="rooms-section border-bottom" style={{ flex: "0 0 30%" }}>
        <div className="p-3 border-bottom bg-light">
          <h6 className="mb-0">
            <i className="bi bi-door-open me-2"></i>Комнаты
          </h6>
        </div>
        <div className="overflow-auto h-100">
          <ul className="list-group list-group-flush">
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
      </div>

      <div
        className="users-section d-flex flex-column"
        style={{ flex: "1 1 70%" }}
      >
        <div className="p-3 border-bottom bg-light">
          <h6 className="mb-0">
            <i className="bi bi-people-fill me-2"></i>В чате: {totalUsers}
          </h6>
        </div>
        <div className="overflow-auto flex-grow-1">
          {users.length > 0 ? (
            <ul className="list-group list-group-flush">
              {users.map((user) => (
                <UserItem
                  key={user._id}
                  user={user}
                  onUserClick={onUserClick}
                />
              ))}
            </ul>
          ) : (
            <div className="p-3 text-center text-muted">
              <i className="bi bi-person-slash"></i>
              <p className="mb-0 mt-2">Нет пользователей</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
