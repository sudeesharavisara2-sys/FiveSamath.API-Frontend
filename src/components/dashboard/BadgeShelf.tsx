import { motion } from "framer-motion";
import { Award } from "lucide-react";
import type { Badge } from "../../types";
import { useLanguage } from "../../context/LanguageContext";

export default function BadgeShelf({ badges }: { badges: Badge[] }) {
  const { t, lang } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-800 text-base flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-500 shadow-sm">
            <Award size={20} />
          </div>
          {t.dashboard.badges}
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
          {badges.length} Unlocked
        </span>
      </div>

      {badges.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-slate-400 text-sm font-medium">
            {lang === "si" ? "තවම සම්මාන නැත" : "No badges yet — keep practicing!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {badges.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 20 }}
              title={b.description}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-colors hover:bg-slate-50 cursor-pointer group"
            >
              <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-rose-400 flex items-center justify-center text-2xl shadow-md shadow-orange-500/20 group-hover:shadow-lg group-hover:shadow-orange-500/30 transition-shadow">
                <span className="filter drop-shadow">{b.icon || "🏅"}</span>
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-[11px] font-semibold text-center text-slate-600 line-clamp-1 group-hover:text-slate-900">
                {b.name}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}