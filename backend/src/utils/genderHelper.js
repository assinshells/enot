import { ACTION_VARIANTS } from "../constants/systemMessages.js";

export const getVerbByGender = (actionType, gender, isAlternative = false) => {
  const variants = ACTION_VARIANTS[actionType];
  if (!variants) return variants[0];

  if (gender === "male") return isAlternative ? variants[3] : variants[0];
  if (gender === "female") return isAlternative ? variants[4] : variants[1];
  if (gender === "unknown") return isAlternative ? variants[5] : variants[3];

  return isAlternative ? variants[3] : variants[0];
};

export const getVerbForMultiple = (actionType, isAlternative = false) => {
  const variants = ACTION_VARIANTS[actionType];
  return isAlternative ? variants[5] : variants[2];
};

export const joinNicknames = (nicknames) => {
  if (nicknames.length === 1) return nicknames[0];
  if (nicknames.length === 2) return `${nicknames[0]}, ${nicknames[1]}`;

  const lastNickname = nicknames[nicknames.length - 1];
  const restNicknames = nicknames.slice(0, -1).join(", ");
  return `${restNicknames}, ${lastNickname}`;
};
