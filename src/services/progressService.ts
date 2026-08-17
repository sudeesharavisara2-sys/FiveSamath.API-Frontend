import api from "./api";
import type { StudentAnalytics } from "../types";

export const progressService = {
  completeLesson: (lessonId: number) =>
    api.post<{ message: string; xpEarned: number }>(`/progress/complete-lesson/${lessonId}`).then((r) => r.data),

  getAnalytics: () => api.get<StudentAnalytics>("/progress/analytics").then((r) => r.data),
};
