import api from "./api";
import type { AdminStats, Chapter, Lesson, Subject, TextBook } from "../types";

export const adminService = {
  getStats: () => api.get<AdminStats>("/admin/stats").then((r) => r.data),

  // Subjects (GET is available at /api/Subjects)
  getSubjects: () => api.get<Subject[]>("/Subjects").then((r) => r.data),
  createSubject: (subject: Partial<Subject>) =>
    api.post<Subject>("/Admin/subjects", subject).then((r) => r.data),
  updateSubject: (id: number, subject: Partial<Subject>) =>
    api.put<Subject>(`/Admin/subjects/${id}`, subject).then((r) => r.data),
  deleteSubject: (id: number) =>
    api.delete(`/Admin/subjects/${id}`).then((r) => r.data),

  // TextBooks (GET via /api/Learning/textbooks/{subjectId})
  getTextBooksBySubject: (subjectId: number) =>
    api.get<TextBook[]>(`/Learning/textbooks/${subjectId}`).then((r) => r.data),
  createTextBook: (book: Partial<TextBook>) =>
    api.post<TextBook>("/Admin/textbooks", book).then((r) => r.data),
  updateTextBook: (id: number, book: Partial<TextBook>) =>
    api.put<TextBook>(`/Admin/textbooks/${id}`, book).then((r) => r.data),
  deleteTextBook: (id: number) =>
    api.delete(`/Admin/textbooks/${id}`).then((r) => r.data),

  // Chapters (GET via /api/Learning/chapters/{bookId})
  getChaptersByBook: (bookId: number) =>
    api.get<Chapter[]>(`/Learning/chapters/${bookId}`).then((r) => r.data),
  createChapter: (chapter: Partial<Chapter>) =>
    api.post<Chapter>("/Admin/chapters", chapter).then((r) => r.data),
  updateChapter: (id: number, chapter: Partial<Chapter>) =>
    api.put<Chapter>(`/Admin/chapters/${id}`, chapter).then((r) => r.data),
  deleteChapter: (id: number) =>
    api.delete(`/Admin/chapters/${id}`).then((r) => r.data),

  // Lessons
  getLessons: () => api.get<Lesson[]>("/Lessons").then((r) => r.data),
  createLesson: (lesson: Partial<Lesson>) =>
    api.post<Lesson>("/Admin/lessons", lesson).then((r) => r.data),
  updateLesson: (id: number, lesson: Partial<Lesson>) =>
    api.put<Lesson>(`/Admin/lessons/${id}`, lesson).then((r) => r.data),
  deleteLesson: (id: number) =>
    api.delete(`/Admin/lessons/${id}`).then((r) => r.data),
};