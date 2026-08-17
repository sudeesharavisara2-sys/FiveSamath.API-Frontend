import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky/20 via-cream to-sunshine/20 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl border-4 border-white p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <span className="h-14 w-14 rounded-2xl bg-sky flex items-center justify-center text-white shadow-lg mb-3">
            <GraduationCap size={28} />
          </span>
          <h1 className="text-2xl font-extrabold">{t.appName}</h1>
        </div>
        <h2 className="text-xl font-extrabold text-center">{title}</h2>
        {subtitle && <p className="text-center text-ink/50 font-medium mt-1 mb-4">{subtitle}</p>}
        {!subtitle && <div className="mb-4" />}
        {children}
      </motion.div>
    </div>
  );
}
