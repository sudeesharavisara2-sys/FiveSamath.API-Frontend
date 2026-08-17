import api from "./api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
} from "../types";

export const authService = {
  register: (data: RegisterRequest) =>
    api.post<string>("/auth/register", data).then((r) => r.data),

  verifyOtp: (data: VerifyOtpRequest) =>
    api.post<string>("/auth/verify-otp", data).then((r) => r.data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data),
};
