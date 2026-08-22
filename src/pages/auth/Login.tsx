import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import AuthLayout from "./AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

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
      toast.success(`Welcome back, ${res.name}! 🎉`);
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
        <motion.div variants={fieldVariants} initial="hidden" animate="show" custom={0}>
          <InputField
            label={t.auth.email}
            icon={Mail}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>

        <motion.div variants={fieldVariants} initial="hidden" animate="show" custom={1}>
          <InputField
            label={t.auth.password}
            icon={Lock}
            isPassword
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </motion.div>

        <motion.div variants={fieldVariants} initial="hidden" animate="show" custom={2}>
          <Button type="submit" variant="gradient" isLoading={isLoading} className="w-full mt-2">
            <LogIn size={18} /> {t.auth.login}
          </Button>
        </motion.div>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-sm text-ink/50 font-medium mt-5"
      >
        {t.auth.noAccount}{" "}
        <Link to="/register" className="text-sky-dark font-bold hover:underline">
          {t.auth.register}
        </Link>
      </motion.p>
    </AuthLayout>
  );
}