import { useState, useEffect, useMemo, useCallback } from "react";
import { socketLib } from "@/shared/lib/socket/socket";
import { getColorValue } from "@/shared/config/colors";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useGenderFilter } from "@/shared/lib/hooks/useGenderFilter";
import { userApi } from "@/entities/user";
import { GENDER_OPTIONS } from "@/shared/config/constants";
import "./RightSidebarChat.css";

export const RightSidebarChat = () => {
  const { user, setUser } = useAuth();

  // Rooms state
  const [rooms, setRooms] = useState([]);
  const [counts, setCounts] = useState({});
  const [currentRoom, setCurrentRoom] = useState("");

  // Users state
  const [users, setUsers] = useState([]);
  const { activeFilter, setActiveFilter, genderCounts, filteredUsers } =
    useGenderFilter(users, user?.gender);

  // Settings state
  const [selectedColor, setSelectedColor] = useState(user?.color || "black");
  const [selectedGender, setSelectedGender] = useState(
    user?.gender || "unknown"
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const totalUsers = useMemo(() => {
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  }, [counts]);

  // Rooms handlers
  const handleRoomClick = useCallback(
    (roomName) => {
      if (roomName !== currentRoom) {
        const socket = socketLib.getSocket();
        if (socket) {
          socket.emit("room:leave");
          setTimeout(() => {
            setCurrentRoom(roomName);
            socket.emit("room:join", { room: roomName });
          }, 50);
        }
      }
    },
    [currentRoom]
  );

  // Users handlers
  const handleUserClick = useCallback((nickname) => {
    console.log("User clicked:", nickname);
  }, []);

  // Settings handlers
  const handleColorChange = useCallback(
    async (color) => {
      setSelectedColor(color);
      setSaving(true);
      setMessage("");

      try {
        await userApi.updateProfile({ color });
        setUser((prev) => ({ ...prev, color }));
        setMessage("Цвет успешно изменен!");
        setTimeout(() => setMessage(""), 2000);
      } catch (error) {
        setMessage("Ошибка при изменении цвета");
      } finally {
        setSaving(false);
      }
    },
    [setUser]
  );

  const handleGenderChange = useCallback(
    async (gender) => {
      setSelectedGender(gender);
      setSaving(true);
      setMessage("");

      try {
        await userApi.updateProfile({ gender });
        setUser((prev) => ({ ...prev, gender }));
        setMessage("Пол успешно изменен!");
        setTimeout(() => setMessage(""), 2000);
      } catch (error) {
        setMessage("Ошибка при изменении пола");
      } finally {
        setSaving(false);
      }
    },
    [setUser]
  );

  // Socket effects
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

    const handleRoomJoined = ({ room }) => {
      setCurrentRoom(room);
    };

    socket.emit("room:list");
    socket.on("room:list", handleRoomList);
    socket.on("room:counts", handleRoomCounts);
    socket.on("room:users", handleRoomUsers);
    socket.on("room:joined", handleRoomJoined);

    return () => {
      socket.off("room:list", handleRoomList);
      socket.off("room:counts", handleRoomCounts);
      socket.off("room:users", handleRoomUsers);
      socket.off("room:joined", handleRoomJoined);
    };
  }, []);

  return (
    <>
      {/* start chat-rightsidebar */}
      <div className="chat-rightsidebar me-lg-1 ms-lg-0">
        <div className="right-sidebar-layout">
          {/* start rooms block */}
          <div className="rooms-section">
            <div className="p-4">
              <h4 className="mb-4">Комнаты</h4>
            </div>
            <div className="rooms-list">
              <ul className="list-unstyled chat-list">
                {rooms.map((room) => (
                  <li
                    key={room.name}
                    onClick={() => handleRoomClick(room.name)}
                  >
                    <a href="#">
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1 overflow-hidden">
                          <h5 className="text-truncate mb-0">
                            #{room.name}
                            <span className="badge badge-soft-danger rounded-badge float-end">
                              {counts[room.name] || 0}
                            </span>
                          </h5>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* end rooms block */}

          {/* start users block */}

          <div className="users-section">
            <div className="users-header">
              <h6>
                <i className="bi bi-people-fill"></i>В чате: {totalUsers}
              </h6>
              <button onClick={() => setActiveFilter("all")}>Все</button>
            </div>

            <div>
              {["male", "female", "unknown"].map((gender) => (
                <button key={gender} onClick={() => setActiveFilter(gender)}>
                  <i
                    className={`${
                      GENDER_OPTIONS.find((o) => o.value === gender)?.icon
                    }`}
                  ></i>
                  {gender === "male" ? "М" : gender === "female" ? "Ж" : "?"}
                  <span>{genderCounts[gender]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="users-list">
            {filteredUsers.length > 0 ? (
              <ul>
                {filteredUsers.map((listUser) => {
                  const userColor = getColorValue(listUser.color);
                  const isCurrentUser = user?._id === listUser._id;

                  return (
                    <li
                      key={listUser._id}
                      onClick={() =>
                        !isCurrentUser && handleUserClick(listUser.nickname)
                      }
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          backgroundColor: userColor,
                        }}
                      ></div>
                      <span
                        style={{
                          color: isCurrentUser ? "#6c757d" : userColor,
                        }}
                      >
                        {listUser.nickname}
                        {isCurrentUser && <small>(вы)</small>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div>
                <i className="bi bi-person-slash"></i>
                <p>Нет пользователей</p>
              </div>
            )}
          </div>

          {/* end users block */}
        </div>
      </div>
      {/* end chat-rightsidebar */}
    </>
  );
};
