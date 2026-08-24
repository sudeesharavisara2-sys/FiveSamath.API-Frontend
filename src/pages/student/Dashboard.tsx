import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Flame,
  Play,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
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

const SUBJECT_THEMES = [
  {
    iconBg: "bg-sky-500/15",
    iconText: "text-sky-300",
    border: "border-sky-400/15",
    hover:
      "hover:border-sky-400/30 hover:bg-sky-500/[0.08] hover:shadow-sky-500/10",
    accent: "from-sky-400 to-blue-500",
  },
  {
    iconBg: "bg-violet-500/15",
    iconText: "text-violet-300",
    border: "border-violet-400/15",
    hover:
      "hover:border-violet-400/30 hover:bg-violet-500/[0.08] hover:shadow-violet-500/10",
    accent: "from-violet-400 to-indigo-500",
  },
  {
    iconBg: "bg-emerald-500/15",
    iconText: "text-emerald-300",
    border: "border-emerald-400/15",
    hover:
      "hover:border-emerald-400/30 hover:bg-emerald-500/[0.08] hover:shadow-emerald-500/10",
    accent: "from-emerald-400 to-teal-500",
  },
  {
    iconBg: "bg-rose-500/15",
    iconText: "text-rose-300",
    border: "border-rose-400/15",
    hover:
      "hover:border-rose-400/30 hover:bg-rose-500/[0.08] hover:shadow-rose-500/10",
    accent: "from-rose-400 to-pink-500",
  },
  {
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-300",
    border: "border-amber-400/15",
    hover:
      "hover:border-amber-400/30 hover:bg-amber-500/[0.08] hover:shadow-amber-500/10",
    accent: "from-amber-300 to-orange-500",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: analytics, isLoading: loadingAnalytics } = useAnalytics();

  const { data: streak } = useStreak();

  const { data: badges } = useMyBadges();

  const {
    data: subjects,
    isLoading: loadingSubjects,
  } = useSubjects();

  const { data: challenge } = useTodayChallenge();

  const firstName = user?.name?.split(" ")[0] || "";

  const greeting = t.dashboard.greeting.replace(
    "{name}",
    firstName
  );

  const progress = Math.min(
    100,
    Math.max(0, analytics?.progressPercentage ?? 0)
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 pb-10 sm:space-y-8 sm:pb-14"
    >
      {/* ========================================
          WELCOME HERO
      ========================================= */}
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-600/25 via-indigo-600/15 to-sky-500/15 shadow-2xl shadow-violet-950/20 backdrop-blur-xl"
      >
        {/* Decorative glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-violet-500/20 blur-[90px]" />

          <div className="absolute -right-20 -bottom-28 h-72 w-72 rounded-full bg-sky-500/15 blur-[100px]" />

          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-6 top-5 text-white/[0.06] sm:right-16 sm:top-10"
          >
            <Sparkles size={180} strokeWidth={1} />
          </motion.div>
        </div>

        <div className="relative z-10 flex flex-col gap-7 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
          {/* Welcome text */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-white/[0.06] px-3 py-1.5 text-xs font-bold text-violet-200 backdrop-blur-md"
            >
              <Sparkles size={15} className="text-amber-300" />

              <span>Student Dashboard</span>
            </motion.div>

            <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              {greeting}
            </h1>

            <p className="mt-3 max-w-lg text-sm font-medium leading-6 text-slate-300 sm:text-base">
              Ready to learn something new today? Keep practicing,
              complete lessons, and become better every day.
            </p>
          </div>

          {/* Quick actions */}
          <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-[420px]">
            <Link to="/practice">
              <motion.div
                whileHover={{
                  y: -3,
                  scale: 1.015,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="group flex min-h-[74px] items-center gap-4 rounded-2xl border border-sky-300/15 bg-gradient-to-br from-sky-500 to-blue-600 px-5 shadow-xl shadow-sky-500/20 transition-shadow hover:shadow-sky-500/35"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                  <Play size={21} fill="currentColor" />
                </div>

                <div>
                  <p className="text-base font-extrabold text-white">
                    {t.dashboard.startPractice}
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-sky-100/80">
                    Learn and practice
                  </p>
                </div>

                <ArrowRight
                  size={19}
                  className="ml-auto transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.div>
            </Link>

            <Link to="/mock-exam">
              <motion.div
                whileHover={{
                  y: -3,
                  scale: 1.015,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                className="group flex min-h-[74px] items-center gap-4 rounded-2xl border border-amber-300/15 bg-gradient-to-br from-amber-400 to-orange-500 px-5 text-slate-950 shadow-xl shadow-orange-500/20 transition-shadow hover:shadow-orange-500/35"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20">
                  <ClipboardCheck size={22} />
                </div>

                <div>
                  <p className="text-base font-black">
                    {t.dashboard.startMockExam}
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-slate-800/70">
                    Test your knowledge
                  </p>
                </div>

                <ArrowRight
                  size={19}
                  className="ml-auto transition-transform duration-300 group-hover:translate-x-1"
                />
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ========================================
          STATISTICS
      ========================================= */}
      <motion.section variants={itemVariants}>
        {loadingAnalytics ? (
          <div className="flex min-h-[150px] items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <StatCard
              icon={Flame}
              label={t.dashboard.streak}
              value={streak?.currentStreak ?? 0}
              color="coral"
            />

            <StatCard
              icon={Zap}
              label={t.dashboard.xp}
              value={analytics?.totalXP ?? 0}
              color="sunshine"
            />

            <StatCard
              icon={Target}
              label={t.dashboard.avgScore}
              value={`${Math.round(
                analytics?.averageMarks ?? 0
              )}%`}
              color="grass"
            />

            <StatCard
              icon={Trophy}
              label={t.dashboard.lessonsCompleted}
              value={analytics?.completedLessons ?? 0}
              color="sky"
            />
          </div>
        )}
      </motion.section>

      {/* ========================================
          MAIN DASHBOARD GRID
      ========================================= */}
      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* LEFT CONTENT */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* ========================================
              SUBJECTS
          ========================================= */}
          <motion.section
            variants={itemVariants}
            className="rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6"
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-400/15 bg-sky-500/10 text-sky-300">
                  <BookOpen size={22} />
                </div>

                <div>
                  <h2 className="text-lg font-extrabold text-white">
                    {t.dashboard.subjects}
                  </h2>

                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                    Choose a subject and start learning
                  </p>
                </div>
              </div>

              <Link
                to="/practice"
                className="group hidden items-center gap-1.5 text-sm font-bold text-sky-300 transition-colors hover:text-sky-200 sm:flex"
              >
                <span>View All</span>

                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Loading */}
            {loadingSubjects ? (
              <div className="flex min-h-[180px] items-center justify-center">
                <Spinner />
              </div>
            ) : subjects && subjects.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {subjects.map((subject, index) => {
                  const theme =
                    SUBJECT_THEMES[
                      index % SUBJECT_THEMES.length
                    ];

                  return (
                    <Link
                      key={subject.id}
                      to={`/practice?subjectId=${subject.id}`}
                    >
                      <motion.div
                        whileHover={{
                          y: -4,
                          scale: 1.01,
                        }}
                        whileTap={{
                          scale: 0.98,
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 350,
                          damping: 24,
                        }}
                        className={`group relative flex min-h-[100px] items-center gap-4 overflow-hidden rounded-2xl border ${theme.border} bg-white/[0.035] p-4 shadow-lg transition-all ${theme.hover}`}
                      >
                        {/* Gradient decoration */}
                        <div
                          className={`absolute left-0 top-0 h-full w-1 bg-gradient-to-b ${theme.accent} opacity-70`}
                        />

                        {/* Subject icon */}
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${theme.iconBg} ${theme.iconText}`}
                        >
                          <BookOpen size={22} />
                        </div>

                        {/* Subject name */}
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-extrabold text-slate-100 sm:text-base">
                            {subject.name}
                          </h3>

                          <p className="mt-1 text-xs font-medium text-slate-500">
                            Start practicing now
                          </p>
                        </div>

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-slate-500 transition-all group-hover:bg-white/[0.1] group-hover:text-white">
                          <ArrowRight
                            size={18}
                            className="transition-transform group-hover:translate-x-1"
                          />
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 text-center">
                <BookOpen
                  size={34}
                  className="mb-3 text-slate-600"
                />

                <p className="font-bold text-slate-300">
                  No subjects available yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Check back soon for new learning content.
                </p>
              </div>
            )}

            {/* Mobile view all */}
            <Link
              to="/practice"
              className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 text-sm font-bold text-sky-300 sm:hidden"
            >
              View All Subjects
              <ArrowRight size={17} />
            </Link>
          </motion.section>

          {/* ========================================
              PROGRESS OVERVIEW
          ========================================= */}
          <motion.section
            variants={itemVariants}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/40 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6"
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-emerald-500/10 blur-[70px]" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/15 bg-emerald-500/10 text-emerald-300">
                    <Target size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-extrabold text-white">
                      {t.dashboard.yourProgress}
                    </h2>

                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                      Keep going, every lesson counts!
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-400/15 bg-emerald-500/10 px-3 py-2 text-sm font-extrabold text-emerald-300">
                  {Math.round(progress)}% Complete
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-7">
                <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Your learning journey</span>

                  <span>
                    {analytics?.completedLessons ?? 0} /{" "}
                    {analytics?.totalLessons ?? 0}
                  </span>
                </div>

                <div className="h-4 w-full overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.05] p-1">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${progress}%`,
                    }}
                    transition={{
                      duration: 1.1,
                      delay: 0.3,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400"
                  >
                    <motion.div
                      animate={{
                        x: ["-100%", "250%"],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>

                <p className="mt-3 text-sm font-medium text-slate-400">
                  You have completed{" "}
                  <span className="font-bold text-white">
                    {analytics?.completedLessons ?? 0}
                  </span>{" "}
                  lessons so far. Keep up the great work!
                </p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* ========================================
            RIGHT SIDEBAR
        ========================================= */}
        <motion.aside
          variants={itemVariants}
          className="space-y-6"
        >
          {challenge && (
            <DailyChallengeCard challenge={challenge} />
          )}

          <BadgeShelf badges={badges ?? []} />

          {/* Small motivational card */}
          <div className="relative overflow-hidden rounded-[1.75rem] border border-violet-400/15 bg-gradient-to-br from-violet-500/15 via-indigo-500/10 to-sky-500/10 p-6 shadow-xl shadow-violet-950/10">
            <div className="absolute -right-8 -top-8 text-white/[0.05]">
              <Trophy size={120} />
            </div>

            <div className="relative z-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/15 text-amber-300">
                <Trophy size={23} />
              </div>

              <h3 className="mt-4 text-base font-extrabold text-white">
                Keep Learning!
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Small steps every day can lead to big achievements.
              </p>

              <Link
                to="/leaderboard"
                className="group mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-300 transition-colors hover:text-sky-200"
              >
                View Leaderboard

                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}