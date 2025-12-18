import {
  SYSTEM_MESSAGE_TYPES,
  MESSAGE_TEMPLATES,
} from "../constants/systemMessages.js";
import {
  getVerbByGender,
  getVerbForMultiple,
  joinNicknames,
} from "./genderHelper.js";

export const formatSystemMessage = (type, users, targetRoom = null) => {
  if (!users || users.length === 0) return null;

  const isMultiple = users.length > 1;
  const nicknames = users.map((u) => u.nickname);
  const isAlternative = Math.random() < 0.1;

  if (type === SYSTEM_MESSAGE_TYPES.JOIN) {
    if (isMultiple) {
      const verb = getVerbForMultiple("JOIN", isAlternative);
      return MESSAGE_TEMPLATES.JOIN_MULTIPLE(joinNicknames(nicknames), verb);
    }
    const verb = getVerbByGender("JOIN", users[0].gender, isAlternative);
    return MESSAGE_TEMPLATES.JOIN_SINGLE(verb, nicknames[0]);
  }

  if (type === SYSTEM_MESSAGE_TYPES.LEAVE) {
    if (isMultiple) {
      const verb = getVerbForMultiple("LEAVE", isAlternative);
      return MESSAGE_TEMPLATES.LEAVE_MULTIPLE(joinNicknames(nicknames), verb);
    }
    const verb = getVerbByGender("LEAVE", users[0].gender, isAlternative);
    return MESSAGE_TEMPLATES.LEAVE_SINGLE(verb, nicknames[0]);
  }

  if (type === SYSTEM_MESSAGE_TYPES.SWITCH) {
    if (isMultiple) {
      const verb = getVerbForMultiple("SWITCH", isAlternative);
      return MESSAGE_TEMPLATES.SWITCH_MULTIPLE(
        joinNicknames(nicknames),
        verb,
        targetRoom
      );
    }
    const verb = getVerbByGender("SWITCH", users[0].gender, isAlternative);
    return MESSAGE_TEMPLATES.SWITCH_SINGLE(nicknames[0], verb, targetRoom);
  }

  return null;
};
