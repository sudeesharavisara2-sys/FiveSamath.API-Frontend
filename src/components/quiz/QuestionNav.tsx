export default function QuestionNav({
  total,
  current,
  answered,
  flagged,
  onJump,
}: {
  total: number;
  current: number;
  answered: Set<number>;
  flagged: Set<number>;
  onJump: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
      {Array.from({ length: total }).map((_, i) => {
        const isCurrent = i === current;
        const isAnswered = answered.has(i);
        const isFlagged = flagged.has(i);
        return (
          <button
            key={i}
            onClick={() => onJump(i)}
            className={`relative h-9 w-9 rounded-xl font-bold text-sm flex items-center justify-center transition-colors ${
              isCurrent
                ? "bg-sky text-white shadow"
                : isAnswered
                ? "bg-grass/20 text-grass-dark"
                : "bg-ink/5 text-ink/40 hover:bg-ink/10"
            }`}
          >
            {i + 1}
            {isFlagged && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-sunshine border-2 border-white" />
            )}
          </button>
        );
      })}
    </div>
  );
}
