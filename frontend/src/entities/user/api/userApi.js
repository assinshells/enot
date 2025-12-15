import { request } from "@/shared/api/request";

export const userApi = {
  // Получить профиль
  getProfile: async () => {
    return request.get("/users/profile");
  },

  // Обновить профиль
  updateProfile: async (data) => {
    return request.put("/users/profile", data);
  },

  // Обновить цвет
  updateColor: async (color) => {
    return request.put("/users/profile", { color });
  },
};
