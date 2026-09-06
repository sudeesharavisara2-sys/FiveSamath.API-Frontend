import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Award,
  BookOpen,
  FileText,
  Bot,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Calculator,
  Globe,
  Languages
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { progressService } from "../../services/progressService";
import { gamificationService } from "../../services/gamificationService";
import { gradesService } from "../../services/gradesService";
import type { DashboardProgress, DailyChallenge, Subject } from "../../types";

const SUBJECT_ICONS: Record<string, typeof Calculator> = {
  calculator: Calculator,
  languages: Languages,
  "book-open": BookOpen,
  globe: Globe
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [progress, setProgress] = useState<DashboardProgress | null>(null);
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingChallenge, setCompletingChallenge] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [dashData, chalData, subData] = await Promise.all([
          progressService.getDashboardProgress().catch(() => null),
          gamificationService.getTodayChallenge().catch(() => null),
          user?.gradeId ? gradesService.getSubjectsForGrade(user.gradeId).catch(() => []) : Promise.resolve([])
        ]);

        if (dashData) setProgress(dashData);
        if (chalData) {
          setChallenge(chalData);
          setChallengeDone(!!chalData.isCompleted);
        }
        if (subData) setSubjects(subData);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.gradeId]);

  const handleCompleteChallenge = async () => {
    if (!challenge || challengeDone) return;
    try {
      setCompletingChallenge(true);
      await gamificationService.completeChallenge(challenge.id);
      setChallengeDone(true);
      // Reload dashboard progress to update XP & streak
      const updatedProgress = await progressService.getDashboardProgress();
      setProgress(updatedProgress);
    } catch (err) {
      console.error(err);
    } finally {
      setCompletingChallenge(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky border-t-transparent"></div>
      </div>
    );
  }

  const currentLevel = progress?.level || user?.level || 1;
  const totalXP = progress?.totalXP || user?.totalXP || 0;
  const streak = progress?.currentStreak || 0;
  const levelXpProgress = progress?.progressPercent || 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* ===== HERO GAMIFIED HEADER ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-sky via-sky-dark to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
          <Sparkles size={240} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-sunshine border-4 border-white flex items-center justify-center text-3xl shadow-lg">
                🏆
              </div>
              <span className="absolute -bottom-1 -right-1 bg-coral font-black text-xs px-2 py-0.5 rounded-full border border-white">
                Lv.{currentLevel}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {t.dashboard.greeting.replace("{name}", user?.name || "Samath")}
              </h1>
              <p className="text-white/80 font-medium text-sm mt-1">
                {progress?.gradeName || (user?.gradeId ? `${t.learning.grade} ${user.gradeId}` : t.dashboard.gradeUnavailable)} • Keep ascending your learning path!
              </p>
            </div>
          </div>

          {/* Stat Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/15 backdrop-blur px-4 py-2.5 rounded-2xl flex items-center gap-2.5 border border-white/20">
              <Flame className="text-amber-300 fill-amber-300 animate-bounce" size={22} />
              <div>
                <div className="text-xs text-white/70 font-semibold">{t.dashboard.streak}</div>
                <div className="text-lg font-black">{streak} Days</div>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur px-4 py-2.5 rounded-2xl flex items-center gap-2.5 border border-white/20">
              <Sparkles className="text-sunshine fill-sunshine" size={22} />
              <div>
                <div className="text-xs text-white/70 font-semibold">{t.dashboard.xp}</div>
                <div className="text-lg font-black">{totalXP} XP</div>
              </div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex justify-between items-center text-xs font-bold mb-2">
            <span>Level {currentLevel} Explorer</span>
            <span>{levelXpProgress} / 100 XP to Level {currentLevel + 1}</span>
          </div>
          <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(5, levelXpProgress))}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-sunshine to-amber-300 rounded-full shadow"
            ></motion.div>
          </div>
        </div>
      </motion.div>

      {/* ===== DAILY CHALLENGE & QUICK ACTIONS ===== */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Daily Challenge Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 border-2 border-sunshine/40 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="bg-sunshine/20 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} /> {t.dashboard.dailyChallenge}
              </span>
              <span className="text-amber-700 font-extrabold text-xs">
                +{challenge?.rewardXP || 20} Bonus XP
              </span>
            </div>

            <h3 className="text-xl font-black text-ink mb-2">
              {challenge?.title || "Daily Math Master! 🧮"}
            </h3>
            <p className="text-ink/70 text-sm mb-4">
              {challenge?.description || "Solve today's scholarship math puzzle to maintain your streak!"}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-amber-200/60">
            <span className="text-xs text-ink/60 font-semibold">
              {challengeDone ? "Challenge completed today!" : "Complete now for extra streak bonuses"}
            </span>

            {challengeDone ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white font-extrabold text-sm px-4 py-2 rounded-2xl shadow">
                <CheckCircle size={18} /> Done (+{challenge?.rewardXP || 20} XP)
              </span>
            ) : (
              <button
                onClick={handleCompleteChallenge}
                disabled={completingChallenge}
                className="bg-sunshine hover:bg-amber-400 text-ink font-black text-sm px-5 py-2.5 rounded-2xl shadow transition-transform active:scale-95 flex items-center gap-2"
              >
                {completingChallenge ? "Claiming..." : t.dashboard.claimReward} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </motion.div>

        {/* Quick Action Navigation */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 border-2 border-ink/5 shadow-sm flex flex-col justify-between space-y-4"
        >
          <h3 className="text-lg font-black text-ink flex items-center gap-2">
            <Sparkles className="text-sky" size={20} /> Quick Study Modes
          </h3>

          <div className="space-y-3">
            <Link
              to="/mock-exam"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-sky/10 hover:bg-sky/20 transition-colors border border-sky/20 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky text-white flex items-center justify-center font-bold">
                  <FileText size={20} />
                </div>
                <div>
                  <div className="font-extrabold text-ink text-sm">Scholarship Papers</div>
                  <div className="text-xs text-ink/60">PDF & Online Test</div>
                </div>
              </div>
              <ArrowRight size={18} className="text-sky group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/practice"
              className="flex items-center justify-between p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 transition-colors border border-purple-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                  <Bot size={20} />
                </div>
                <div>
                  <div className="font-extrabold text-ink text-sm">AI Tutor Assistant</div>
                  <div className="text-xs text-ink/60">Sinhala Math Explanations</div>
                </div>
              </div>
              <ArrowRight size={18} className="text-purple-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ===== SUBJECT WORLDS MAP ===== */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-ink flex items-center gap-2">
            <BookOpen className="text-sky" size={26} /> {t.dashboard.subjects}
          </h2>
          <span className="text-sm font-bold text-ink/50">{progress?.gradeName || (user?.gradeId ? `${t.learning.grade} ${user.gradeId}` : t.dashboard.gradeUnavailable)}</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((sub, idx) => {
            const IconComp = SUBJECT_ICONS[sub.icon] || BookOpen;
            const gradients = [
              "from-sky to-blue-600",
              "from-purple-500 to-indigo-600",
              "from-emerald-400 to-teal-600",
              "from-coral to-rose-600"
            ];
            const gradient = gradients[idx % gradients.length];

            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl p-6 border-2 border-ink/5 shadow-md flex flex-col justify-between relative overflow-hidden group"
              >
                <div className={`h-2 w-full bg-gradient-to-r ${gradient} absolute top-0 left-0`}></div>

                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-lg`}>
                    <IconComp size={28} />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-ink group-hover:text-sky-dark transition-colors">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-ink/60 mt-1 line-clamp-2">
                      {sub.description || t.dashboard.subjectFallback}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-ink/5 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    Lessons Unlocked
                  </span>
                  <Link
                    to={`/subject/${sub.id}`}
                    className={`p-2.5 rounded-2xl bg-gradient-to-r ${gradient} text-white shadow hover:opacity-90 transition-opacity`}
                  >
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ===== BADGES & LEADERBOARD CALLOUT ===== */}
      <div className="grid md:grid-cols-2 gap-6 pt-4">
        {/* Achievements Preview */}
        <div className="bg-white rounded-3xl p-6 border-2 border-ink/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-ink flex items-center gap-2">
              <Award className="text-amber-500" size={22} /> Recent Badges
            </h3>
            <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              {progress?.badgesCount || 0} Earned
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-cream flex items-center gap-3 border border-ink/5">
              <span className="text-2xl">🌟</span>
              <div>
                <div className="text-xs font-extrabold text-ink">First Chapter</div>
                <div className="text-[10px] text-ink/60">Started Learning</div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-cream flex items-center gap-3 border border-ink/5">
              <span className="text-2xl">🎯</span>
              <div>
                <div className="text-xs font-extrabold text-ink">Quiz Master</div>
                <div className="text-[10px] text-ink/60">Passed Checkpoint</div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Callout */}
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 text-white rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div className="space-y-2">
            <span className="bg-white/20 text-xs font-extrabold px-3 py-1 rounded-full uppercase">
              Hall of Fame
            </span>
            <h3 className="text-xl font-black">{t.leaderboard.title}</h3>
            <p className="text-xs text-white/70">Compete with Grade 5 scholarship students island-wide!</p>
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-2 bg-sunshine hover:bg-amber-400 text-ink font-black text-xs px-4 py-2.5 rounded-xl shadow mt-2"
            >
              View Leaderboard <Trophy size={16} />
            </Link>
          </div>
          <div className="text-6xl pr-2">🏆</div>
        </div>
      </div>
    </div>
  );
}
