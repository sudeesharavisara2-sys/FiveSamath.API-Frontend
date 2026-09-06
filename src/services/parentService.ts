import api from "./api";
import type { LinkedChild, ParentChildAnalytics } from "../types";

export const parentService = {
  linkChild: (studentEmail: string) =>
    api
      .post<{ message: string; studentId: number }>("/parent/link-child", {
        studentEmail,
      })
      .then((r) => r.data),

  getChildren: () =>
    api.get<LinkedChild[]>("/parent/children").then((r) => r.data),

  getChildAnalytics: (childId: number) =>
    api
      .get<ParentChildAnalytics>(`/parent/children/${childId}/analytics`)
      .then((r) => r.data),
};
