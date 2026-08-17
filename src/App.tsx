import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";

import StudentDashboard from "./pages/student/Dashboard";
import Practice from "./pages/student/Practice";
import MockExam from "./pages/student/MockExam";
import Leaderboard from "./pages/student/Leaderboard";

import ParentDashboard from "./pages/parent/ParentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

export default function App() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* App shell */}
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <ProtectedRoute roles={["Student"]}>
              <StudentDashboard />
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
          path="/mock-exam/:quizId?"
          element={
            <ProtectedRoute roles={["Student"]}>
              <MockExam />
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

        <Route
          path="/parent"
          element={
            <ProtectedRoute roles={["Parent"]}>
              <ParentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
