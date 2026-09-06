import api from "./api";
import type { Quiz, SubmitQuizRequest, QuizResultResponse } from "../types";

export const quizService = {
  getChapterQuiz: (chapterId: number) =>
    api.get<Quiz>(`/quizzes/chapter/${chapterId}`).then((r) => r.data),

  getQuiz: (quizId: number) =>
    api.get<Quiz>(`/quizzes/${quizId}`).then((r) => r.data),

  submitQuiz: (data: SubmitQuizRequest) =>
    api.post<QuizResultResponse>("/quizzes/submit", data).then((r) => r.data),
};
