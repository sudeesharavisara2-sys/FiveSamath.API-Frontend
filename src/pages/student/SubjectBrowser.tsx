import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronRight, BookOpen, Layers, ListChecks } from "lucide-react";
import { learningService } from "../../services/learningService";
import { useLanguage } from "../../context/LanguageContext";
import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";

// Practice/Mock-exam entry point: Subject -> TextBook -> Chapter -> Lesson (with quiz).
// NOTE: the API does not expose a lesson->quiz lookup, so by seed convention the
// quiz id used for a lesson equals the lesson id (see QuizController.GetQuiz).
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
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-extrabold flex items-center gap-2">
        <ListChecks className="text-sky-dark" />
        {mode === "practice" ? t.dashboard.startPractice : t.dashboard.startMockExam}
      </h1>

      <Card>
        <p className="font-bold text-ink/60 mb-3 flex items-center gap-2">
          <BookOpen size={16} /> {t.dashboard.subjects}
        </p>
        {l1 ? (
          <Spinner />
        ) : (
          <div className="flex flex-wrap gap-2">
            {subjects?.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSubjectId(s.id);
                  setBookId(null);
                  setChapterId(null);
                }}
                className={`px-4 py-2 rounded-xl font-semibold border-2 ${
                  subjectId === s.id ? "border-sky bg-sky/10 text-sky-dark" : "border-ink/10 text-ink/60"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        )}
      </Card>

      {subjectId && (
        <Card>
          <p className="font-bold text-ink/60 mb-3 flex items-center gap-2">
            <Layers size={16} /> Textbooks
          </p>
          {l2 ? (
            <Spinner />
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {books?.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBookId(b.id);
                    setChapterId(null);
                  }}
                  className={`text-left px-4 py-3 rounded-xl font-semibold border-2 flex items-center justify-between ${
                    bookId === b.id ? "border-sky bg-sky/10 text-sky-dark" : "border-ink/10 text-ink/60"
                  }`}
                >
                  {b.title} <ChevronRight size={16} />
                </button>
              ))}
              {books?.length === 0 && <p className="text-ink/40 text-sm">No textbooks yet.</p>}
            </div>
          )}
        </Card>
      )}

      {bookId && (
        <Card>
          <p className="font-bold text-ink/60 mb-3">Chapters</p>
          {l3 ? (
            <Spinner />
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {chapters?.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setChapterId(c.id)}
                  className={`text-left px-4 py-3 rounded-xl font-semibold border-2 flex items-center justify-between ${
                    chapterId === c.id ? "border-sky bg-sky/10 text-sky-dark" : "border-ink/10 text-ink/60"
                  }`}
                >
                  {c.title} <ChevronRight size={16} />
                </button>
              ))}
              {chapters?.length === 0 && <p className="text-ink/40 text-sm">No chapters yet.</p>}
            </div>
          )}
        </Card>
      )}

      {chapterId && (
        <Card>
          <p className="font-bold text-ink/60 mb-3">Lessons</p>
          {l4 ? (
            <Spinner />
          ) : (
            <div className="grid sm:grid-cols-2 gap-2">
              {lessons?.map((les) => (
                <button
                  key={les.id}
                  disabled={!les.hasQuiz}
                  onClick={() => goToQuiz(les.id)}
                  className={`text-left px-4 py-3 rounded-xl font-semibold border-2 flex items-center justify-between ${
                    les.hasQuiz
                      ? "border-grass/40 bg-grass/5 text-grass-dark hover:bg-grass/15"
                      : "border-ink/5 text-ink/30 cursor-not-allowed"
                  }`}
                >
                  {les.title} {les.hasQuiz && <ChevronRight size={16} />}
                </button>
              ))}
              {lessons?.length === 0 && <p className="text-ink/40 text-sm">No lessons yet.</p>}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
