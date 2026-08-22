import { motion } from "framer-motion";
import { Sparkles, Trophy } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { DailyChallenge } from "../../types";
import { gamificationService } from "../../services/gamificationService";
import Button from "../common/Button";
import { useLanguage } from "../../context/LanguageContext";

export default function DailyChallengeCard({ challenge }: { challenge: DailyChallenge }) {
  const { t } = useLanguage();
  const qc = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => gamificationService.completeChallenge(challenge.id),
    onSuccess: (res) => {
      toast.success(`+${res.rewardXP} XP! 🔥 ${res.streak} day streak`, {
        icon: '🎉',
        style: { borderRadius: '1rem', background: '#333', color: '#fff' }
      });
      qc.invalidateQueries({ queryKey: ["streak"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
    onError: () => toast.error("Already claimed or something went wrong"),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl p-6 shadow-xl shadow-purple-900/10 bg-gradient-to-tr from-violet-900 via-purple-800 to-indigo-600 text-white relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
        <Sparkles size={160} />
      </div>
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 uppercase text-[11px] font-extrabold tracking-wider px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-200 border border-white/10">
            <Trophy size={12} className="text-amber-300" />
            {t.dashboard.dailyChallenge}
          </span>
          <span className="font-black tracking-tight bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent text-sm">
            +{challenge.rewardXP} XP
          </span>
        </div>

        <h3 className="text-xl font-black tracking-tight text-white mb-1.5">
          {challenge.title}
        </h3>
        
        <p className="text-sm text-purple-100/80 font-medium mb-5 line-clamp-2">
          {challenge.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-purple-200/60 font-medium">
            <span>Resets daily</span>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button 
              variant="secondary" 
              size="sm" 
              isLoading={isPending} 
              onClick={() => mutate()}
              className="bg-white text-purple-900 hover:bg-purple-50 font-bold shadow-lg shadow-black/10 border-none rounded-xl px-4"
            >
              {t.dashboard.claimReward}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}