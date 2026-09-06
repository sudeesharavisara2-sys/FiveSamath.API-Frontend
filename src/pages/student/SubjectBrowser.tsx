import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  BookOpen,
  Lock,
  CheckCircle,
  Play,
  ArrowLeft,
  Sparkles,
  Award,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { learningService } from "../../services/learningService";
import { textbookService } from "../../services/textbookService";
import type { Lesson, Chapter } from "../../types";

export default function SubjectBrowser() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const { user } = useAuth();
  const { t } = useLanguage();

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);

  const sId = Number(subjectId) || 1;
  const { data: textbooks = [], isLoading: textbooksLoading, isError: textbooksError, refetch: retryTextbooks } = useQuery({
    queryKey: ["student-textbooks", user?.gradeId, sId],
    queryFn: () => textbookService.getForSubject(user!.gradeId!, sId),
    enabled: Boolean(user?.gradeId && sId),
  });

  useEffect(() => {
    async function loadLessons() {
      try {
        setLoadingLessons(true);
        if (!user?.gradeId) {
          setLessons([]);
          return;
        }
        const data = await learningService.getLessonsBySubject(sId, user.gradeId);
        setLessons(data);
        if (data.length > 0) {
          setSelectedLessonId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLessons(false);
      }
    }
    loadLessons();
  }, [sId, user?.gradeId]);

  useEffect(() => {
    if (!selectedLessonId) return;
    async function loadChapters() {
      try {
        setLoadingChapters(true);
        const data = await learningService.getChaptersByLesson(selectedLessonId!);
        setChapters(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingChapters(false);
      }
    }
    loadChapters();
  }, [selectedLessonId]);

  if (loadingLessons) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky border-t-transparent"></div>
      </div>
    );
  }

  const selectedLesson = lessons.find((l) => l.id === selectedLessonId);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Back button & Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/student"
          className="p-2.5 rounded-2xl bg-white border-2 border-ink/5 text-ink hover:bg-cream transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-ink">Mathematics Adventure Map</h1>
          <p className="text-xs text-ink/60 font-semibold">
            Select any lesson. Complete chapters sequentially to unlock checkpoint quizzes!
          </p>
        </div>
      </div>

      {/* ===== LESSON SELECTOR CAROUSEL (FREELY ACCESSIBLE) ===== */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen size={16} className="text-sky" /> Choose Lesson (All Unlocked)
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((les) => {
            const isSelected = les.id === selectedLessonId;
            return (
              <button
                key={les.id}
                onClick={() => setSelectedLessonId(les.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? "bg-sky text-white border-sky-dark shadow-md scale-[1.02]"
                    : "bg-white text-ink border-ink/5 hover:border-sky/40 shadow-sm"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-sky/10 text-sky-dark"
                    }`}
                  >
                    Lesson {les.orderNumber}
                  </span>
                  {les.isCompleted && (
                    <CheckCircle className={isSelected ? "text-white" : "text-emerald-500"} size={18} />
                  )}
                </div>
                <h4 className="font-black text-base line-clamp-1">{les.title}</h4>
                <p className={`text-xs mt-1 line-clamp-2 ${isSelected ? "text-white/80" : "text-ink/60"}`}>
                  {les.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <section className="bg-white rounded-3xl p-6 border-2 border-ink/5 shadow-md space-y-4">
        <h2 className="text-xl font-black text-ink flex items-center gap-2"><BookOpen className="text-sky" size={22} /> {t.admin.textbooks}</h2>
        {textbooksLoading ? <div className="h-20 rounded-2xl bg-ink/5 animate-pulse" /> : textbooksError ? <button onClick={() => retryTextbooks()} className="text-coral font-bold">{t.common.retry}</button> : textbooks.length === 0 ? <p className="text-sm font-semibold text-ink/55">{t.admin.noTextbooks}</p> : <div className="grid sm:grid-cols-2 gap-4">{textbooks.map((book) => <article key={book.id} className="rounded-2xl bg-sky/5 border border-sky/15 p-4 flex gap-3 items-start"><BookOpen className="text-sky shrink-0" /><div className="min-w-0 flex-1"><h3 className="font-extrabold">{book.title}</h3><p className="text-xs text-ink/60 mt-1">{book.description}</p><div className="flex gap-3 mt-3"><a href={book.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-sky-dark hover:underline">{t.admin.openPdf}</a><a href={book.pdfUrl} download className="text-xs font-black text-sky-dark hover:underline">{t.admin.download}</a></div></div></article>)}</div>}
      </section>

      {/* ===== CHAPTER SEQUENTIAL GAME MAP ===== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-ink/5 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-ink/5">
          <div>
            <h2 className="text-xl font-black text-ink">{selectedLesson?.title || "Lesson Chapters"}</h2>
            <p className="text-xs text-ink/60">{selectedLesson?.description}</p>
          </div>
          <span className="bg-sunshine/20 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={14} /> +{selectedLesson?.xpReward || 50} Lesson XP
          </span>
        </div>

        {loadingChapters ? (
          <div className="py-12 text-center text-ink/50 font-semibold">Loading chapter path...</div>
        ) : chapters.length === 0 ? (
          <div className="py-12 text-center text-ink/50 font-semibold">No chapters available in this lesson yet.</div>
        ) : (
          <div className="relative py-4">
            {/* Chapter Nodes Path */}
            <div className="space-y-6 max-w-2xl mx-auto relative">
              {chapters.map((ch, idx) => {
                const isUnlocked = ch.isUnlocked;
                const isCompleted = ch.isCompleted;

                return (
                  <motion.div
                    key={ch.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative p-5 rounded-2xl border-2 flex items-center justify-between gap-4 shadow-sm ${
                      isCompleted
                        ? "bg-emerald-50 border-emerald-300"
                        : isUnlocked
                        ? "bg-white border-sky/40 hover:border-sky shadow"
                        : "bg-gray-50 border-gray-200 opacity-70"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Node Circle */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow ${
                          isCompleted
                            ? "bg-emerald-500 text-white"
                            : isUnlocked
                            ? "bg-sky text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={24} />
                        ) : isUnlocked ? (
                          <Play size={20} className="ml-0.5" />
                        ) : (
                          <Lock size={20} />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-ink/50 uppercase">
                            Chapter {ch.orderNumber}
                          </span>
                          {ch.hasQuiz && (
                            <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Award size={10} /> Checkpoint Quiz
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-base text-ink">{ch.title}</h4>
                        <p className="text-xs text-ink/60 line-clamp-1">{ch.summary}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div>
                      {isUnlocked ? (
                        <Link
                          to={`/chapter/${ch.id}`}
                          className={`px-4 py-2 rounded-xl font-extrabold text-xs inline-flex items-center gap-1.5 shadow transition-transform active:scale-95 ${
                            isCompleted
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-sky text-white hover:bg-sky-dark"
                          }`}
                        >
                          {isCompleted ? "Review" : "Start"} <ChevronRight size={16} />
                        </Link>
                      ) : (
                        <button type="button" onClick={() => toast.error(t.learning.previousChapterRequired)} className="text-xs font-bold text-gray-500 bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-xl flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky">
                          <Lock size={12} /> Locked
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
