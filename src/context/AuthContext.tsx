import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { beginIntentionalLogout, resetIntentionalLogout, TOKEN_KEY, USER_KEY } from "../services/api";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<{ message: string; email: string }>;
  verifyOtp: (email: string, otp: string) => Promise<{ message: string }>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    resetIntentionalLogout();
    const res = await authService.login(data);
    const loggedInUser: User = {
      id: res.id,
      name: res.name,
      email: res.email || data.email,
      role: res.role,
      gradeId: res.gradeId,
      avatar: res.avatar || "avatar-1.png",
      totalXP: res.totalXP || 0,
      level: res.level || 1,
    };
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    setToken(res.token);
    setUser(loggedInUser);
    return res;
  };

  const register = (data: RegisterRequest) => authService.register(data);

  const verifyOtp = (email: string, otp: string) => authService.verifyOtp({ email, otp });

  const logout = async () => {
    beginIntentionalLogout();
    const privateQueryKeys = new Set([
      "analytics",
      "streak",
      "badges",
      "daily-challenge",
      "subjects",
      "quiz",
      "leaderboard",
      "student-textbooks",
      "admin-stats",
      "admin-grades",
      "admin-lessons",
      "admin-papers",
      "admin-chapters",
      "admin-subjects",
      "admin-textbooks",
    ]);
    const isPrivateQuery = (query: { queryKey: readonly unknown[] }) =>
      typeof query.queryKey[0] === "string" && privateQueryKeys.has(query.queryKey[0]);

    await queryClient.cancelQueries({ predicate: isPrivateQuery });
    queryClient.removeQueries({ predicate: isPrivateQuery });
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const newUser = { ...prev, ...updated };
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, verifyOtp, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
