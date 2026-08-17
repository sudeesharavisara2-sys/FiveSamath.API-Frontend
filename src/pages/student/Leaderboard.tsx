import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Crown, Medal } from "lucide-react";
import { gamificationService } from "../../services/gamificationService";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";

const MEDAL_COLORS = ["text-sunshine-dark", "text-ink/40", "text-coral-dark"];

export default function Leaderboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: gamificationService.getLeaderboard,
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold flex items-center gap-2">
        <Crown className="text-sunshine-dark" /> {t.leaderboard.title}
      </h1>

      <Card>
        {isLoading ? (
          <Spinner />
        ) : (
          <div className="divide-y divide-ink/5">
            {data?.map((entry, i) => (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-4 py-3 px-2 rounded-xl ${
                  entry.userId === user?.id ? "bg-sky/10" : ""
                }`}
              >
                <span className={`w-8 text-center font-extrabold ${MEDAL_COLORS[i] ?? "text-ink/40"}`}>
                  {i < 3 ? <Medal size={20} className="inline" /> : i + 1}
                </span>
                <span className="flex-1 font-bold">{entry.name}</span>
                <span className="text-sm font-bold text-sunshine-dark">{entry.totalXP} XP</span>
                <span className="text-sm font-semibold text-ink/40">{entry.totalMarks} {t.leaderboard.marks}</span>
              </motion.div>
            ))}
            {data?.length === 0 && <p className="text-ink/40 text-center py-8">No rankings yet.</p>}
          </div>
        )}
      </Card>
    </div>
  );
}
