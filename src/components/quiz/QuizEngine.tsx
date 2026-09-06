import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Award } from "lucide-react";
import { quizService } from "../../services/quizService";
import { useLanguage } from "../../context/LanguageContext";
import type { QuizResultResponse } from "../../types";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import QuestionNav from "./QuestionNav";
import Timer from "./Timer";
import Spinner from "../common/Spinner";
import Button from "../common/Button";

interface QuizEngineProps {
  quizId?: number;
  chapterId?: number;
  mode?: "practice" | "exam";
  durationMinutes?: number;
  onComplete?: () => void;
}

export default function QuizEngine({
  quizId,
  chapterId,
  mode = "practice",
  durationMinutes = 30,
  onComplete,
}: QuizEngineProps) {
  const { t } = useLanguage();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz", quizId, chapterId],
    queryFn: () => {
      if (chapterId) return quizService.getChapterQuiz(chapterId);
      if (quizId) return quizService.getQuiz(quizId);
      throw new Error("No quizId or chapterId provided.");
    },
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<QuizResultResponse | null>(null);

  const questions = data?.questions ?? [];
  const question = questions[current];

  const answeredSet = useMemo(
    () => new Set(questions.map((q, i) => (answers[q.id] ? i : -1)).filter((i) => i >= 0)),
    [answers, questions]
  );

  const { mutate: submit, isPending } = useMutation({
    mutationFn: () =>
      quizService.submitQuiz({
        quizId: data!.id,
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId: Number(questionId),
          selectedAnswer,
        })),
      }),
    onSuccess: (res) => {
      setResult(res);
      qc.invalidateQueries({ queryKey: ["analytics"] });
      qc.invalidateQueries({ queryKey: ["badges"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      if (res.passed && onComplete) {
        onComplete();
      }
    },
    onError: () => toast.error(t.common.error),
  });

  if (isLoading) return <Spinner label={t.common.loading} />;
  if (isError || !data || questions.length === 0)
    return <p className="text-center text-coral-dark font-semibold py-12">{t.common.error}</p>;

  const handleSelect = (option: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: option }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(current) ? next.delete(current) : next.add(current);
      return next;
    });
  };

  const handleSubmit = () => {
    const unansweredCount = questions.length - Object.keys(answers).length;
    if (unansweredCount > 0 && !window.confirm(`${unansweredCount} ${t.quiz.unanswered}. ${t.quiz.confirmSubmit}`)) {
      return;
    }
    submit();
  };

  if (result) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-ink/5 shadow-lg max-w-2xl mx-auto space-y-6 text-center">
        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl shadow-lg ${
          result.passed ? "bg-emerald-500 text-white" : "bg-coral text-white"
        }`}>
          {result.passed ? "🏆" : "💪"}
        </div>

        <div>
          <h2 className="text-2xl font-black text-ink">{result.message}</h2>
          <p className="text-sm font-bold text-ink/60 mt-1">
            Score: {result.score} / {result.totalQuestions} ({result.percentage}%)
          </p>
          {result.xpEarned > 0 && (
            <span className="inline-block bg-sunshine/20 text-amber-800 font-extrabold text-xs px-4 py-1.5 rounded-full mt-2">
              +{result.xpEarned} Bonus XP Earned! 🌟
            </span>
          )}
        </div>

        {/* Detailed Feedback */}
        <div className="text-left space-y-3 pt-4 border-t border-ink/10">
          <h3 className="font-extrabold text-sm text-ink">Answer Review & Explanations:</h3>
          {result.feedback?.map((f, i) => (
            <div
              key={f.questionId}
              className={`p-4 rounded-2xl border-2 ${
                f.isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold mb-1">
                <span>Q{i + 1}: {f.questionText}</span>
                <span className={f.isCorrect ? "text-emerald-600" : "text-rose-600"}>
                  {f.isCorrect ? "Correct ✓" : "Incorrect ✗"}
                </span>
              </div>
              <div className="text-xs text-ink/70 mt-1">
                Your Answer: <span className="font-bold">{f.selectedAnswer || "None"}</span> | Correct: <span className="font-bold">{f.correctAnswer}</span>
              </div>
              {f.explanation && (
                <div className="text-xs text-ink/80 bg-white/70 p-2 rounded-xl mt-2 font-medium">
                  💡 {f.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setResult(null);
            setAnswers({});
            setCurrent(0);
          }}
        >
          {t.quiz.tryAgain}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5 bg-white p-6 rounded-3xl border-2 border-ink/5 shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Award className="text-sky" size={20} />
          <span className="font-black text-sm text-ink">{data.title}</span>
        </div>
        {mode === "exam" && (
          <Timer totalSeconds={durationMinutes * 60} onExpire={() => submit()} />
        )}
      </div>

      <ProgressBar current={current} total={questions.length} />

      {mode === "exam" && (
        <QuestionNav
          total={questions.length}
          current={current}
          answered={answeredSet}
          flagged={flagged}
          onJump={setCurrent}
        />
      )}

      <AnimatePresence mode="wait">
        <QuestionCard
          key={question.id}
          question={question}
          index={current}
          total={questions.length}
          selected={answers[question.id]}
          onSelect={handleSelect}
          flagged={flagged.has(current)}
          onToggleFlag={toggleFlag}
          instantFeedback={mode === "practice"}
        />
      </AnimatePresence>

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
        >
          <ChevronLeft size={18} /> {t.quiz.previous}
        </Button>

        {current === questions.length - 1 ? (
          <Button variant="success" isLoading={isPending} onClick={handleSubmit}>
            {t.quiz.submit}
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setCurrent((c) => Math.min(c + 1, questions.length - 1))}>
            {t.quiz.next} <ChevronRight size={18} />
          </Button>
        )}
      </div>
    </div>
  );
}
