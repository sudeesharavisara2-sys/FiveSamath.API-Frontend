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
    sky: { iconBg: "bg-sky-50 text-sky-500", shadow: "shadow-sky-500/5" },
    sunshine: { iconBg: "bg-amber-50 text-amber-500", shadow: "shadow-amber-500/5" },
    grass: { iconBg: "bg-emerald-50 text-emerald-500", shadow: "shadow-emerald-500/5" },
    coral: { iconBg: "bg-rose-50 text-rose-500", shadow: "shadow-rose-500/5" },
    grape: { iconBg: "bg-purple-50 text-purple-500", shadow: "shadow-purple-500/5" },
  };

  const currentTheme = bgStyles[color] || bgStyles.sky;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`bg-white/80 backdrop-blur-xl rounded-3xl p-5 shadow-xl ${currentTheme.shadow} border border-slate-100 flex items-center gap-4 cursor-default`}
    >
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${currentTheme.iconBg} shadow-inner shrink-0`}>
        <Icon size={24} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-black text-slate-800 tracking-tight leading-none truncate">
          {value}
        </p>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5 truncate">
          {label}
        </p>
      </div>
    </motion.div>
  );
}