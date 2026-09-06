import api from "./api";
import type { Grade, Subject } from "../types";

export const gradesService = {
  getGrades: () => api.get<Grade[]>("/grades").then((r) => r.data),
  getGrade: (id: number) => api.get<Grade>(`/grades/${id}`).then((r) => r.data),
  getSubjectsForGrade: (gradeId: number) =>
    api.get<Subject[]>(`/grades/${gradeId}/subjects`).then((r) => r.data),
};
