import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { quizService } from "../../services/quizService";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import type { SubmitQuizResponse } from "../../types";
import QuestionCard from "./QuestionCard";
import ProgressBar from "./ProgressBar";
import QuestionNav from "./QuestionNav";
import Timer from "./Timer";
import ResultsModal from "./ResultsModal";
import Spinner from "../common/Spinner";
import Button from "../common/Button";

interface QuizEngineProps {
  quizId: number;
  mode: "practice" | "exam";
  durationMinutes?: number;
}

export default function QuizEngine({ quizId, mode, durationMinutes = 30 }: QuizEngineProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => quizService.getQuiz(quizId),
  });

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<SubmitQuizResponse | null>(null);

  const questions = data?.questions ?? [];
  const question = questions[current];

  const answeredSet = useMemo(
    () => new Set(questions.map((q, i) => (answers[q.id] ? i : -1)).filter((i) => i >= 0)),
    [answers, questions]
  );

  const { mutate: submit, isPending } = useMutation({
    mutationFn: () =>
      quizService.submitQuiz({
        quizId,
        userId: user!.id,
        answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
          questionId: Number(questionId),
          selectedAnswer,
        })),
      }),
    onSuccess: (res) => {
      setResult(res);
      qc.invalidateQueries({ queryKey: ["analytics"] });
      qc.invalidateQueries({ queryKey: ["badges"] });
    },
    onError: () => toast.error(t.common.error),
  });

  if (isLoading) return <Spinner label={t.common.loading} />;
  if (isError || !data || questions.length === 0)
    return <p className="text-center text-coral-dark font-semibold py-16">{t.common.error}</p>;

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

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between gap-3">
        <ProgressBar current={current} total={questions.length} />
        {mode === "exam" && (
          <Timer totalSeconds={durationMinutes * 60} onExpire={() => submit()} />
        )}
      </div>

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

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
        >
          <ChevronLeft size={18} /> {t.quiz.previous}
        </Button>

        {current === questions.length - 1 ? (
          <Button variant="success" isLoading={isPending} onClick={handleSubmit}>
            {mode === "exam" ? t.quiz.finish : t.quiz.submit}
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setCurrent((c) => Math.min(c + 1, questions.length - 1))}>
            {t.quiz.next} <ChevronRight size={18} />
          </Button>
        )}
      </div>

      {result && (
        <ResultsModal
          result={result}
          onRetry={() => {
            setResult(null);
            setAnswers({});
            setFlagged(new Set());
            setCurrent(0);
          }}
        />
      )}
    </div>
  );
}
