import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  BookOpen,
  Layers,
  ListChecks,
  Sparkles,
  FolderTree,
  Lock,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Target,
  Award,
} from "lucide-react";
import { learningService } from "../../services/learningService";
import { useLanguage } from "../../context/LanguageContext";
import Spinner from "../../components/common/Spinner";

export default function SubjectBrowser({ mode }: { mode: "practice" | "exam" }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [subjectId, setSubjectId] = useState<number | null>(
    params.get("subjectId") ? Number(params.get("subjectId")) : null
  );
  const [bookId, setBookId] = useState<number | null>(null);
  const [chapterId, setChapterId] = useState<number | null>(null);

  // Queries
  const { data: subjects, isLoading: l1 } = useQuery({
    queryKey: ["subjects"],
    queryFn: learningService.getSubjects,
  });

  const { data: books, isLoading: l2 } = useQuery({
    queryKey: ["textbooks", subjectId],
    queryFn: () => learningService.getTextBooks(subjectId!),
    enabled: !!subjectId,
  });

  const { data: chapters, isLoading: l3 } = useQuery({
    queryKey: ["chapters", bookId],
    queryFn: () => learningService.getChapters(bookId!),
    enabled: !!bookId,
  });

  const { data: lessons, isLoading: l4 } = useQuery({
    queryKey: ["lessons", chapterId],
    queryFn: () => learningService.getLessons(chapterId!),
    enabled: !!chapterId,
  });

  const goToQuiz = (lessonId: number) => {
    navigate(mode === "practice" ? `/practice/${lessonId}` : `/mock-exam/${lessonId}`);
  };

  const isPractice = mode === "practice";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 text-white">
      {/* HERO HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative overflow-hidden rounded-3xl p-6 md:p-8 text-white shadow-2xl border ${
          isPractice
            ? "bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-sky-800/40"
            : "bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 border-purple-800/40"
        }`}
      >
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Sparkles size={180} />
        </div>
        <div className="absolute right-1/4 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div
              className={`p-3.5 rounded-2xl border backdrop-blur-md shadow-inner shrink-0 ${
                isPractice
                  ? "bg-sky-500/15 border-sky-400/30 text-sky-300"
                  : "bg-purple-500/15 border-purple-400/30 text-purple-300"
              }`}
            >
              {isPractice ? <Target size={28} /> : <Award size={28} />}
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/10 text-slate-200 border border-white/10">
                {isPractice ? "Interactive Practice" : "Evaluative Assessment"}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {isPractice ? t.dashboard.startPractice : t.dashboard.startMockExam}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">
                Select your subject hierarchy below to jump straight into action.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* STEP 1: SUBJECTS */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800/80 space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <p className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-400 text-[11px] font-extrabold">
              1
            </span>
            <BookOpen size={16} className="text-sky-400" />
            {t.dashboard.subjects}
          </p>
          {subjectId && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <CheckCircle2 size={13} /> Selected
            </span>
          )}
        </div>

        {l1 ? (
          <div className="py-8 flex justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-3">
            {subjects?.map((s) => {
              const isSelected = subjectId === s.id;
              return (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => {
                    setSubjectId(s.id);
                    setBookId(null);
                    setChapterId(null);
                  }}
                  className={`text-left px-4 py-3.5 rounded-2xl font-bold text-sm border transition-all flex items-center justify-between group ${
                    isSelected
                      ? "bg-sky-500/15 text-sky-200 border-sky-500/50 shadow-lg shadow-sky-500/10 ring-1 ring-sky-500/30"
                      : "bg-slate-950/50 text-slate-300 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GraduationCap
                      size={18}
                      className={isSelected ? "text-sky-400" : "text-slate-500 group-hover:text-slate-300"}
                    />
                    <span>{s.name}</span>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`transition-transform duration-200 ${
                      isSelected
                        ? "translate-x-0.5 text-sky-400 opacity-100"
                        : "opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5"
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* STEP 2: TEXTBOOKS */}
      <AnimatePresence>
        {subjectId && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800/80 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <p className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[11px] font-extrabold">
                  2
                </span>
                <Layers size={16} className="text-purple-400" />
                Textbooks
              </p>
              {bookId && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={13} /> Selected
                </span>
              )}
            </div>

            {l2 ? (
              <div className="py-8 flex justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {books?.map((b) => {
                  const isSelected = bookId === b.id;
                  return (
                    <motion.button
                      key={b.id}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => {
                        setBookId(b.id);
                        setChapterId(null);
                      }}
                      className={`text-left px-4 py-3.5 rounded-2xl font-bold text-sm border transition-all flex items-center justify-between group ${
                        isSelected
                          ? "bg-purple-500/15 text-purple-200 border-purple-500/50 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/30"
                          : "bg-slate-950/50 text-slate-300 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen
                          size={18}
                          className={isSelected ? "text-purple-400" : "text-slate-500 group-hover:text-slate-300"}
                        />
                        <span>{b.title}</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${
                          isSelected
                            ? "translate-x-0.5 text-purple-400 opacity-100"
                            : "opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5"
                        }`}
                      />
                    </motion.button>
                  );
                })}
                {books?.length === 0 && (
                  <p className="text-slate-400 text-xs font-medium py-4 italic">No textbooks available yet for this subject.</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 3: CHAPTERS */}
      <AnimatePresence>
        {bookId && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800/80 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <p className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-[11px] font-extrabold">
                  3
                </span>
                <FolderTree size={16} className="text-indigo-400" />
                Chapters
              </p>
              {chapterId && (
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={13} /> Selected
                </span>
              )}
            </div>

            {l3 ? (
              <div className="py-8 flex justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {chapters?.map((c) => {
                  const isSelected = chapterId === c.id;
                  return (
                    <motion.button
                      key={c.id}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => setChapterId(c.id)}
                      className={`text-left px-4 py-3.5 rounded-2xl font-bold text-sm border transition-all flex items-center justify-between group ${
                        isSelected
                          ? "bg-indigo-500/15 text-indigo-200 border-indigo-500/50 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30"
                          : "bg-slate-950/50 text-slate-300 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FolderTree
                          size={18}
                          className={isSelected ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}
                        />
                        <span>{c.title}</span>
                      </div>
                      <ChevronRight
                        size={16}
                        className={`transition-transform duration-200 ${
                          isSelected
                            ? "translate-x-0.5 text-indigo-400 opacity-100"
                            : "opacity-30 group-hover:opacity-70 group-hover:translate-x-0.5"
                        }`}
                      />
                    </motion.button>
                  );
                })}
                {chapters?.length === 0 && (
                  <p className="text-slate-400 text-xs font-medium py-4 italic">No chapters available in this textbook.</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 4: LESSONS & QUIZZES */}
      <AnimatePresence>
        {chapterId && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800/80 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <p className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold">
                  4
                </span>
                <ListChecks size={16} className="text-emerald-400" />
                Select Lesson to Start Quiz
              </p>
            </div>

            {l4 ? (
              <div className="py-8 flex justify-center">
                <Spinner />
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {lessons?.map((les) => (
                  <motion.button
                    key={les.id}
                    disabled={!les.hasQuiz}
                    whileHover={les.hasQuiz ? { scale: 1.015 } : {}}
                    whileTap={les.hasQuiz ? { scale: 0.985 } : {}}
                    onClick={() => goToQuiz(les.id)}
                    className={`text-left px-4 py-3.5 rounded-2xl font-bold text-sm border transition-all flex items-center justify-between group ${
                      les.hasQuiz
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200 hover:bg-emerald-500/20 hover:border-emerald-500/50 shadow-sm cursor-pointer"
                        : "bg-slate-950/30 border-slate-800/40 text-slate-500 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {les.hasQuiz ? (
                        <Sparkles size={18} className="text-emerald-400 shrink-0" />
                      ) : (
                        <Lock size={16} className="text-slate-500 shrink-0" />
                      )}
                      <span className="line-clamp-1">{les.title}</span>
                    </div>

                    {les.hasQuiz ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30 shrink-0 shadow-2xs group-hover:translate-x-0.5 transition-transform">
                        Start <ArrowRight size={13} />
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800/50 shrink-0">
                        No Quiz
                      </span>
                    )}
                  </motion.button>
                ))}
                {lessons?.length === 0 && (
                  <p className="text-slate-400 text-xs font-medium py-4 italic">No lessons found in this chapter.</p>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}