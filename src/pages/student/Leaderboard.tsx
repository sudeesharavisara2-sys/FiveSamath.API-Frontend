import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Crown, Medal, Trophy } from "lucide-react";
import { gamificationService } from "../../services/gamificationService";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import Spinner from "../../components/common/Spinner";

export default function Leaderboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: gamificationService.getLeaderboard,
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 text-white">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6 rounded-3xl shadow-2xl shadow-orange-500/20 relative overflow-hidden border border-white/10"
      >
        <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-inner">
          <Crown size={28} className="text-yellow-200 animate-bounce" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t.leaderboard.title}</h1>
          <p className="text-amber-100/90 text-xs font-semibold">See how you rank against other learners this week</p>
        </div>
      </motion.div>

      {/* Leaderboard Table Container */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800/80">
        {isLoading ? (
          <div className="py-12 flex justify-center"><Spinner /></div>
        ) : (
          <div className="space-y-2.5">
            {data?.map((entry, i) => {
              const isMe = entry.userId === user?.id;
              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ delay: i * 0.03, type: "spring", stiffness: 300, damping: 25 }}
                  className={`flex items-center gap-4 py-3.5 px-4 rounded-2xl border transition-colors ${
                    isMe 
                      ? "bg-indigo-500/15 border-indigo-500/40 shadow-sm shadow-indigo-500/10" 
                      : "bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/40"
                  }`}
                >
                  <span className={`w-8 text-center font-black flex items-center justify-center ${
                    i === 0 ? "text-amber-400 text-base" : i === 1 ? "text-slate-300" : i === 2 ? "text-amber-600" : "text-slate-500 text-sm"
                  }`}>
                    {i < 3 ? <Medal size={22} className="drop-shadow-sm" /> : i + 1}
                  </span>
                  
                  <div className="flex-1 min-w-0">
                    <span className={`block font-bold text-sm truncate ${isMe ? "text-indigo-200 font-black" : "text-slate-200"}`}>
                      {entry.name} {isMe && <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full ml-1.5 font-semibold">You</span>}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="block text-xs font-black text-amber-400">{entry.totalXP} XP</span>
                    <span className="block text-[11px] font-semibold text-slate-400">{entry.totalMarks} {t.leaderboard.marks}</span>
                  </div>
                </motion.div>
              );
            })}
            {data?.length === 0 && (
              <div className="text-center py-12">
                <Trophy size={40} className="mx-auto text-slate-600 mb-2" />
                <p className="text-slate-400 text-sm font-medium">No rankings yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}