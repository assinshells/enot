import { getColorValue } from "@/shared/config/colors";
import {
  SYSTEM_MESSAGE_COLOR,
  CURRENT_USER_COLOR,
} from "@/shared/config/systemMessages";

export const parseSystemMessage = (
  message,
  currentUserNickname,
  onNicknameClick,
  onRoomClick
) => {
  const { text, systemData } = message;
  if (!systemData?.users) return [{ text, color: SYSTEM_MESSAGE_COLOR }];

  const parts = [];
  let remainingText = text;

  systemData.users.forEach((userData) => {
    const nickname = userData.nickname;
    const index = remainingText.indexOf(nickname);

    if (index !== -1) {
      if (index > 0) {
        parts.push({
          text: remainingText.substring(0, index),
          color: SYSTEM_MESSAGE_COLOR,
        });
      }

      const isCurrentUser = nickname === currentUserNickname;
      const color = isCurrentUser
        ? CURRENT_USER_COLOR
        : getColorValue(userData.color);

      parts.push({
        text: nickname,
        color,
        clickable: !isCurrentUser,
        onClick: !isCurrentUser ? () => onNicknameClick(nickname) : undefined,
      });

      remainingText = remainingText.substring(index + nickname.length);
    }
  });

  if (systemData.targetRoom && remainingText.includes(systemData.targetRoom)) {
    const roomIndex = remainingText.indexOf(systemData.targetRoom);

    if (roomIndex > 0) {
      parts.push({
        text: remainingText.substring(0, roomIndex),
        color: SYSTEM_MESSAGE_COLOR,
      });
    }

    parts.push({
      text: systemData.targetRoom,
      color: "#0d6efd",
      clickable: true,
      onClick: () => onRoomClick(systemData.targetRoom),
    });

    remainingText = remainingText.substring(
      roomIndex + systemData.targetRoom.length
    );
  }

  if (remainingText) {
    parts.push({
      text: remainingText,
      color: SYSTEM_MESSAGE_COLOR,
    });
  }

  return parts;
};
