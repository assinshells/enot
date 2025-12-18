import { ACTION_VARIANTS } from "../constants/systemMessages.js";

export const getVerbByGender = (actionType, gender, isAlternative = false) => {
  const variants = ACTION_VARIANTS[actionType];
  if (!variants) return variants[0];

  const offset = isAlternative ? 3 : 0;

  if (gender === "male") return variants[0 + offset];
  if (gender === "female") return variants[1 + offset];
  // Для unknown используем мужской род (вошёл/вышел/перешёл)
  return variants[0 + offset];
};

export const getVerbForMultiple = (actionType, isAlternative = false) => {
  const variants = ACTION_VARIANTS[actionType];
  const offset = isAlternative ? 3 : 0;
  return variants[2 + offset];
};

export const joinNicknames = (nicknames) => {
  if (nicknames.length === 1) return nicknames[0];
  if (nicknames.length === 2) return `${nicknames[0]}, ${nicknames[1]}`;

  const lastNickname = nicknames[nicknames.length - 1];
  const restNicknames = nicknames.slice(0, -1).join(", ");
  return `${restNicknames}, ${lastNickname}`;
};
