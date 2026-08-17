import api from "./api";
import type { AppNotification } from "../types";

export const notificationService = {
  getForUser: (userId: number) =>
    api.get<AppNotification[]>(`/notification/${userId}`).then((r) => r.data),

  markAsRead: (id: number) =>
    api.put<{ message: string }>(`/notification/mark-read/${id}`).then((r) => r.data),
};
