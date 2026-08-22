import { useState, type InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  isPassword?: boolean;
}

export default function InputField({
  label,
  icon: Icon,
  isPassword,
  type,
  className = "",
  ...rest
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);

  const resolvedType = isPassword ? (show ? "text" : "password") : type;

  return (
    <label className="block mb-4">
      <span className="text-sm font-bold text-ink/60 mb-1.5 block">{label}</span>
      <div className="relative">
        <span
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
            focused ? "text-sky-dark" : "text-ink/30"
          }`}
        >
          <Icon size={18} />
        </span>

        <input
          {...rest}
          type={resolvedType}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          className={`w-full pl-11 ${isPassword ? "pr-11" : "pr-4"} py-3 rounded-2xl border-2 border-ink/10 focus:border-sky focus:outline-none font-medium transition-colors bg-white ${className}`}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        <motion.span
          className="absolute left-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-sky to-grape rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: focused ? "100%" : "0%" }}
          transition={{ duration: 0.25 }}
        />
      </div>
    </label>
  );
}