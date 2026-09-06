import api from "./api";
import type { TextBook } from "../types";

export const textbookService = {
  getForSubject: (gradeId: number, subjectId: number) =>
    api.get<TextBook[]>("/textbooks", { params: { gradeId, subjectId } }).then((r) => r.data),
};
