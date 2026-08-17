import api from "./api";
import type { Badge, DailyChallenge, LeaderboardEntry, StreakResponse } from "../types";

export const gamificationService = {
  getMyBadges: () => api.get<Badge[]>("/badge/my-badges").then((r) => r.data),

  checkBadges: () =>
    api.post<{ message: string; newBadges: string[] }>("/badge/check").then((r) => r.data),

  getTodayChallenge: () =>
    api.get<DailyChallenge>("/dailychallenge/today").then((r) => r.data),

  completeChallenge: (challengeId: number) =>
    api
      .post<{ message: string; rewardXP: number; streak: number }>(
        `/dailychallenge/complete/${challengeId}`
      )
      .then((r) => r.data),

  getStreak: () => api.get<StreakResponse>("/dailychallenge/streak").then((r) => r.data),

  getLeaderboard: () => api.get<LeaderboardEntry[]>("/leaderboard").then((r) => r.data),
};
