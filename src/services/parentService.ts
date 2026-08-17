// The backend does not expose a distinct "parent" dataset — a Parent account
// authenticates the same way, and progress/leaderboard endpoints are keyed
// off the JWT's user id. In practice a Parent role would need a linked
// studentId; until that exists on the backend, this dashboard shows the
// signed-in account's own analytics (works today for a self-monitoring
// Student/Parent combined login, and is the natural extension point once
// a Parent->Student link is added server-side).
import api from "./api";
import type { StudentAnalytics } from "../types";

export const parentService = {
  getChildAnalytics: () => api.get<StudentAnalytics>("/progress/analytics").then((r) => r.data),
};
