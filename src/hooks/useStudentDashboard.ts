import { useQuery } from "@tanstack/react-query";
import { progressService } from "../services/progressService";
import { gamificationService } from "../services/gamificationService";
import { learningService } from "../services/learningService";

export function useAnalytics() {
  return useQuery({ queryKey: ["analytics"], queryFn: progressService.getAnalytics });
}

export function useStreak() {
  return useQuery({ queryKey: ["streak"], queryFn: gamificationService.getStreak });
}

export function useMyBadges() {
  return useQuery({ queryKey: ["badges"], queryFn: gamificationService.getMyBadges });
}

export function useTodayChallenge() {
  return useQuery({
    queryKey: ["daily-challenge"],
    queryFn: gamificationService.getTodayChallenge,
    retry: false,
  });
}

export function useSubjects() {
  return useQuery({ queryKey: ["subjects"], queryFn: learningService.getSubjects });
}
