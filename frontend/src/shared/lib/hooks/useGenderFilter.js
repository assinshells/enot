/**
 * Shared Hook: Gender Filter Logic
 * Новый хук для управления фильтрацией по полу
 */
import { useState, useMemo, useEffect } from "react";

export const useGenderFilter = (users, currentUserGender) => {
  const [activeFilter, setActiveFilter] = useState("all");

  // Устанавливаем фильтр по умолчанию на основе пола текущего пользователя
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
    const filtered = users.filter((u) => u.gender === activeFilter);
    console.log(
      `🔍 Filter: ${activeFilter}, Total: ${users.length}, Filtered: ${filtered.length}`
    );
    return filtered;
  }, [users, activeFilter]);

  return {
    activeFilter,
    setActiveFilter,
    genderCounts,
    filteredUsers,
  };
};
