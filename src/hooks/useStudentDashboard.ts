import { useQuery } from "@tanstack/react-query";
import { progressService } from "../services/progressService";
import { gamificationService } from "../services/gamificationService";
import { learningService } from "../services/learningService";
import { gradesService } from "../services/gradesService";

export function useAnalytics() {
  return useQuery({ queryKey: ["analytics"], queryFn: progressService.getStudentAnalytics });
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

/** Active grades that may be selected during student registration. */
export function useGrades() {
  return useQuery({
    queryKey: ["grades", "active"],
    queryFn: gradesService.getGrades,
    select: (grades) => grades.filter((grade) => grade.isActive),
  });
}
