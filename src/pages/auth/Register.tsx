import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { UserPlus, User, Mail, Lock, Check, GraduationCap, RefreshCw } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import AuthLayout from "../../components/auth/AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useGrades } from "../../hooks/useStudentDashboard";
import type { Grade } from "../../types";
import { getDashboardPath } from "../../utils/navigation";

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function PasswordStrength({ password, labels }: { password: string; labels: string[] }) {
  const score =
    (password.length >= 6 ? 1 : 0) +
    (password.length >= 10 ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0);

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
  const { register, user, isLoading: authLoading } = useAuth();
  const { data: grades = [], isLoading: gradesLoading, isError: gradesFailed, refetch } = useGrades();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedGradeId, setSelectedGradeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate(getDashboardPath(user.role), { replace: true });
  }, [authLoading, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error(t.auth.passwordTooShort);
      return;
    }

    if (!selectedGradeId) {
      toast.error(t.auth.chooseGradeError);
      return;
    }

    setIsLoading(true);

    try {
      await register({ name: name.trim(), email: email.trim().toLowerCase(), password, role: "Student", gradeId: selectedGradeId });

      toast.success(t.auth.otpSent);
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const responseData = (err as { response?: { data?: { message?: string; title?: string } | string } }).response?.data;
      toast.error(typeof responseData === "string" ? responseData : responseData?.message || responseData?.title || t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t.auth.registerTitle} subtitle={t.auth.registerSubtitle}>
      <form onSubmit={handleSubmit}>
        <motion.div variants={fieldVariants} initial="hidden" animate="show" custom={0}>
          <InputField label={t.auth.name} icon={User} placeholder={t.auth.namePlaceholder} required value={name} onChange={(e) => setName(e.target.value)} />
        </motion.div>

        <motion.div variants={fieldVariants} initial="hidden" animate="show" custom={1}>
          <InputField
            label={t.auth.email}
            icon={Mail}
            type="email"
            placeholder={t.auth.emailPlaceholder}
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
            placeholder={t.auth.passwordPlaceholder}
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </motion.div>

        <AnimatePresence>
          {password && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <PasswordStrength password={password} labels={[t.auth.passwordShort, t.auth.passwordWeak, t.auth.passwordOkay, t.auth.passwordGood, t.auth.passwordStrong]} />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.fieldset variants={fieldVariants} initial="hidden" animate="show" custom={3} className="mb-5">
          <legend className="text-sm font-bold text-ink/70 mb-2 flex items-center gap-2"><GraduationCap size={17} className="text-sky-dark" /> {t.auth.chooseGrade}</legend>
          {gradesLoading ? (
            <div className="grid grid-cols-3 gap-2" aria-label={t.common.loading}>{[0, 1, 2].map((item) => <div key={item} className="h-12 rounded-xl bg-ink/5 animate-pulse" />)}</div>
          ) : gradesFailed ? (
            <div className="rounded-2xl bg-coral/10 border border-coral/20 p-3 flex items-center justify-between gap-3 text-sm font-semibold text-ink/75"><span>{t.auth.unableToLoadGrades}</span><button type="button" onClick={() => refetch()} className="shrink-0 inline-flex items-center gap-1 text-coral font-extrabold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-coral rounded"><RefreshCw size={14} /> {t.auth.tryAgain}</button></div>
          ) : grades.length === 0 ? (
            <p className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-sm font-semibold text-amber-800">{t.auth.noActiveGrades}</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label={t.auth.chooseGrade}>
              {grades.map((grade: Grade) => {
                const selected = selectedGradeId === grade.id;
                return <button key={grade.id} type="button" role="radio" aria-checked={selected} onClick={() => setSelectedGradeId(grade.id)} className={`min-h-12 rounded-xl border-2 px-3 py-2 text-sm font-extrabold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky focus-visible:ring-offset-2 ${selected ? "border-sky-dark bg-sky text-white shadow-sm" : "border-ink/10 bg-white text-ink hover:border-sky/50"}`}><span>{grade.displayName || grade.name}</span>{selected && <span className="ml-1.5" aria-hidden="true">✓</span>}</button>;
              })}
            </div>
          )}
        </motion.fieldset>

        <motion.div variants={fieldVariants} initial="hidden" animate="show" custom={4}>
          <Button type="submit" variant="gradient" isLoading={isLoading} disabled={gradesLoading || gradesFailed || grades.length === 0} className="w-full mt-2">
            <UserPlus size={18} /> {isLoading ? t.auth.creatingAccount : t.auth.createAccount}
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
          {t.auth.signIn}
        </Link>
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-1.5 justify-center text-xs text-ink/30 font-semibold mt-3"
      >
        <Check size={13} className="text-grass-dark" /> {t.auth.studentSafety}
      </motion.div>
    </AuthLayout>
  );
}
