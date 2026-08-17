import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PartyPopper, RotateCcw, Zap } from "lucide-react";
import type { SubmitQuizResponse } from "../../types";
import { useLanguage } from "../../context/LanguageContext";
import Button from "../common/Button";

export default function ResultsModal({
  result,
  onRetry,
}: {
  result: SubmitQuizResponse;
  onRetry: () => void;
}) {
  const { t } = useLanguage();
  const pct = result.total === 0 ? 0 : Math.round((result.score / result.total) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 18 }}
        className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 text-center relative overflow-hidden"
      >
        <motion.div
          initial={{ rotate: -10, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.15, type: "spring" }}
          className="h-24 w-24 rounded-full bg-gradient-to-br from-sunshine to-coral mx-auto flex items-center justify-center text-white shadow-lg mb-4"
        >
          <PartyPopper size={44} />
        </motion.div>

        <h2 className="text-2xl font-extrabold">{t.quiz.yourScore}</h2>
        <p className="text-5xl font-black text-sky-dark my-3">
          {result.score}/{result.total}
        </p>
        <p className="text-ink/50 font-semibold mb-2">{pct}%</p>

        <div className="inline-flex items-center gap-1.5 bg-sunshine/20 text-sunshine-dark font-bold px-4 py-2 rounded-full mb-6">
          <Zap size={16} /> +{result.xp} XP
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="ghost" onClick={onRetry}>
            <RotateCcw size={16} /> {t.quiz.tryAgain}
          </Button>
          <Link to="/">
            <Button variant="primary" className="w-full">
              {t.quiz.backHome}
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
