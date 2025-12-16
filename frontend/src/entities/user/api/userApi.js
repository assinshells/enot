import { request } from "@/shared/api/request";

export const userApi = {
  getProfile: async () => {
    return request.get("/users/profile");
  },

  updateProfile: async (data) => {
    return request.put("/users/profile", data);
  },
};
