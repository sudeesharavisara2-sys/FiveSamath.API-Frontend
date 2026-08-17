import api from "./api";
import type { Chapter, Lesson, LessonStatus, Subject, TextBook } from "../types";

export const learningService = {
  getSubjects: () => api.get<Subject[]>("/learning/subjects").then((r) => r.data),

  getTextBooks: (subjectId: number) =>
    api.get<TextBook[]>(`/learning/textbooks/${subjectId}`).then((r) => r.data),

  getChapters: (bookId: number) =>
    api.get<Chapter[]>(`/learning/chapters/${bookId}`).then((r) => r.data),

  getLessons: (chapterId: number) =>
    api.get<Lesson[]>(`/learning/lessons/${chapterId}`).then((r) => r.data),

  getLesson: (lessonId: number) =>
    api.get<Lesson>(`/learning/lesson/${lessonId}`).then((r) => r.data),

  getLessonStatus: (chapterId: number) =>
    api.get<LessonStatus[]>(`/progress/lesson-status/${chapterId}`).then((r) => r.data),
};
