import { motion } from "framer-motion";

export default function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total === 0 ? 0 : ((current + 1) / total) * 100;
  return (
    <div className="w-full bg-ink/5 rounded-full h-3 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-sky to-grass rounded-full"
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}
