import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Flame, Target, Trophy, Zap, ArrowRight, Sparkles, PlayCircle, FileText } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import {
  useAnalytics,
  useMyBadges,
  useStreak,
  useSubjects,
  useTodayChallenge,
} from "../../hooks/useStudentDashboard";
import StatCard from "../../components/dashboard/StatCard";
import BadgeShelf from "../../components/dashboard/BadgeShelf";
import DailyChallengeCard from "../../components/dashboard/DailyChallengeCard";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";

const SUBJECT_THEMES = [
  { bg: "bg-sky-50 text-sky-600 border-sky-100", hover: "hover:bg-sky-100/80 shadow-sky-500/5" },
  { bg: "bg-rose-50 text-rose-600 border-rose-100", hover: "hover:bg-rose-100/80 shadow-rose-500/5" },
  { bg: "bg-emerald-50 text-emerald-600 border-emerald-100", hover: "hover:bg-emerald-100/80 shadow-emerald-500/5" },
  { bg: "bg-purple-50 text-purple-600 border-purple-100", hover: "hover:bg-purple-100/80 shadow-purple-500/5" },
  { bg: "bg-amber-50 text-amber-600 border-amber-100", hover: "hover:bg-amber-100/80 shadow-amber-500/5" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: analytics, isLoading: loadingAnalytics } = useAnalytics();
  const { data: streak } = useStreak();
  const { data: badges } = useMyBadges();
  const { data: subjects, isLoading: loadingSubjects } = useSubjects();
  const { data: challenge } = useTodayChallenge();

  const greeting = t.dashboard.greeting.replace("{name}", user?.name?.split(" ")[0] || "");

  return (
    <div className="space-y-8 pb-12">
      {/* Modern Greeting Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-8 rounded-3xl shadow-xl shadow-slate-950/15 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Sparkles size={200} />
        </div>
        <div className="relative z-10 space-y-1.5">
          <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-extrabold tracking-wider uppercase text-purple-200">
            Student Portal
          </span>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">{greeting}</h1>
          <p className="text-purple-200/70 text-sm font-medium">
            {t.dashboard.startPractice} / {t.dashboard.startMockExam}
          </p>
        </div>
        
        {/* Clear Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Link to="/practice">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="primary" className="bg-gradient-to-r from-sky-400 to-blue-600 text-white hover:from-sky-500 hover:to-blue-700 font-bold shadow-lg shadow-sky-500/25 border-none rounded-2xl px-5 py-3 flex items-center gap-2">
                <PlayCircle size={18} />
                {t.dashboard.startPractice}
              </Button>
            </motion.div>
          </Link>
          <Link to="/mock-exam">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="secondary" className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:from-amber-500 hover:to-orange-600 font-black shadow-lg shadow-orange-500/25 border-none rounded-2xl px-5 py-3 flex items-center gap-2">
                <FileText size={18} />
                {t.dashboard.startMockExam}
              </Button>
            </motion.div>
          </Link>
        </div>
      </motion.div>

      {/* Analytics Stat Cards Grid */}
      {loadingAnalytics ? (
        <div className="py-12 flex justify-center"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Flame} label={t.dashboard.streak} value={streak?.currentStreak ?? 0} color="coral" />
          <StatCard icon={Zap} label={t.dashboard.xp} value={analytics?.totalXP ?? 0} color="sunshine" />
          <StatCard icon={Target} label={t.dashboard.avgScore} value={`${Math.round(analytics?.averageMarks ?? 0)}%`} color="grass" />
          <StatCard icon={Trophy} label={t.dashboard.lessonsCompleted} value={analytics?.completedLessons ?? 0} color="sky" />
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          
          {/* Subjects Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-50 text-sky-500 shadow-sm">
                  <BookOpen size={20} />
                </div>
                {t.dashboard.subjects}
              </h2>
              <Link to="/practice" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            {loadingSubjects ? (
              <div className="py-8 flex justify-center"><Spinner /></div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {subjects?.map((s, i) => {
                  const theme = SUBJECT_THEMES[i % SUBJECT_THEMES.length];
                  return (
                    <Link key={s.id} to={`/practice?subjectId=${s.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className={`rounded-2xl p-4 font-bold border shadow-sm transition-colors flex items-center justify-between ${theme.bg} ${theme.hover}`}
                      >
                        <span className="text-sm font-black tracking-tight">{s.name}</span>
                        <ArrowRight size={16} className="opacity-40" />
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Progress Overview Card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-slate-800">{t.dashboard.yourProgress}</h2>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                {analytics?.progressPercentage ? Math.round(analytics.progressPercentage) : 0}% Complete
              </span>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analytics?.progressPercentage ?? 0}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-400 to-sky-400 rounded-full shadow-sm"
              />
            </div>
            
            <p className="text-xs text-slate-400 mt-2.5 font-semibold">
              {analytics?.completedLessons ?? 0} / {analytics?.totalLessons ?? 0} {t.dashboard.lessonsCompleted}
            </p>
          </motion.div>
        </div>

        {/* Sidebar Column: Daily Challenges & Badges */}
        <div className="space-y-6">
          {challenge && <DailyChallengeCard challenge={challenge} />}
          <BadgeShelf badges={badges ?? []} />
        </div>
      </div>
    </div>
  );
}