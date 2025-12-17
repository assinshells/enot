import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { socketLib } from "@/shared/lib/socket/socket";
import { getColorValue } from "@/shared/config/colors";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useGenderFilter } from "@/shared/lib/hooks/useGenderFilter";
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

const UserItem = memo(({ user, onUserClick, isCurrentUser }) => {
  const userColor = getColorValue(user.color);

  const handleClick = useCallback(() => {
    if (!isCurrentUser) {
      onUserClick(user.nickname);
    }
  }, [user.nickname, onUserClick, isCurrentUser]);

  return (
    <li
      className={`list-group-item d-flex align-items-center ${
        isCurrentUser ? "text-muted" : ""
      }`}
      style={{
        cursor: isCurrentUser ? "default" : "pointer",
        opacity: isCurrentUser ? 0.7 : 1,
      }}
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
      <span style={{ color: isCurrentUser ? "#6c757d" : userColor }}>
        {user.nickname}
        {isCurrentUser && <small className="ms-2">(вы)</small>}
      </span>
    </li>
  );
});

UserItem.displayName = "UserItem";

const GenderTab = memo(({ gender, count, isActive, onClick }) => {
  const icons = {
    male: "bi-gender-male",
    female: "bi-gender-female",
    unknown: "bi-question-circle",
  };

  const labels = {
    male: "М",
    female: "Ж",
    unknown: "?",
  };

  return (
    <button
      className={`btn btn-sm ${
        isActive ? "btn-primary" : "btn-outline-secondary"
      } flex-fill`}
      onClick={onClick}
      style={{ fontSize: "0.85rem" }}
    >
      <i className={`${icons[gender]} me-1`}></i>
      {labels[gender]}
      <span className="badge bg-light text-dark ms-1">{count}</span>
    </button>
  );
});

GenderTab.displayName = "GenderTab";

export const RoomSidebar = ({ currentRoom, onRoomChange, onUserClick }) => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [counts, setCounts] = useState({});
  const [users, setUsers] = useState([]);

  const { activeFilter, setActiveFilter, genderCounts, filteredUsers } =
    useGenderFilter(users, user?.gender);

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
      console.log("📥 Received users data:", data);
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
      <div className="rooms-section border-bottom" style={{ flex: "0 0 auto" }}>
        <div className="p-3 border-bottom bg-light">
          <h6 className="mb-0">
            <i className="bi bi-door-open me-2"></i>Комнаты
          </h6>
        </div>
        <div className="overflow-auto" style={{ maxHeight: "30vh" }}>
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

      <div className="users-section d-flex flex-column flex-grow-1">
        <div className="p-3 border-bottom bg-light">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">
              <i className="bi bi-people-fill me-2"></i>В чате: {totalUsers}
            </h6>
            <button
              className={`btn btn-sm ${
                activeFilter === "all" ? "btn-primary" : "btn-outline-secondary"
              }`}
              onClick={() => setActiveFilter("all")}
              style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}
            >
              Все
            </button>
          </div>

          <div className="btn-group w-100" role="group">
            <GenderTab
              gender="male"
              count={genderCounts.male}
              isActive={activeFilter === "male"}
              onClick={() => setActiveFilter("male")}
            />
            <GenderTab
              gender="female"
              count={genderCounts.female}
              isActive={activeFilter === "female"}
              onClick={() => setActiveFilter("female")}
            />
            <GenderTab
              gender="unknown"
              count={genderCounts.unknown}
              isActive={activeFilter === "unknown"}
              onClick={() => setActiveFilter("unknown")}
            />
          </div>
        </div>

        <div className="overflow-auto flex-grow-1">
          {filteredUsers.length > 0 ? (
            <ul className="list-group list-group-flush">
              {filteredUsers.map((listUser) => (
                <UserItem
                  key={listUser._id}
                  user={listUser}
                  onUserClick={onUserClick}
                  isCurrentUser={user?._id === listUser._id}
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
