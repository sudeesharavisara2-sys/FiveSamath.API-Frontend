import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Video,
  Sparkles,
  Award,
  CheckCircle,
  Play,
  Download,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { learningService } from "../../services/learningService";
import type { Chapter, Animation, AnimationScene } from "../../types";
import QuizEngine from "../../components/quiz/QuizEngine";

export default function ChapterView() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const cId = Number(chapterId);

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"read" | "materials" | "animation" | "quiz">("read");
  const [isCompleted, setIsCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [xpEarnedNotice, setXpEarnedNotice] = useState<string | null>(null);

  // Animation player state
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);

  useEffect(() => {
    async function loadChapter() {
      try {
        setLoading(true);
        const data = await learningService.getChapterDetails(cId);
        setChapter(data);
        setIsCompleted(!!data.isCompleted);
      } catch (err: unknown) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadChapter();
  }, [cId]);

  const handleCompleteChapter = async () => {
    try {
      setCompleting(true);
      const res = await learningService.completeChapter(cId);
      setIsCompleted(true);
      if (res.xpEarned > 0) {
        setXpEarnedNotice(`+${res.xpEarned} XP Earned! ${res.isLessonCompleted ? "Lesson Completed! 🎉" : ""}`);
      } else {
        setXpEarnedNotice("Chapter Completed! 🎉");
      }
    } catch (err: unknown) {
      console.error(err);
      const message = (err as { response?: { data?: { message?: string } | string } }).response?.data;
      toast.error(typeof message === "string" ? message : message?.message || "Could not complete chapter.");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky border-t-transparent"></div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <h2 className="text-2xl font-black text-ink">Chapter Locked or Not Found</h2>
        <p className="text-ink/60">Complete previous chapters in order to unlock this adventure!</p>
        <Link to="/student" className="inline-block bg-sky text-white font-extrabold px-6 py-2.5 rounded-xl shadow">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const animation: Animation | undefined = chapter.animations?.[0];
  const scenes: AnimationScene[] = animation?.scenes || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <Link
          to={`/subject/${chapter.subjectId ?? 1}`}
          className="p-2.5 rounded-2xl bg-white border-2 border-ink/5 text-ink hover:bg-cream transition-colors shadow-sm inline-flex items-center gap-2 text-xs font-bold"
        >
          <ArrowLeft size={16} /> Back to Chapters
        </Link>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="bg-emerald-100 text-emerald-700 font-black text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <CheckCircle size={16} /> Chapter Completed
            </span>
          ) : chapter.hasQuiz ? (
            <button
              onClick={() => setActiveTab("quiz")}
              className="bg-sunshine hover:bg-amber-400 text-ink font-black text-xs px-4 py-2 rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Award size={16} /> Pass Quiz to Complete
            </button>
          ) : (
            <button
              onClick={handleCompleteChapter}
              disabled={completing}
              className="bg-sunshine hover:bg-amber-400 text-ink font-black text-xs px-4 py-2 rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles size={16} /> {completing ? "Saving..." : "Mark Complete"}
            </button>
          )}
        </div>
      </div>

      {/* Completion Banner */}
      {xpEarnedNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-500 text-white font-black text-center py-3 px-4 rounded-2xl shadow-md flex items-center justify-center gap-2"
        >
          <Sparkles className="animate-spin" size={20} /> {xpEarnedNotice}
        </motion.div>
      )}

      {/* Chapter Title & Navigation Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-ink/5 shadow-md space-y-6">
        <div>
          <span className="text-xs font-black text-sky-dark uppercase tracking-wider bg-sky/10 px-3 py-1 rounded-full">
            Chapter {chapter.orderNumber}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-ink mt-2">{chapter.title}</h1>
          <p className="text-sm text-ink/70 mt-1">{chapter.summary}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-ink/10 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab("read")}
            className={`px-4 py-2.5 font-extrabold text-sm rounded-t-2xl transition-colors flex items-center gap-2 ${
              activeTab === "read"
                ? "bg-sky/10 text-sky-dark border-b-4 border-sky"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            <BookOpen size={18} /> Reading Lesson
          </button>

          {chapter.materials && chapter.materials.length > 0 && (
            <button
              onClick={() => setActiveTab("materials")}
              className={`px-4 py-2.5 font-extrabold text-sm rounded-t-2xl transition-colors flex items-center gap-2 ${
                activeTab === "materials"
                  ? "bg-sky/10 text-sky-dark border-b-4 border-sky"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              <FileText size={18} /> Worksheets & Media ({chapter.materials.length})
            </button>
          )}

          {scenes.length > 0 && (
            <button
              onClick={() => setActiveTab("animation")}
              className={`px-4 py-2.5 font-extrabold text-sm rounded-t-2xl transition-colors flex items-center gap-2 ${
                activeTab === "animation"
                  ? "bg-purple-100 text-purple-700 border-b-4 border-purple-600"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              <Play size={18} /> Animated Story 🎬
            </button>
          )}

          {chapter.hasQuiz && (
            <button
              onClick={() => setActiveTab("quiz")}
              className={`px-4 py-2.5 font-extrabold text-sm rounded-t-2xl transition-colors flex items-center gap-2 ${
                activeTab === "quiz"
                  ? "bg-amber-100 text-amber-800 border-b-4 border-sunshine"
                  : "text-ink/60 hover:text-ink"
              }`}
            >
              <Award size={18} /> Checkpoint Quiz 🎯
            </button>
          )}
        </div>

        {/* ===== TAB CONTENT ===== */}
        <div>
          {/* TAB 1: READING LESSON CONTENT */}
          {activeTab === "read" && (
            <div className="prose max-w-none space-y-4 text-ink">
              <div className="p-6 rounded-2xl bg-cream border border-ink/5 whitespace-pre-line text-base font-medium leading-relaxed">
                {chapter.content || "Chapter lesson notes loading..."}
              </div>
            </div>
          )}

          {/* TAB 2: WORKSHEETS & MEDIA MATERIALS */}
          {activeTab === "materials" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {chapter.materials?.map((mat) => (
                <div
                  key={mat.id}
                  className="p-5 rounded-2xl border-2 border-ink/5 bg-white shadow-sm flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 rounded-xl bg-sky/10 text-sky-dark">
                      {mat.materialType === "Video" ? <Video size={24} /> : <FileText size={24} />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-ink">{mat.title}</h4>
                      <p className="text-xs text-ink/60 mt-0.5">{mat.description}</p>
                    </div>
                  </div>

                  {mat.materialType === "Video" && mat.externalUrl && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-black mt-2">
                      <iframe
                        src={mat.externalUrl}
                        title={mat.title}
                        className="w-full h-full border-0"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}

                  {mat.materialType === "Video" && !mat.externalUrl && mat.fileUrl && (
                    <video src={mat.fileUrl} controls className="w-full rounded-xl bg-black mt-2" />
                  )}

                  {(mat.fileUrl || mat.externalUrl) && mat.materialType !== "Video" && (
                    <a
                      href={mat.fileUrl || mat.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-extrabold text-sky-dark hover:underline pt-2"
                    >
                      <Download size={14} /> Open / Download File <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: ANIMATION SCENE BUILDER PLAYER */}
          {activeTab === "animation" && scenes.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 text-white shadow-xl space-y-6">
              <div className="flex justify-between items-center text-xs font-extrabold text-white/70">
                <span>{animation?.title || "Animated Story"}</span>
                <span>Scene {currentSceneIdx + 1} of {scenes.length}</span>
              </div>

              {/* Animated Slide Canvas */}
              <div className="min-h-[260px] bg-black/30 backdrop-blur rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden border border-white/10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSceneIdx}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 max-w-lg"
                  >
                    <div className="text-4xl">🤖</div>
                    <p className="text-xl font-black text-amber-300 leading-snug">
                      {scenes[currentSceneIdx]?.textContent}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Scene Navigator Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentSceneIdx === 0}
                  onClick={() => setCurrentSceneIdx((i) => Math.max(0, i - 1))}
                  className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft size={16} /> Previous Scene
                </button>

                <div className="flex gap-1.5">
                  {scenes.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSceneIdx(i)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        i === currentSceneIdx ? "bg-sunshine" : "bg-white/30"
                      }`}
                    />
                  ))}
                </div>

                <button
                  disabled={currentSceneIdx === scenes.length - 1}
                  onClick={() => setCurrentSceneIdx((i) => Math.min(scenes.length - 1, i + 1))}
                  className="px-4 py-2 rounded-xl bg-sunshine hover:bg-amber-400 text-ink font-black text-xs disabled:opacity-40 flex items-center gap-1"
                >
                  Next Scene <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: CHECKPOINT QUIZ */}
          {activeTab === "quiz" && (
            <QuizEngine chapterId={cId} onComplete={handleCompleteChapter} />
          )}
        </div>
      </div>
    </div>
  );
}
