import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import AuthLayout from "./AuthLayout";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";

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
    setIsLoading(true);
    try {
      await verifyOtp(email, otp);
      toast.success("Email verified! You can log in now.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err?.response?.data ?? t.common.error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t.auth.otpTitle} subtitle={t.auth.otpSubtitle}>
      <form onSubmit={handleSubmit}>
        <TextField
          label={t.auth.email}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="OTP Code"
          required
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="tracking-[0.5em] text-center text-xl"
        />
        <Button type="submit" isLoading={isLoading} className="w-full mt-2">
          {t.auth.verify}
        </Button>
      </form>
    </AuthLayout>
  );
}
