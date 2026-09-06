import api from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
} from "../types";

export const authService = {
  register: (data: RegisterRequest) =>
    api.post<{ message: string; email: string }>("/auth/register", data).then((r) => r.data),

  verifyOtp: (data: VerifyOtpRequest) =>
    api.post<{ message: string }>("/auth/verify-otp", data).then((r) => r.data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),

  getCurrentUser: () =>
    api.get<AuthResponse>("/auth/me").then((r) => r.data),
};
