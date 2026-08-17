import { useEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Timer({
  totalSeconds,
  onExpire,
}: {
  totalSeconds: number;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const { t } = useLanguage();
  const expiredRef = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpire();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isLow = remaining <= 60;

  return (
    <div
      className={`flex items-center gap-2 font-extrabold px-4 py-2 rounded-2xl ${
        isLow ? "bg-coral/15 text-coral-dark animate-pulse" : "bg-sky/15 text-sky-dark"
      }`}
      title={t.quiz.timeLeft}
    >
      <Clock size={18} />
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
}
