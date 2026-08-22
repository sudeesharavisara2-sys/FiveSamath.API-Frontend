import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, BookOpen, Layers, ListChecks, Sparkles } from "lucide-react";
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 text-white p-6 rounded-3xl shadow-xl shadow-slate-950/10 relative overflow-hidden"
      >
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Sparkles size={140} />
        </div>
        <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md shadow-inner relative z-10">
          <ListChecks size={26} className="text-sky-300" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-black tracking-tight">
            {mode === "practice" ? t.dashboard.startPractice : t.dashboard.startMockExam}
          </h1>
          <p className="text-slate-300 text-xs font-medium">Select your learning material to jump straight into action</p>
        </div>
      </motion.div>

      {/* Step 1: Subjects */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100">
        <p className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-2">
          <BookOpen size={15} className="text-sky-500" /> {t.dashboard.subjects}
        </p>
        {l1 ? (
          <div className="py-8 flex justify-center"><Spinner /></div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-2.5">
            {subjects?.map((s) => {
              const isSelected = subjectId === s.id;
              return (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSubjectId(s.id);
                    setBookId(null);
                    setChapterId(null);
                  }}
                  className={`text-left px-4 py-3 rounded-2xl font-bold text-sm border transition-all flex items-center justify-between ${
                    isSelected 
                      ? "bg-sky-50 text-sky-700 border-sky-200 shadow-sm" 
                      : "bg-slate-50/50 text-slate-600 border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  <span>{s.name}</span>
                  <ChevronRight size={16} className={isSelected ? "opacity-100 text-sky-500" : "opacity-30"} />
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {/* Step 2: Textbooks */}
      <AnimatePresence>
        {subjectId && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <p className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-2">
              <Layers size={15} className="text-purple-500" /> Textbooks
            </p>
            {l2 ? (
              <div className="py-8 flex justify-center"><Spinner /></div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2.5">
                {books?.map((b) => {
                  const isSelected = bookId === b.id;
                  return (
                    <motion.button
                      key={b.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setBookId(b.id);
                        setChapterId(null);
                      }}
                      className={`text-left px-4 py-3 rounded-2xl font-bold text-sm border transition-all flex items-center justify-between ${
                        isSelected 
                          ? "bg-purple-50 text-purple-700 border-purple-200 shadow-sm" 
                          : "bg-slate-50/50 text-slate-600 border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <span>{b.title}</span> 
                      <ChevronRight size={16} className={isSelected ? "opacity-100 text-purple-500" : "opacity-30"} />
                    </motion.button>
                  );
                })}
                {books?.length === 0 && <p className="text-slate-400 text-sm font-medium py-4">No textbooks available yet.</p>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 3: Chapters */}
      <AnimatePresence>
        {bookId && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <p className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3.5">Chapters</p>
            {l3 ? (
              <div className="py-8 flex justify-center"><Spinner /></div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2.5">
                {chapters?.map((c) => {
                  const isSelected = chapterId === c.id;
                  return (
                    <motion.button
                      key={c.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setChapterId(c.id)}
                      className={`text-left px-4 py-3 rounded-2xl font-bold text-sm border transition-all flex items-center justify-between ${
                        isSelected 
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm" 
                          : "bg-slate-50/50 text-slate-600 border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <span>{c.title}</span> 
                      <ChevronRight size={16} className={isSelected ? "opacity-100 text-indigo-500" : "opacity-30"} />
                    </motion.button>
                  );
                })}
                {chapters?.length === 0 && <p className="text-slate-400 text-sm font-medium py-4">No chapters found.</p>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 4: Lessons */}
      <AnimatePresence>
        {chapterId && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
          >
            <p className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3.5">Lessons & Quizzes</p>
            {l4 ? (
              <div className="py-8 flex justify-center"><Spinner /></div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2.5">
                {lessons?.map((les) => (
                  <motion.button
                    key={les.id}
                    disabled={!les.hasQuiz}
                    whileHover={les.hasQuiz ? { scale: 1.02 } : {}}
                    whileTap={les.hasQuiz ? { scale: 0.98 } : {}}
                    onClick={() => goToQuiz(les.id)}
                    className={`text-left px-4 py-3 rounded-2xl font-bold text-sm border transition-all flex items-center justify-between ${
                      les.hasQuiz
                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100/80 shadow-sm cursor-pointer" 
                        : "bg-slate-100/50 border-slate-200/50 text-slate-400 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <span>{les.title}</span> 
                    {les.hasQuiz && <ChevronRight size={16} className="text-emerald-600" />}
                  </motion.button>
                ))}
                {lessons?.length === 0 && <p className="text-slate-400 text-sm font-medium py-4">No lessons found.</p>}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}