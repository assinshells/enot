import { useMemo, useCallback, memo } from "react";
import { getColorValue } from "@/shared/config/colors";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import { useGenderFilter } from "@/shared/lib/hooks/useGenderFilter";
import { useRooms, useRoomUsers } from "@/shared/lib/hooks";
import { GENDER_OPTIONS } from "@/shared/config/constants";
import "./RightSidebarChat.css";

const RoomItem = memo(({ room, count, isActive, onClick }) => (
  <li onClick={onClick}>
    <a href="#">
      <div className="d-flex align-items-center">
        <div className="flex-grow-1 overflow-hidden">
          <h5 className="text-truncate mb-0">
            #{room}
            <span className="badge badge-soft-danger rounded-badge float-end">
              {count || 0}
            </span>
          </h5>
        </div>
      </div>
    </a>
  </li>
));

RoomItem.displayName = "RoomItem";

const UserItem = memo(({ user, isCurrentUser, userColor, onClick }) => (
  <li onClick={onClick}>
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
      {user.nickname}
      {isCurrentUser && <small>(вы)</small>}
    </span>
  </li>
));

UserItem.displayName = "UserItem";

export const RightSidebarChat = memo(({ onUserClick }) => {
  const { user } = useAuth();
  const { rooms, counts, changeRoom } = useRooms();
  const users = useRoomUsers();
  const { activeFilter, setActiveFilter, genderCounts, filteredUsers } =
    useGenderFilter(users, user?.gender);

  const totalUsers = useMemo(() => {
    return Object.values(counts).reduce((sum, count) => sum + count, 0);
  }, [counts]);

  const handleRoomClick = useCallback(
    (roomName) => {
      changeRoom(roomName);
    },
    [changeRoom]
  );

  const handleUserClick = useCallback(
    (nickname) => {
      onUserClick?.(nickname);
    },
    [onUserClick]
  );

  return (
    <div className="chat-rightsidebar me-lg-1 ms-lg-0">
      <div className="right-sidebar-layout">
        <div className="rooms-section">
          <div className="p-4">
            <h4 className="mb-4">Комнаты</h4>
          </div>
          <div className="rooms-list">
            <ul className="list-unstyled chat-list">
              {rooms.map((room) => (
                <RoomItem
                  key={room.name}
                  room={room.name}
                  count={counts[room.name]}
                  onClick={() => handleRoomClick(room.name)}
                />
              ))}
            </ul>
          </div>
        </div>

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

          <div className="users-list">
            {filteredUsers.length > 0 ? (
              <ul>
                {filteredUsers.map((listUser) => {
                  const userColor = getColorValue(listUser.color);
                  const isCurrentUser = user?._id === listUser._id;

                  return (
                    <UserItem
                      key={listUser._id}
                      user={listUser}
                      isCurrentUser={isCurrentUser}
                      userColor={userColor}
                      onClick={() =>
                        !isCurrentUser && handleUserClick(listUser.nickname)
                      }
                    />
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
        </div>
      </div>
    </div>
  );
});

RightSidebarChat.displayName = "RightSidebarChat";
