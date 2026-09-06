// ===== Auth / User =====
export type UserRole = "Student" | "Parent" | "Admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  gradeId?: number;
  avatar?: string;
  totalXP?: number;
  level?: number;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: UserRole;
  gradeId?: number;
  avatar?: string;
  totalXP?: number;
  level?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
  gradeId?: number;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

// ===== Grades & Subjects =====
export interface Grade {
  id: number;
  name: string;
  displayName: string;
  orderNumber: number;
  isActive: boolean;
}

export interface Subject {
  id: number;
  name: string;
  icon: string;
  description: string;
  gradeIds?: number[];
  grades?: Grade[];
}

export interface CreateSubjectRequest {
  name: string;
  description: string;
  icon: string;
  gradeIds: number[];
}

export type UpdateSubjectRequest = CreateSubjectRequest;

export interface TextBook {
  id: number;
  gradeId: number;
  gradeName?: string;
  subjectId: number;
  subjectName?: string;
  title: string;
  description: string;
  pdfUrl: string;
  thumbnailUrl?: string;
  orderNumber: number;
  isPublished: boolean;
}

// ===== Lessons & Chapters =====
export interface Lesson {
  id: number;
  gradeId: number;
  subjectId: number;
  title: string;
  description: string;
  orderNumber: number;
  xpReward: number;
  isPublished: boolean;
  isCompleted?: boolean;
  totalChaptersCount?: number;
  completedChaptersCount?: number;
}

export interface Chapter {
  id: number;
  lessonId: number;
  subjectId?: number;
  gradeId?: number;
  title: string;
  summary: string;
  content: string;
  orderNumber: number;
  xpReward: number;
  isPublished: boolean;
  isUnlocked?: boolean;
  isCompleted?: boolean;
  hasQuiz?: boolean;
  quizId?: number;
  materials?: LearningMaterial[];
  animations?: Animation[];
}

// ===== Learning Materials & Animations =====
export type MaterialType = "Pdf" | "Video" | "Note" | "Image" | "Animation" | "Link" | "Download";

export interface LearningMaterial {
  id: number;
  chapterId: number;
  title: string;
  description: string;
  materialType: MaterialType;
  fileUrl?: string;
  externalUrl?: string;
  textContent?: string;
  thumbnailUrl?: string;
  orderNumber: number;
  isPublished: boolean;
}

export interface Animation {
  id: number;
  chapterId: number;
  title: string;
  description: string;
  backgroundUrl?: string;
  isPublished: boolean;
  scenes: AnimationScene[];
}

export interface AnimationScene {
  id: number;
  animationId: number;
  orderNumber: number;
  textContent: string;
  imageUrl?: string;
  durationSeconds: number;
  transitionType: string;
  narrationUrl?: string;
}

// ===== Quiz =====
export interface Quiz {
  id: number;
  chapterId: number;
  title: string;
  description: string;
  passMarkPercentage: number;
  xpReward: number;
  questions: Question[];
}

export type OptionKey = "A" | "B" | "C" | "D";

export interface Question {
  id: number;
  quizId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer?: string; // Only present in admin context; omitted in sanitized student DTOs
  imageUrl?: string;
  orderNumber: number;
}

export interface UserQuestionAnswer {
  questionId: number;
  selectedAnswer: string;
}

export interface SubmitQuizRequest {
  quizId: number;
  answers: UserQuestionAnswer[];
}

export interface QuizResultResponse {
  quizId: number;
  score: number;
  total?: number; // alias for totalQuestions (legacy)
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  xpEarned: number;
  xp?: number; // alias for xpEarned (legacy)
  nextChapterUnlocked: boolean;
  message: string;
  feedback: QuestionFeedback[];
}

// Backward-compatible alias used by legacy quiz components
export type SubmitQuizResponse = QuizResultResponse;

export interface QuestionFeedback {
  questionId: number;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

// ===== Exam Papers =====
export interface Paper {
  id: number;
  gradeId: number;
  gradeName?: string;
  subjectId: number;
  subjectName?: string;
  title: string;
  description: string;
  year: number;
  term: string;
  paperType: string;
  durationMinutes: number;
  totalMarks: number;
  pdfUrl?: string;
  thumbnailUrl?: string;
  isDownloadable: boolean;
  isOnlineAttemptEnabled: boolean;
  totalQuestions?: number;
}

export interface PaperQuestion {
  id: number;
  paperId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  imageUrl?: string;
  marks: number;
  orderNumber: number;
}

export interface PaperUserAnswer {
  paperQuestionId: number;
  selectedAnswer: string;
}

export interface SubmitPaperAttemptRequest {
  paperId: number;
  timeTakenSeconds: number;
  answers: PaperUserAnswer[];
}

export interface PaperAttemptResult {
  attemptId: number;
  paperId: number;
  paperTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTakenSeconds: number;
  submittedAt: string;
  feedback: PaperQuestionFeedback[];
}

export interface PaperQuestionFeedback {
  questionId: number;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  marksObtained: number;
  explanation: string;
}

// ===== Gamification =====
export interface Badge {
  badgeId?: number;
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
  isCompleted?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  avatar: string;
  totalXP: number;
  level: number;
  isCurrentUser: boolean;
}

// ===== Parent =====
export interface LinkedChild {
  studentId: number;
  name: string;
  email: string;
  gradeName: string;
  avatar: string;
  totalXP: number;
  level: number;
}

export interface ParentChildAnalytics {
  studentId: number;
  name: string;
  gradeName: string;
  avatar: string;
  totalXP: number;
  level: number;
  currentStreak: number;
  completedLessonsCount: number;
  completedChaptersCount: number;
  totalQuizzesTaken: number;
  averageQuizScore: number;
  totalPaperAttempts: number;
  averagePaperScore: number;
  badges: Badge[];
  subjectProgress: SubjectProgressSummary[];
}

export interface SubjectProgressSummary {
  subjectId: number;
  subjectName: string;
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

// ===== Progress / Analytics =====
export interface DashboardProgress {
  id: number;
  name: string;
  email: string;
  role: string;
  gradeId?: number;
  gradeName: string;
  avatar: string;
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
  currentStreak: number;
  completedLessonsCount: number;
  completedChaptersCount: number;
  totalLessonsCount: number;
  overallProgressPct: number;
  badgesCount: number;
}

export interface AdminStats {
  totalStudents: number;
  totalParents: number;
  totalGrades: number;
  totalSubjects: number;
  totalLessons: number;
  totalChapters: number;
  totalQuizzes: number;
  totalPapers: number;
  totalQuizAttempts: number;
  averageQuizScore: number;
}

export interface StudentAnalytics {
  totalXP: number;
  level: number;
  currentStreak: number;
  completedLessonsCount: number;
  completedChaptersCount: number;
  totalQuizzesTaken: number;
  averageQuizScore: number;
  totalPaperAttempts: number;
  averagePaperScore: number;
  badges: Badge[];
  subjectProgress: SubjectProgressSummary[];
}


// ===== Notifications =====
export interface AppNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

// ===== AI Tutor =====
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
