import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";

import StudentDashboard from "./pages/student/Dashboard";
import SubjectBrowser from "./pages/student/SubjectBrowser";
import ChapterView from "./pages/student/ChapterView";
import Papers from "./pages/student/Papers";
import PaperAttempt from "./pages/student/PaperAttempt";
import Practice from "./pages/student/Practice";
import Leaderboard from "./pages/student/Leaderboard";

import ParentDashboard from "./pages/parent/ParentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ContentStudio from "./pages/admin/ContentStudio";
import Textbooks from "./pages/admin/Textbooks";
import LandingPage from "./pages/public/LandingPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* App shell */}
      <Route element={<Layout />}>
        {/* Student routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute roles={["Student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/:subjectId"
          element={
            <ProtectedRoute roles={["Student"]}>
              <SubjectBrowser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chapter/:chapterId"
          element={
            <ProtectedRoute roles={["Student"]}>
              <ChapterView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mock-exam"
          element={
            <ProtectedRoute roles={["Student"]}>
              <Papers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/papers/:paperId/attempt"
          element={
            <ProtectedRoute roles={["Student"]}>
              <PaperAttempt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice/:quizId?"
          element={
            <ProtectedRoute roles={["Student"]}>
              <Practice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute roles={["Student"]}>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        {/* Parent routes */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute roles={["Parent"]}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <ContentStudio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/textbooks"
          element={<ProtectedRoute roles={["Admin"]}><Textbooks /></ProtectedRoute>}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
