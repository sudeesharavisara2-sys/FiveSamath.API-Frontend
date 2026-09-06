import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { paperService } from "../../services/paperService";
import type { PaperQuestion, PaperAttemptResult } from "../../types";

export default function PaperAttempt() {
  const { paperId } = useParams<{ paperId: string }>();
  const pId = Number(paperId);

  const [title, setTitle] = useState<string>("Exam Paper");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [questions, setQuestions] = useState<PaperQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(1800);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<PaperAttemptResult | null>(null);

  useEffect(() => {
    async function loadPaperData() {
      try {
        setLoading(true);
        const data = await paperService.getPaperAttemptQuestions(pId);
        setTitle(data.title);
        setDurationMinutes(data.durationMinutes || 30);
        setQuestions(data.questions || []);
        setSecondsRemaining((data.durationMinutes || 30) * 60);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPaperData();
  }, [pId]);

  // Timer Countdown
  useEffect(() => {
    if (loading || result || isSubmitting) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitAttempt();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [loading, result, isSubmitting]);

  const handleSubmitAttempt = async () => {
    if (isSubmitting || result) return;
    try {
      setIsSubmitting(true);
      const timeTaken = durationMinutes * 60 - secondsRemaining;
      const payload = {
        paperId: pId,
        timeTakenSeconds: timeTaken,
        answers: Object.entries(answers).map(([qId, ans]) => ({
          paperQuestionId: Number(qId),
          selectedAnswer: ans,
        })),
      };
      const res = await paperService.submitPaperAttempt(pId, payload);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky border-t-transparent"></div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-3xl p-8 border-2 border-ink/5 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500 text-white rounded-full mx-auto flex items-center justify-center text-4xl shadow-lg">
            🏆
          </div>

          <div>
            <span className="bg-emerald-100 text-emerald-800 font-black text-xs px-3 py-1 rounded-full uppercase">
              Paper Attempt Completed
            </span>
            <h1 className="text-3xl font-black text-ink mt-2">{result.paperTitle}</h1>
            <p className="text-base font-bold text-ink/60 mt-1">
              Score: {result.score} / {result.totalMarks} ({result.percentage}%)
            </p>
          </div>

          {/* Performance Summary Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-cream border border-ink/5">
              <div className="text-xs font-extrabold text-ink/60">Total Score</div>
              <div className="text-xl font-black text-ink">{result.score} Marks</div>
            </div>
            <div className="p-4 rounded-2xl bg-cream border border-ink/5">
              <div className="text-xs font-extrabold text-ink/60">Percentage</div>
              <div className="text-xl font-black text-sky-dark">{result.percentage}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-cream border border-ink/5">
              <div className="text-xs font-extrabold text-ink/60">Time Taken</div>
              <div className="text-xl font-black text-purple-700">
                {Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s
              </div>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div className="text-left space-y-4 pt-6 border-t border-ink/10">
            <h3 className="font-extrabold text-lg text-ink">Detailed Question Breakdown:</h3>
            {result.feedback?.map((f, idx) => (
              <div
                key={f.questionId}
                className={`p-5 rounded-2xl border-2 space-y-2 ${
                  f.isCorrect ? "bg-emerald-50 border-emerald-300" : "bg-rose-50 border-rose-300"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-extrabold text-sm text-ink">
                    Q{idx + 1}: {f.questionText}
                  </span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                    f.isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                  }`}>
                    {f.isCorrect ? `+${f.marksObtained} Marks` : "0 Marks"}
                  </span>
                </div>
                <div className="text-xs text-ink/70">
                  Your Answer: <span className="font-bold">{f.selectedAnswer || "None"}</span> | Correct Answer: <span className="font-bold text-emerald-700">{f.correctAnswer}</span>
                </div>
                {f.explanation && (
                  <div className="text-xs text-ink/80 bg-white/80 p-3 rounded-xl font-medium mt-1">
                    💡 Explanation: {f.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Link
              to="/mock-exam"
              className="bg-sky text-white font-extrabold px-8 py-3 rounded-2xl shadow hover:bg-sky-dark inline-flex items-center gap-2"
            >
              <ArrowLeft size={18} /> Back to Exam Papers
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner with Countdown */}
      <div className="bg-white rounded-3xl p-6 border-2 border-ink/5 shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-black uppercase text-sky-dark bg-sky/10 px-3 py-1 rounded-full">
            Online Exam Mode
          </span>
          <h1 className="text-xl font-black text-ink mt-1">{title}</h1>
        </div>

        <div className="flex items-center gap-3 bg-amber-50 border-2 border-sunshine/40 px-4 py-2 rounded-2xl">
          <Clock className="text-amber-600 animate-pulse" size={20} />
          <div className="text-right">
            <div className="text-[10px] uppercase font-extrabold text-amber-700">Time Left</div>
            <div className="text-lg font-black text-amber-900">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>

      {/* Question Navigator Dots */}
      <div className="bg-white rounded-2xl p-4 border border-ink/5 flex flex-wrap gap-2">
        {questions.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = idx === currentIdx;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`w-9 h-9 rounded-xl font-black text-xs transition-colors ${
                isCurrent
                  ? "bg-sky text-white ring-2 ring-sky-dark shadow"
                  : isAnswered
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-cream text-ink/50 hover:bg-ink/10"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-ink/5 shadow-lg space-y-6">
          <div className="flex justify-between items-center text-xs font-bold text-ink/60 border-b border-ink/5 pb-3">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span>{currentQ.marks} Marks</span>
          </div>

          <h3 className="text-xl font-black text-ink leading-snug">{currentQ.questionText}</h3>

          {/* Options */}
          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            {[
              { key: "A", text: currentQ.optionA },
              { key: "B", text: currentQ.optionB },
              { key: "C", text: currentQ.optionC },
              { key: "D", text: currentQ.optionD },
            ].map((opt) => {
              const isSelected = answers[currentQ.id] === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: opt.key }))}
                  className={`p-4 rounded-2xl border-2 text-left font-bold text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-sky text-white border-sky-dark shadow-md scale-[1.01]"
                      : "bg-white text-ink border-ink/10 hover:border-sky/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                      isSelected ? "bg-white/20 text-white" : "bg-sky/10 text-sky-dark"
                    }`}>
                      {opt.key}
                    </span>
                    <span>{opt.text}</span>
                  </div>
                  {isSelected && <CheckCircle size={18} />}
                </button>
              );
            })}
          </div>

          {/* Bottom Nav Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-ink/5">
            <button
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
              className="px-4 py-2.5 rounded-xl bg-cream hover:bg-ink/10 font-bold text-xs text-ink disabled:opacity-40 flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            {currentIdx === questions.length - 1 ? (
              <button
                onClick={handleSubmitAttempt}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow flex items-center gap-1.5"
              >
                <CheckCircle size={18} /> {isSubmitting ? "Submitting..." : "Submit Paper"}
              </button>
            ) : (
              <button
                onClick={() => setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))}
                className="px-5 py-2.5 rounded-xl bg-sky hover:bg-sky-dark text-white font-black text-xs shadow flex items-center gap-1"
              >
                Next Question <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
