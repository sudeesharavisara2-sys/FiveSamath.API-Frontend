import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Sparkles } from "lucide-react";
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
    <div className="min-h-screen relative flex items-center justify-center px-4 py-10 overflow-hidden bg-[#0B1130]">
      {/* Animated gradient blobs */}
      <motion.div
        className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-sky/40 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-grape/40 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-sunshine/25 blur-3xl"
        animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* Floating sparkles */}
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute text-white/20"
          style={{ left: `${10 + i * 15}%`, top: `${15 + (i % 3) * 25}%` }}
          animate={{ y: [0, -18, 0], opacity: [0.15, 0.5, 0.15] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        >
          <Sparkles size={16 + (i % 3) * 6} />
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-[2rem] p-[1.5px] bg-gradient-to-br from-sky/60 via-white/10 to-grape/60 shadow-2xl"
      >
        <div className="rounded-[2rem] bg-white/95 backdrop-blur-xl px-8 py-9 relative overflow-hidden">
          <motion.div
            className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-sunshine/20 blur-2xl"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="flex flex-col items-center mb-6 relative"
          >
            <motion.span
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
              transition={{ duration: 0.5 }}
              className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky to-sky-dark flex items-center justify-center text-white shadow-lg shadow-sky/40 mb-3"
            >
              <GraduationCap size={30} />
            </motion.span>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-sky-dark to-grape bg-clip-text text-transparent">
              {t.appName}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.4 }}
            className="relative"
          >
            <h2 className="text-xl font-extrabold text-center text-ink">{title}</h2>
            {subtitle ? (
              <p className="text-center text-ink/50 font-medium mt-1 mb-5 text-sm">{subtitle}</p>
            ) : (
              <div className="mb-5" />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="relative"
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}