import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authService } from "../services/authService";
import { TOKEN_KEY, USER_KEY } from "../services/api";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<AuthResponse>;
  register: (data: RegisterRequest) => Promise<string>;
  verifyOtp: (email: string, otp: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await authService.login(data);
    const loggedInUser: User = { id: res.id, name: res.name, email: data.email, role: res.role };
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    setToken(res.token);
    setUser(loggedInUser);
    return res;
  };

  const register = (data: RegisterRequest) => authService.register(data);

  const verifyOtp = (email: string, otp: string) => authService.verifyOtp({ email, otp });

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
