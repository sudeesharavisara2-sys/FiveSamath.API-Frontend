# FiveSamath Frontend

React + TypeScript + Vite frontend for the FiveSamath gamified learning platform.

## Student experience

The student dashboard includes XP, levels, streaks, daily challenges, badges, grade-specific subjects, free lesson selection, sequential chapter progression, learning materials, videos, animation scenes, checkpoint quizzes, papers, online paper attempts and leaderboard views. English, Sinhala and Tamil UI resources are included.

## Parent experience

Parents can securely link student accounts and view child learning analytics. The backend enforces that a parent can only access linked children.

## Admin experience

`/admin` manages grades, subjects, lessons, chapters and exam papers. `/admin/content` is the Content Studio for uploading/attaching learning materials, creating animation scenes, creating chapter quizzes/questions and adding online paper questions.

## Setup

```powershell
npm ci
copy .env.example .env
npm run dev
```

`.env`:

```text
VITE_API_BASE_URL=http://localhost:5153/api
```

## Verification

```powershell
./scripts/test-all.ps1
```

or:

```bash
./scripts/test-all.sh
```

The project should be installed fresh with `npm ci`; do not copy `node_modules` between operating systems because Vite/Oxlint use platform-specific optional native packages.
