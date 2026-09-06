import api from "./api";
import type { AdminStats, Grade, Subject, Lesson, Chapter, Paper, CreateSubjectRequest, UpdateSubjectRequest, TextBook } from "../types";

export const adminService = {
  getStats: () => api.get<AdminStats>("/admin/stats").then((r) => r.data),

  uploadFile: (file: File, category = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    return api
      .post<{ url: string }>(`/admin/upload?category=${category}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((r) => r.data);
  },

  // Grades
  getGrades: () => api.get<Grade[]>("/admin/grades").then((r) => r.data),
  createGrade: (data: Partial<Grade>) =>
    api.post<Grade>("/admin/grades", data).then((r) => r.data),
  updateGrade: (id: number, data: Partial<Grade>) =>
    api.put<Grade>(`/admin/grades/${id}`, data).then((r) => r.data),
  deleteGrade: (id: number) =>
    api.delete(`/admin/grades/${id}`).then((r) => r.data),

  // Subjects
  getSubjects: () => api.get<Subject[]>("/admin/subjects").then((r) => r.data),
  createSubject: (data: CreateSubjectRequest) =>
    api.post<Subject>("/admin/subjects", data).then((r) => r.data),
  updateSubject: (id: number, data: UpdateSubjectRequest) =>
    api.put<Subject>(`/admin/subjects/${id}`, data).then((r) => r.data),
  deleteSubject: (id: number) =>
    api.delete(`/admin/subjects/${id}`).then((r) => r.data),

  // Textbooks
  getTextbooks: (gradeId?: number, subjectId?: number) =>
    api.get<TextBook[]>("/admin/textbooks", { params: { gradeId, subjectId } }).then((r) => r.data),
  createTextbook: (data: FormData) =>
    api.post<TextBook>("/admin/textbooks", data).then((r) => r.data),
  updateTextbook: (id: number, data: FormData) =>
    api.put<TextBook>(`/admin/textbooks/${id}`, data).then((r) => r.data),
  deleteTextbook: (id: number) =>
    api.delete(`/admin/textbooks/${id}`).then((r) => r.data),

  // Lessons
  getLessons: (gradeId?: number, subjectId?: number) =>
    api
      .get<Lesson[]>("/admin/lessons", { params: { gradeId, subjectId } })
      .then((r) => r.data),
  createLesson: (data: Partial<Lesson>) =>
    api.post<Lesson>("/admin/lessons", data).then((r) => r.data),
  updateLesson: (id: number, data: Partial<Lesson>) =>
    api.put<Lesson>(`/admin/lessons/${id}`, data).then((r) => r.data),
  deleteLesson: (id: number) =>
    api.delete(`/admin/lessons/${id}`).then((r) => r.data),

  // Chapters
  getChapters: (lessonId?: number) =>
    api
      .get<Chapter[]>("/admin/chapters", { params: { lessonId } })
      .then((r) => r.data),
  createChapter: (data: Partial<Chapter>) =>
    api.post<Chapter>("/admin/chapters", data).then((r) => r.data),
  updateChapter: (id: number, data: Partial<Chapter>) =>
    api.put<Chapter>(`/admin/chapters/${id}`, data).then((r) => r.data),
  deleteChapter: (id: number) =>
    api.delete(`/admin/chapters/${id}`).then((r) => r.data),

  // Materials & Animations
  createMaterial: (data: unknown) =>
    api.post("/admin/materials", data).then((r) => r.data),
  deleteMaterial: (id: number) =>
    api.delete(`/admin/materials/${id}`).then((r) => r.data),
  createAnimation: (data: unknown) =>
    api.post("/admin/animations", data).then((r) => r.data),

  // Quizzes & Questions
  createQuiz: (data: unknown) =>
    api.post("/admin/quizzes", data).then((r) => r.data),
  createQuestion: (data: unknown) =>
    api.post("/admin/questions", data).then((r) => r.data),
  deleteQuestion: (id: number) =>
    api.delete(`/admin/questions/${id}`).then((r) => r.data),

  // Papers
  getPapers: () => api.get<Paper[]>("/admin/papers").then((r) => r.data),
  createPaper: (data: Partial<Paper>) =>
    api.post<Paper>("/admin/papers", data).then((r) => r.data),
  updatePaper: (id: number, data: Partial<Paper>) =>
    api.put<Paper>(`/admin/papers/${id}`, data).then((r) => r.data),
  deletePaper: (id: number) =>
    api.delete(`/admin/papers/${id}`).then((r) => r.data),

  // Paper questions
  getPaperQuestions: (paperId: number) =>
    api.get(`/admin/papers/${paperId}/questions`).then((r) => r.data),
  createPaperQuestion: (paperId: number, data: unknown) =>
    api.post(`/admin/papers/${paperId}/questions`, data).then((r) => r.data),
  updatePaperQuestion: (paperId: number, questionId: number, data: unknown) =>
    api.put(`/admin/papers/${paperId}/questions/${questionId}`, data).then((r) => r.data),
  deletePaperQuestion: (paperId: number, questionId: number) =>
    api.delete(`/admin/papers/${paperId}/questions/${questionId}`).then((r) => r.data),
};
