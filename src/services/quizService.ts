import api from "./api";
import type {
  GenerateQuizRequest,
  QuizBundle,
  SubmitQuizRequest,
  SubmitQuizResponse,
} from "../types";

export const quizService = {
  getQuiz: (quizId: number) =>
    api.get<QuizBundle>(`/quiz/${quizId}`).then((r) => r.data),

  submitQuiz: (data: SubmitQuizRequest) =>
    api.post<SubmitQuizResponse>("/quiz/submit", data).then((r) => r.data),

  // AI-generated practice quiz (topic + difficulty)
  generatePractice: (data: GenerateQuizRequest) =>
    api.post("/practice/generate", data).then((r) => r.data),

  askTutor: (question: string) =>
    api.post("/aitutor/ask", { question }).then((r) => r.data),
};
