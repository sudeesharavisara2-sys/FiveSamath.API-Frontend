import { useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import AuthLayout from "./AuthLayout";
import InputField from "../../components/common/InputField";
import Button from "../../components/common/Button";

const OTP_LENGTH = 6;

function OtpBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = value.split("").concat(Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (i: number, d: string) => {
    const clean = d.replace(/\D/g, "").slice(-1);
    const next = digits.slice();
    next[i] = clean;
    onChange(next.join(""));
    if (clean && i < OTP_LENGTH - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    onChange(pasted);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  return (
    <div className="flex justify-center gap-2.5 mb-5" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <motion.input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 * i }}
          value={d}
          inputMode="numeric"
          maxLength={1}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={`h-14 w-11 text-center text-2xl font-extrabold rounded-2xl border-2 focus:outline-none transition-colors ${
            d ? "border-sky bg-sky/5 text-sky-dark" : "border-ink/10 text-ink"
          } focus:border-sky`}
        />
      ))}
    </div>
  );
}

export default function VerifyOtp() {
  const { t } = useLanguage();
  const { verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [email, setEmail] = useState(params.get("email") ?? "");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) {
      toast.error("Enter the full 6-digit code");
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.success("Email verified! You can log in now. ✅");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data ?? t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t.auth.otpTitle} subtitle={t.auth.otpSubtitle}>
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", delay: 0.1 }}
        className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-grass to-sky flex items-center justify-center text-white shadow-lg mb-5"
      >
        <ShieldCheck size={26} />
      </motion.div>

      <form onSubmit={handleSubmit}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <InputField
            label={t.auth.email}
            icon={Mail}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </motion.div>

        <span className="text-sm font-bold text-ink/60 mb-1.5 block">OTP Code</span>
        <OtpBoxes value={otp} onChange={setOtp} />

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Button type="submit" variant="gradient" isLoading={isLoading} className="w-full mt-2">
            <ShieldCheck size={18} /> {t.auth.verify}
          </Button>
        </motion.div>
      </form>
    </AuthLayout>
  );
}