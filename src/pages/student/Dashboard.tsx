import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, Flame, Target, Trophy, Zap } from "lucide-react";
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
import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import Button from "../../components/common/Button";

const SUBJECT_COLORS = ["bg-sky/15 text-sky-dark", "bg-coral/15 text-coral-dark", "bg-grass/15 text-grass-dark", "bg-grape/15 text-grape", "bg-sunshine/25 text-sunshine-dark"];

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
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-ink">{greeting}</h1>
        <p className="text-ink/50 font-medium mt-1">
          {t.dashboard.startPractice} / {t.dashboard.startMockExam}
        </p>
      </motion.div>

      {loadingAnalytics ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Flame} label={t.dashboard.streak} value={streak?.currentStreak ?? 0} color="coral" />
          <StatCard icon={Zap} label={t.dashboard.xp} value={analytics?.totalXP ?? 0} color="sunshine" />
          <StatCard icon={Target} label={t.dashboard.avgScore} value={Math.round(analytics?.averageMarks ?? 0)} color="grass" />
          <StatCard icon={Trophy} label={t.dashboard.lessonsCompleted} value={analytics?.completedLessons ?? 0} color="sky" />
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold flex items-center gap-2">
                <BookOpen className="text-sky-dark" size={22} /> {t.dashboard.subjects}
              </h2>
            </div>
            {loadingSubjects ? (
              <Spinner />
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {subjects?.map((s, i) => (
                  <Link key={s.id} to={`/practice?subjectId=${s.id}`}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className={`rounded-2xl p-4 font-bold ${SUBJECT_COLORS[i % SUBJECT_COLORS.length]}`}
                    >
                      {s.name}
                    </motion.div>
                  </Link>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3 mt-5">
              <Link to="/practice">
                <Button variant="primary">{t.dashboard.startPractice}</Button>
              </Link>
              <Link to="/mock-exam">
                <Button variant="secondary">{t.dashboard.startMockExam}</Button>
              </Link>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-extrabold mb-3">{t.dashboard.yourProgress}</h2>
            <div className="w-full bg-ink/5 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analytics?.progressPercentage ?? 0}%` }}
                transition={{ duration: 0.8 }}
                className="h-full bg-gradient-to-r from-grass to-sky rounded-full"
              />
            </div>
            <p className="text-sm text-ink/50 mt-2 font-semibold">
              {analytics?.completedLessons ?? 0} / {analytics?.totalLessons ?? 0} {t.dashboard.lessonsCompleted}
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          {challenge && <DailyChallengeCard challenge={challenge} />}
          <BadgeShelf badges={badges ?? []} />
        </div>
      </div>
    </div>
  );
}
