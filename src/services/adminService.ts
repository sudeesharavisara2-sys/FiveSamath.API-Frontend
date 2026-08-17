import api from "./api";
import type { AdminStats, Chapter, Lesson, Subject, TextBook } from "../types";

export const adminService = {
  getStats: () => api.get<AdminStats>("/admin/stats").then((r) => r.data),

  // Subjects
  createSubject: (subject: Partial<Subject>) =>
    api.post<Subject>("/admin/subjects", subject).then((r) => r.data),
  updateSubject: (id: number, subject: Partial<Subject>) =>
    api.put<Subject>(`/admin/subjects/${id}`, subject).then((r) => r.data),
  deleteSubject: (id: number) => api.delete(`/admin/subjects/${id}`).then((r) => r.data),

  // TextBooks
  createTextBook: (book: Partial<TextBook>) =>
    api.post<TextBook>("/admin/textbooks", book).then((r) => r.data),
  updateTextBook: (id: number, book: Partial<TextBook>) =>
    api.put<TextBook>(`/admin/textbooks/${id}`, book).then((r) => r.data),
  deleteTextBook: (id: number) => api.delete(`/admin/textbooks/${id}`).then((r) => r.data),

  // Chapters
  createChapter: (chapter: Partial<Chapter>) =>
    api.post<Chapter>("/admin/chapters", chapter).then((r) => r.data),
  updateChapter: (id: number, chapter: Partial<Chapter>) =>
    api.put<Chapter>(`/admin/chapters/${id}`, chapter).then((r) => r.data),
  deleteChapter: (id: number) => api.delete(`/admin/chapters/${id}`).then((r) => r.data),

  // Lessons
  getLessons: () => api.get<Lesson[]>("/lessons").then((r) => r.data),
  createLesson: (lesson: Partial<Lesson>) =>
    api.post<Lesson>("/admin/lessons", lesson).then((r) => r.data),
  updateLesson: (id: number, lesson: Partial<Lesson>) =>
    api.put<Lesson>(`/admin/lessons/${id}`, lesson).then((r) => r.data),
  deleteLesson: (id: number) => api.delete(`/admin/lessons/${id}`).then((r) => r.data),
};
