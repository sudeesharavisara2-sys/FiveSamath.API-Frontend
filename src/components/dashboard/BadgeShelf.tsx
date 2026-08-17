import { motion } from "framer-motion";
import { Award } from "lucide-react";
import type { Badge } from "../../types";
import { useLanguage } from "../../context/LanguageContext";

export default function BadgeShelf({ badges }: { badges: Badge[] }) {
  const { t, lang } = useLanguage();

  return (
    <div className="bg-white rounded-3xl p-5 shadow-md border-4 border-white">
      <h3 className="font-extrabold text-lg mb-4 flex items-center gap-2">
        <Award className="text-sunshine-dark" size={20} /> {t.dashboard.badges}
      </h3>
      {badges.length === 0 ? (
        <p className="text-ink/40 text-sm">
          {lang === "si" ? "තවම සම්මාන නැත" : "No badges yet — keep practicing!"}
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {badges.map((b, i) => (
            <motion.div
              key={b.name}
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.05, type: "spring" }}
              title={b.description}
              className="flex flex-col items-center gap-1 w-20"
            >
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sunshine to-coral flex items-center justify-center text-2xl shadow-lg">
                {b.icon || "🏅"}
              </div>
              <span className="text-xs font-bold text-center text-ink/70 line-clamp-2">
                {b.name}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
