export const SYSTEM_MESSAGE_TYPES = {
  JOIN: "join",
  LEAVE: "leave",
  SWITCH: "switch",
};

export const ACTION_VARIANTS = {
  JOIN: ["вошёл", "вошла", "вошли", "приполз", "припoлзла", "приползли"],
  LEAVE: ["вышел", "вышла", "вышли", "уполз", "уползла", "уползли"],
  SWITCH: [
    "перешёл",
    "перешла",
    "перешли",
    "переполз",
    "переползла",
    "переползли",
  ],
};

export const MESSAGE_TEMPLATES = {
  JOIN_SINGLE: (verb, nickname) => `в чат ${verb} ${nickname}`,
  LEAVE_SINGLE: (verb, nickname) => `из чата ${verb} ${nickname}`,
  SWITCH_SINGLE: (verb, nickname, room) =>
    `${nickname} ${verb} в комнату ${room}`,
  JOIN_MULTIPLE: (verb, nicknames) => `в комнату ${verb} ${nicknames}`,
  LEAVE_MULTIPLE: (verb, nicknames) => `${nicknames} ${verb} из комнаты`,
  SWITCH_MULTIPLE: (verb, nicknames, room) =>
    `${nicknames} ${verb} в комнату ${room}`,
};
