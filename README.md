# FiveSamath Frontend (5 සමත්)

A responsive, kid-friendly, and animated React frontend for **FiveSamath.API**, a Sri Lankan Grade 5 Scholarship learning platform.

The application provides separate experiences for **Students, Parents, and Administrators**, with multilingual support, quizzes, progress tracking, gamification, and content management.

## 🚀 Tech Stack

| Category         | Technology                   |
| ---------------- | ---------------------------- |
| Framework        | React 19 + Vite + TypeScript |
| Styling          | Tailwind CSS v4              |
| Animations       | Framer Motion                |
| Data Fetching    | TanStack Query (React Query) |
| HTTP Client      | Axios                        |
| Routing          | React Router v6              |
| Icons            | Lucide React                 |
| Notifications    | react-hot-toast              |
| State Management | React Context API            |
| Authentication   | JWT                          |

## 📋 Prerequisites

Before running the project, make sure you have:

* Node.js installed
* npm installed
* FiveSamath.API backend running
* Access to the backend API URL

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd fivesamath-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Set the backend API URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start the development server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## 🏗️ Production Build

Create an optimized production build:

```bash
npm run build
```

The production files will be generated inside:

```text
dist/
```

To preview the production build locally:

```bash
npm run preview
```

## 🔐 Environment Variables

| Variable            | Default                     | Description                            |
| ------------------- | --------------------------- | -------------------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Base URL of the FiveSamath backend API |

## 📁 Project Structure

```text
src/
│
├── components/
│   ├── admin/
│   │   ├── CrudTable.tsx
│   │   └── ContentManager.tsx
│   │
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── InputField.tsx
│   │   ├── TextField.tsx
│   │   ├── Spinner.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── ProgressRing.tsx
│   │   ├── BadgeShelf.tsx
│   │   └── DailyChallengeCard.tsx
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Layout.tsx
│   │
│   └── quiz/
│       ├── QuizEngine.tsx
│       ├── QuestionCard.tsx
│       ├── QuestionNav.tsx
│       ├── Timer.tsx
│       ├── ProgressBar.tsx
│       └── ResultsModal.tsx
│
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── VerifyOtp.tsx
│   │   ├── ForgotPassword.tsx
│   │   ├── ResetPassword.tsx
│   │   └── AuthLayout.tsx
│   │
│   ├── student/
│   │   ├── Dashboard.tsx
│   │   ├── SubjectBrowser.tsx
│   │   ├── Practice.tsx
│   │   ├── MockExam.tsx
│   │   └── Leaderboard.tsx
│   │
│   ├── parent/
│   │   └── ParentDashboard.tsx
│   │
│   └── admin/
│       └── AdminDashboard.tsx
│
├── services/
│   ├── api.ts
│   ├── authService.ts
│   ├── learningService.ts
│   ├── quizService.ts
│   ├── gamificationService.ts
│   ├── progressService.ts
│   ├── notificationService.ts
│   ├── adminService.ts
│   └── parentService.ts
│
├── context/
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx
│
├── hooks/
│   └── useStudentDashboard.ts
│
├── types/
│   └── ...
│
├── locales/
│   ├── en.ts
│   ├── si.ts
│   └── ta.ts
│
└── index.css
```

## ✨ Features

### 👨‍🎓 Student

* Animated student dashboard
* XP and streak tracking
* Badge collection
* Progress tracking
* Subject, textbook, and chapter browsing
* Practice quizzes
* Instant answer feedback
* Timed mock examinations
* Question navigation
* Question flagging
* Automatic exam submission when the timer expires
* Leaderboard
* Daily challenges

### 👨‍👩‍👧 Parent

* Parent dashboard
* Student learning progress overview
* Accuracy statistics
* Lesson completion information

### 🛡️ Admin

* Admin dashboard
* Statistics overview
* Subject management
* Lesson management
* Textbook management
* Chapter management
* Cascading:

```text
Subject
   └── Textbook
         └── Chapter
```

* Reusable generic `CrudTable` component for CRUD operations
* Content management interface

### 🔑 Authentication

* User registration
* Email OTP verification
* Login
* JWT-based authentication
* JWT persistence using `localStorage`
* Axios authentication interceptor
* Automatic logout on `401 Unauthorized`
* Forgot password
* Reset password
* Protected routes
* Role-based navigation

### 🌍 Internationalization

The application supports three languages:

* 🇬🇧 English
* 🇱🇰 Sinhala
* 🇱🇰 Tamil

The selected language is persisted across sessions.

### 🎮 Gamification

* XP system
* Learning streaks
* Badges
* Daily challenges
* Monthly leaderboard
* Progress indicators

## 🔌 Backend API Integration

The frontend communicates with **FiveSamath.API** through dedicated service modules.

Each backend controller has a corresponding frontend service where appropriate:

```text
services/
├── api.ts
├── authService.ts
├── learningService.ts
├── quizService.ts
├── gamificationService.ts
├── progressService.ts
├── notificationService.ts
├── adminService.ts
└── parentService.ts
```

`api.ts` provides the shared Axios instance and JWT interceptor.

TanStack Query is used for server-state management, caching, loading states, and mutations.

## ⚠️ Known Backend Limitations

The following limitations are currently handled defensively by the frontend.

### 1. Lesson → Quiz Mapping

`QuizController.GetQuiz(quizId)` expects a quiz ID, while the `Lesson` model does not currently expose a `QuizId`.

The frontend currently assumes:

```text
quizId === lessonId
```

This follows the existing seed-data convention and is handled in:

```text
pages/student/SubjectBrowser.tsx
```

### 2. Parent → Student Relationship

The current backend does not provide a mechanism for a parent account to retrieve analytics for a linked child.

As a result, the parent dashboard currently works with the data available through the authenticated user's JWT scope.

Related frontend page:

```text
pages/parent/ParentDashboard.tsx
```

### 3. Admin User Management

The backend does not currently provide endpoints for administrator user CRUD operations.

Therefore, the User Management section in:

```text
pages/admin/AdminDashboard.tsx
```

is currently a placeholder.

### 4. Per-Quiz History

`ProgressController.GetAnalytics` currently provides aggregate progress information rather than individual `Result` records for each quiz attempt.

The frontend therefore cannot currently display complete per-quiz attempt history.

### 5. Correct Answer Exposure

The `GET /quiz/{id}` endpoint currently sends `Question.CorrectAnswer` to the client.

Practice mode uses this information to provide instant feedback.

However, exposing the correct answer to the client also means that it can be inspected through browser developer tools or network requests during a timed examination.

For a production system, correct answers should ideally remain server-side and be evaluated after submission.

## 🧩 Admin CRUD Architecture

The admin interface uses a reusable generic `CrudTable` component:

```text
components/admin/CrudTable.tsx
```

It is reused for:

* Subjects
* Lessons
* Textbooks
* Chapters

The component expects `onCreate` and `onUpdate` handlers to return promises.

Therefore, TanStack Query's:

```typescript
mutation.mutateAsync()
```

should be passed instead of:

```typescript
mutation.mutate()
```

This allows `CrudTable` to wait for the backend operation to complete and display an inline error when the request fails.

## 🛠️ Development Notes

The project follows a service-based frontend architecture:

```text
React Components
       ↓
React Query Hooks
       ↓
Service Layer
       ↓
Axios API Client
       ↓
FiveSamath.API
       ↓
Database
```

This separation keeps API communication outside the UI components and makes the application easier to maintain and extend.

## 📌 Future Improvements

Potential improvements include:

* Add parent → child account linking
* Add complete admin user management
* Move quiz answer validation completely to the backend
* Add detailed quiz attempt history
* Replace the lesson/quiz ID convention with an explicit `QuizId`
* Improve offline/loading/error handling
* Add automated frontend tests
* Add end-to-end testing
* Improve accessibility across all pages
* Add production deployment configuration

## 📄 License

This project was developed as part of an academic software engineering project.

---

**FiveSamath — 5 සමත්**

*A fun, interactive, and accessible learning platform for Sri Lankan Grade 5 Scholarship students.*
