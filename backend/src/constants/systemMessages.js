export const SYSTEM_MESSAGE_TYPES = {
  JOIN: "join",
  LEAVE: "leave",
  SWITCH: "switch",
};

export const ACTION_VARIANTS = {
  JOIN: ["вошёл", "вошла", "вошли", "приполз", "приползла", "приползли"],
  LEAVE: ["ушёл", "ушла", "ушли", "уполз", "уползла", "уползли"],
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
  SWITCH_SINGLE: (nickname, verb, room) =>
    `${nickname} ${verb} в комнату ${room}`,
  JOIN_MULTIPLE: (nicknames, verb) => `в комнату ${verb} ${nicknames}`,
  LEAVE_MULTIPLE: (nicknames, verb) => `${nicknames} ${verb} из комнаты`,
  SWITCH_MULTIPLE: (nicknames, verb, room) =>
    `${nicknames} ${verb} в комнату ${room}`,
};
