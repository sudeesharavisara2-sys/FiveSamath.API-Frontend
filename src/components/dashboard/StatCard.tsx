import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: "sky" | "sunshine" | "grass" | "coral" | "grape";
}) {
  const bg: Record<string, string> = {
    sky: "bg-sky/15 text-sky-dark",
    sunshine: "bg-sunshine/25 text-sunshine-dark",
    grass: "bg-grass/15 text-grass-dark",
    coral: "bg-coral/15 text-coral-dark",
    grape: "bg-grape/15 text-grape",
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className="bg-white rounded-3xl p-5 shadow-md border-4 border-white flex items-center gap-4"
    >
      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${bg[color]}`}>
        <Icon size={26} />
      </div>
      <div>
        <p className="text-2xl font-extrabold leading-none">{value}</p>
        <p className="text-sm text-ink/50 font-semibold mt-1">{label}</p>
      </div>
    </motion.div>
  );
}
