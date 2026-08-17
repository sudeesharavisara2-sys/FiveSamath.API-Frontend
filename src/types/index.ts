// ===== Auth / User =====
export type UserRole = "Student" | "Parent" | "Admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

// ===== Learning content =====
export interface Subject {
  id: number;
  name: string;
}

export interface TextBook {
  id: number;
  subjectId: number;
  grade: string;
  title: string;
  coverImageUrl: string;
}

export interface Chapter {
  id: number;
  textBookId: number;
  title: string;
  orderNumber: number;
}

export interface Lesson {
  id: number;
  chapterId: number;
  title: string;
  content: string;
  videoUrl?: string;
  animationUrl?: string;
  xpReward: number;
  hasQuiz: boolean;
  orderNumber: number;
}

export interface LessonStatus {
  id: number;
  title: string;
  orderNumber: number;
  isUnlocked: boolean;
  isCompleted: boolean;
}

// ===== Quiz =====
export interface Quiz {
  id: number;
  lessonId: number;
  title: string;
}

export interface Question {
  id: number;
  quizId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer?: string; // never trust this on the client; backend grades
  imageUrl?: string;
}

export type OptionKey = "A" | "B" | "C" | "D";

export interface QuizBundle {
  quiz: Quiz;
  questions: Question[];
}

export interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
}

export interface SubmitQuizRequest {
  quizId: number;
  userId: number;
  answers: UserAnswer[];
}

export interface SubmitQuizResponse {
  score: number;
  total: number;
  xp: number;
}

// ===== Gamification =====
export interface Badge {
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
}

export interface StreakResponse {
  currentStreak: number;
}

export interface DailyChallenge {
  id: number;
  title: string;
  description: string;
  quizId: number;
  rewardXP: number;
  challengeDate: string;
}

export interface LeaderboardEntry {
  userId: number;
  name: string;
  totalXP: number;
  totalMarks: number;
}

// ===== Progress / Analytics =====
export interface StudentAnalytics {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  totalQuizzes: number;
  averageMarks: number;
  totalXP: number;
}

export interface AdminStats {
  totalStudents: number;
  totalQuizzes: number;
  averageScore: number;
}

// ===== Notifications =====
export interface AppNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: "Daily" | "Achievement" | "System" | "Quiz" | string;
  isRead: boolean;
  createdAt: string;
}

// ===== AI Tutor / Practice generation =====
export interface AskQuestionRequest {
  question: string;
}

export interface GenerateQuizRequest {
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questionCount: number;
}

// ===== i18n =====
export type Language = "en" | "si" | "ta";
