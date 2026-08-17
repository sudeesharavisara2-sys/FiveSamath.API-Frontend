import { motion, AnimatePresence } from "framer-motion";
import { Check, Flag, X } from "lucide-react";
import type { OptionKey, Question } from "../../types";
import { useLanguage } from "../../context/LanguageContext";

const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

interface Props {
  question: Question;
  index: number;
  total: number;
  selected?: string;
  onSelect: (option: string) => void;
  flagged: boolean;
  onToggleFlag: () => void;
  instantFeedback?: boolean;
  showFlag?: boolean;
}

export default function QuestionCard({
  question,
  index,
  total,
  selected,
  onSelect,
  flagged,
  onToggleFlag,
  instantFeedback = false,
  showFlag = true,
}: Props) {
  const { t } = useLanguage();
  const options: Record<OptionKey, string> = {
    A: question.optionA,
    B: question.optionB,
    C: question.optionC,
    D: question.optionD,
  };

  const hasAnswered = !!selected;
  const isCorrectKnown = Boolean(instantFeedback && hasAnswered && question.correctAnswer);

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="bg-white rounded-[1.75rem] shadow-lg border-4 border-white p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-sky-dark bg-sky/10 px-3 py-1 rounded-full">
          {t.quiz.question} {index + 1} {t.quiz.of} {total}
        </span>
        {showFlag && (
          <button
            onClick={onToggleFlag}
            className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full transition-colors ${
              flagged ? "bg-sunshine text-ink" : "text-ink/40 hover:bg-ink/5"
            }`}
          >
            <Flag size={14} fill={flagged ? "currentColor" : "none"} />
            {flagged ? t.quiz.unflag : t.quiz.flag}
          </button>
        )}
      </div>

      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt=""
          className="w-full max-h-64 object-contain rounded-2xl mb-4 bg-ink/5"
        />
      )}

      <h3 className="text-xl font-bold text-ink mb-5 leading-snug">{question.questionText}</h3>

      <div className="grid sm:grid-cols-2 gap-3">
        {OPTION_KEYS.map((key) => {
          const isSelected = selected === key;
          const isCorrectOption = isCorrectKnown && question.correctAnswer === key;
          const isWrongSelected = isCorrectKnown && isSelected && question.correctAnswer !== key;

          return (
            <motion.button
              key={key}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(key)}
              disabled={isCorrectKnown}
              className={`text-left px-4 py-3.5 rounded-2xl border-2 font-semibold flex items-center gap-3 transition-colors ${
                isCorrectOption
                  ? "border-grass bg-grass/10 text-grass-dark"
                  : isWrongSelected
                  ? "border-coral bg-coral/10 text-coral-dark"
                  : isSelected
                  ? "border-sky bg-sky/10 text-sky-dark"
                  : "border-ink/10 hover:border-sky/40 hover:bg-sky/5"
              }`}
            >
              <span
                className={`h-7 w-7 flex items-center justify-center rounded-full text-sm font-extrabold shrink-0 ${
                  isSelected || isCorrectOption ? "bg-current text-white" : "bg-ink/5"
                }`}
              >
                {isCorrectOption ? <Check size={16} /> : isWrongSelected ? <X size={16} /> : key}
              </span>
              <span>{options[key]}</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {isCorrectKnown && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 font-bold ${
              selected === question.correctAnswer ? "text-grass-dark" : "text-coral-dark"
            }`}
          >
            {selected === question.correctAnswer ? `🎉 ${t.quiz.correct}!` : `${t.quiz.incorrect}.`}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
