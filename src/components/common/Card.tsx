import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function Card({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`card-pop bg-white rounded-[1.75rem] shadow-md border-4 border-white p-5 ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
