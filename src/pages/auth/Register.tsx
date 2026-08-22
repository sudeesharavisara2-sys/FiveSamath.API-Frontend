import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { UserPlus, User, Mail, Lock, Check } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import AuthLayout from "./AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";

const API_URL = "http://localhost:5153/api";

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function PasswordStrength({ password }: { password: string }) {
  const score =
    (password.length >= 6 ? 1 : 0) +
    (password.length >= 10 ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0);

  const labels = ["Too short", "Weak", "Okay", "Good", "Strong"];
  const colors = ["bg-coral", "bg-coral", "bg-sunshine-dark", "bg-grass", "bg-grass-dark"];

  if (!password) return null;

  return (
    <div className="-mt-2 mb-4">
      <div className="flex gap-1.5 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < score ? colors[score] : "bg-ink/10"}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: i * 0.05 }}
            style={{ transformOrigin: "left" }}
          />
        ))}
      </div>
      <p className="text-xs font-semibold text-ink/40">{labels[score]}</p>
    </div>
  );
}

export default function Register() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Attempting registration with:", {
        name,
        email,
        passwordLength: password.length,
      });

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const responseText = await response.text();
      console.log("Response status:", response.status);
      console.log("Response body:", responseText);

      if (!response.ok) {
        let errorMessage = responseText;
        try {
          const errorJson = JSON.parse(responseText);
          errorMessage = errorJson.message || errorJson.title || errorJson || responseText;
        } catch {
          errorMessage = responseText || "Registration failed";
        }
        throw new Error(errorMessage);
      }

      toast.success("OTP sent to your email!");
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(err.message || t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t.auth.register}>
      <form onSubmit={handleSubmit}>
        <motion.div variants={fieldVariants} initial="hidden" animate="show" custom={0}>
          <InputField label={t.auth.name} icon={User} required value={name} onChange={(e) => setName(e.target.value)} />
        </motion.div>

        <motion.div variants={fieldVariants} initial="hidden" animate="show" custom={1}>
          <InputField
            label={t.auth.email}
            icon={Mail}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>

        <motion.div variants={fieldVariants} initial="hidden" animate="show" custom={2}>
          <InputField
            label={t.auth.password}
            icon={Lock}
            isPassword
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </motion.div>

        <AnimatePresence>
          {password && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <PasswordStrength password={password} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={fieldVariants} initial="hidden" animate="show" custom={3}>
          <Button type="submit" variant="gradient" isLoading={isLoading} className="w-full mt-2">
            <UserPlus size={18} /> {t.auth.register}
          </Button>
        </motion.div>
      </form>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-center text-sm text-ink/50 font-medium mt-5"
      >
        {t.auth.haveAccount}{" "}
        <Link to="/login" className="text-sky-dark font-bold hover:underline">
          {t.auth.login}
        </Link>
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-1.5 justify-center text-xs text-ink/30 font-semibold mt-3"
      >
        <Check size={13} className="text-grass-dark" /> Free to join, no ads, kid-safe
      </motion.div>
    </AuthLayout>
  );
}