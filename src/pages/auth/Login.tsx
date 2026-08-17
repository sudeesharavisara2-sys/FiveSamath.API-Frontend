import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import AuthLayout from "./AuthLayout";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";

export default function Login() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await login({ email, password });
      toast.success(`Welcome back, ${res.name}!`);
      navigate(res.role === "Admin" ? "/admin" : res.role === "Parent" ? "/parent" : "/");
    } catch (err: any) {
      toast.error(err?.response?.data ?? t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t.auth.login}>
      <form onSubmit={handleSubmit}>
        <TextField
          label={t.auth.email}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label={t.auth.password}
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          {t.auth.login}
        </Button>
      </form>
      <p className="text-center text-sm text-ink/50 font-medium mt-5">
        {t.auth.noAccount}{" "}
        <Link to="/register" className="text-sky-dark font-bold">
          {t.auth.register}
        </Link>
      </p>
    </AuthLayout>
  );
}
