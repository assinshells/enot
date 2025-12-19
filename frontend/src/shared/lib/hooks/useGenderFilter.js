import { useState, useMemo, useEffect } from "react";

export const useGenderFilter = (users, currentUserGender) => {
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!currentUserGender) return;

    if (currentUserGender === "male") {
      setActiveFilter("female");
    } else if (currentUserGender === "female") {
      setActiveFilter("male");
    } else {
      setActiveFilter("unknown");
    }
  }, [currentUserGender]);

  const genderCounts = useMemo(() => {
    return {
      male: users.filter((u) => u.gender === "male").length,
      female: users.filter((u) => u.gender === "female").length,
      unknown: users.filter((u) => u.gender === "unknown").length,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (activeFilter === "all") return users;
    return users.filter((u) => u.gender === activeFilter);
  }, [users, activeFilter]);

  return {
    activeFilter,
    setActiveFilter,
    genderCounts,
    filteredUsers,
  };
};
