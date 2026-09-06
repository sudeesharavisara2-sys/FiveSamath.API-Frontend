import api from "./api";
import type { Subject, Lesson, Chapter } from "../types";

export const learningService = {
  getSubjects: () => api.get<Subject[]>("/subjects").then((r) => r.data),

  getLessonsBySubject: (subjectId: number, gradeId?: number) =>
    api
      .get<Lesson[]>(`/lessons/subject/${subjectId}`, {
        params: { gradeId },
      })
      .then((r) => r.data),

  getLesson: (lessonId: number) =>
    api.get<Lesson>(`/lessons/${lessonId}`).then((r) => r.data),

  getChaptersByLesson: (lessonId: number) =>
    api.get<Chapter[]>(`/chapters/lesson/${lessonId}`).then((r) => r.data),

  getChapterDetails: (chapterId: number) =>
    api.get<Chapter>(`/chapters/${chapterId}`).then((r) => r.data),

  completeChapter: (chapterId: number) =>
    api
      .post<{
        message: string;
        xpEarned: number;
        chapterXp?: number;
        lessonXp?: number;
        isLessonCompleted?: boolean;
        isAlreadyCompleted?: boolean;
        totalXP?: number;
        level?: number;
      }>(`/chapters/${chapterId}/complete`)
      .then((r) => r.data),
};
