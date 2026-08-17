# FiveSamath Frontend (5 සමත්)

React + Vite + TypeScript frontend for the FiveSamath.API Grade 5 Scholarship platform.

## Stack
React 19 (Vite) · Tailwind CSS v4 · Framer Motion · TanStack Query · Axios · React Router · Lucide Icons

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL if not localhost:5000
npm run dev
```

## Structure

```
src/
  components/   layout (Navbar/Layout), dashboard, quiz engine, admin CRUD, common UI
  pages/        auth, student, parent, admin
  services/     one file per backend controller (axios calls)
  context/      AuthContext (JWT), LanguageContext (EN/SI/TA)
  hooks/        React Query hooks
  types/        TS interfaces matching backend Models/DTOs
  locales/      en.ts / si.ts / ta.ts translation dictionaries
```

## Known backend gaps (found while building)

These aren't frontend bugs — the frontend is coded defensively around them,
but the backend needs follow-up work for full correctness:

1. **Lesson to Quiz lookup**: `QuizController.GetQuiz(quizId)` takes a raw quiz
   id, but `Lesson` has no `QuizId` field to look one up from. The frontend
   currently assumes `quizId == lessonId` by seed convention
   (`src/pages/student/SubjectBrowser.tsx`). Add a `QuizId` FK on `Lesson`
   (or a `/learning/lesson/{id}/quiz` endpoint) to make this reliable.
2. **Parent role has no linked student**: `Parent` accounts log in like
   anyone else, but there's no `ParentId -> StudentId` relationship, so
   `/progress/analytics` (JWT-scoped) can't return a child's data, only
   the signed-in account's own. `ParentDashboard.tsx` calls this out.
3. **Admin User CRUD**: `AdminController` has Subject/TextBook/Chapter/Lesson
   CRUD but no endpoints for managing `User` accounts, despite the spec
   asking for "CRUD management for ... User accounts."
4. **Per-quiz history**: `ProgressController.GetAnalytics` only returns
   aggregates (totalQuizzes, averageMarks...), not a list of individual
   `Result` rows, so a "history of completed quizzes and exam scores" table
   isn't buildable yet.
5. **Answer correctness leaks to client on `GET /quiz/{id}`**: `Question.CorrectAnswer`
   is returned to the browser before submission, which is fine for practice's
   instant-feedback mode (which relies on it) but means a curious student can
   read answers from the network tab in exam mode. Consider a stripped DTO
   for the exam flow.

## Auth flow
Register -> OTP email -> Verify OTP -> Login -> JWT stored in localStorage,
attached via Axios interceptor, 401 responses force logout.
