import api from "./api";
import type { DashboardProgress, StudentAnalytics } from "../types";

export const progressService = {
  getDashboardProgress: () =>
    api.get<DashboardProgress>("/progress/dashboard").then((r) => r.data),

  getStudentAnalytics: () =>
    api.get<StudentAnalytics>("/progress/analytics").then((r) => r.data),
};
