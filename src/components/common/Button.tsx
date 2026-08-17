import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variants: Record<string, string> = {
  primary: "bg-sky text-white hover:bg-sky-dark shadow-sky/30",
  secondary: "bg-sunshine text-ink hover:bg-sunshine-dark shadow-sunshine/40",
  success: "bg-grass text-white hover:bg-grass-dark shadow-grass/30",
  danger: "bg-coral text-white hover:bg-coral-dark shadow-coral/30",
  ghost: "bg-white text-ink hover:bg-ink/5 border-2 border-ink/10",
};

const sizes: Record<string, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      disabled={disabled || isLoading}
      className={`font-semibold rounded-2xl shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${className}`}
      {...(rest as any)}
    >
      {isLoading ? (
        <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
}
