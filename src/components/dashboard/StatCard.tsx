import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: "sky" | "sunshine" | "grass" | "coral" | "grape";
}) {
  const bgStyles: Record<string, { iconBg: string; shadow: string }> = {
    sky: { iconBg: "bg-sky-500/10 text-sky-400 border border-sky-500/20", shadow: "shadow-sky-500/5" },
    sunshine: { iconBg: "bg-amber-500/10 text-amber-400 border border-amber-500/20", shadow: "shadow-amber-500/5" },
    grass: { iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20", shadow: "shadow-emerald-500/5" },
    coral: { iconBg: "bg-rose-500/10 text-rose-400 border border-rose-500/20", shadow: "shadow-rose-500/5" },
    grape: { iconBg: "bg-purple-500/10 text-purple-400 border border-purple-500/20", shadow: "shadow-purple-500/5" },
  };

  const currentTheme = bgStyles[color] || bgStyles.sky;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`bg-slate-900/60 backdrop-blur-xl rounded-3xl p-5 shadow-2xl ${currentTheme.shadow} border border-slate-800/80 flex items-center gap-4 cursor-default`}
    >
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${currentTheme.iconBg} shrink-0`}>
        <Icon size={24} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black text-white tracking-tight leading-none truncate">
          {value}
        </p>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5 truncate">
          {label}
        </p>
      </div>
    </motion.div>
  );
}