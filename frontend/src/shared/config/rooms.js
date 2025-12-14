export const ROOMS_CONFIG = [
  {
    id: "main",
    name: "Главная",
    description: "Общая комната для всех",
    icon: "chat-dots",
  },
  {
    id: "dating",
    name: "Знакомства",
    description: "Найди новых друзей",
    icon: "heart",
  },
  {
    id: "chaos",
    name: "Беспредел",
    description: "Без правил",
    icon: "fire",
  },
];

export const ROOM_NAMES = ROOMS_CONFIG.map((r) => r.name);
export const DEFAULT_ROOM = ROOMS_CONFIG[0].name;

export const isValidRoom = (roomName) => ROOM_NAMES.includes(roomName);
