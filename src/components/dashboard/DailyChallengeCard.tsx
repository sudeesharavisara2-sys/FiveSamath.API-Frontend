import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
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
      toast.success(`+${res.rewardXP} XP! 🔥 ${res.streak} day streak`);
      qc.invalidateQueries({ queryKey: ["streak"] });
      qc.invalidateQueries({ queryKey: ["analytics"] });
    },
    onError: () => toast.error("Already claimed or something went wrong"),
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl p-6 shadow-lg bg-gradient-to-br from-grape to-sky-dark text-white relative overflow-hidden"
    >
      <Sparkles className="absolute -right-4 -top-4 opacity-20" size={100} />
      <p className="uppercase text-xs font-bold tracking-wide opacity-80">
        {t.dashboard.dailyChallenge}
      </p>
      <h3 className="text-xl font-extrabold mt-1">{challenge.title}</h3>
      <p className="text-sm opacity-90 mt-1 mb-4">{challenge.description}</p>
      <div className="flex items-center justify-between">
        <span className="font-bold bg-white/20 px-3 py-1 rounded-full text-sm">
          +{challenge.rewardXP} XP
        </span>
        <Button variant="secondary" size="sm" isLoading={isPending} onClick={() => mutate()}>
          {t.dashboard.claimReward}
        </Button>
      </div>
    </motion.div>
  );
}
