import api from "./api";
import type {
  Paper,
  PaperQuestion,
  SubmitPaperAttemptRequest,
  PaperAttemptResult,
} from "../types";

export const paperService = {
  getPapers: (gradeId?: number, subjectId?: number, paperType?: string) =>
    api
      .get<Paper[]>("/papers", {
        params: { gradeId, subjectId, paperType },
      })
      .then((r) => r.data),

  getPaper: (paperId: number) =>
    api.get<Paper>(`/papers/${paperId}`).then((r) => r.data),

  getPaperAttemptQuestions: (paperId: number) =>
    api
      .get<{
        paperId: number;
        title: string;
        durationMinutes: number;
        totalMarks: number;
        questions: PaperQuestion[];
      }>(`/papers/${paperId}/attempt-questions`)
      .then((r) => r.data),

  submitPaperAttempt: (paperId: number, data: SubmitPaperAttemptRequest) =>
    api
      .post<PaperAttemptResult>(`/papers/${paperId}/submit-attempt`, data)
      .then((r) => r.data),
};
