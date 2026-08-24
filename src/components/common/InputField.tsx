import { useState, type InputHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, type LucideIcon } from "lucide-react";

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  isPassword?: boolean;
  error?: string;
  helperText?: string;
}

export default function InputField({
  label,
  icon: Icon,
  isPassword,
  error,
  helperText,
  type,
  className = "",
  disabled,
  ...rest
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);

  const resolvedType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="block mb-4 group">
      {/* LABEL & HELPER / ERROR HEADER */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <label className="text-xs font-black uppercase tracking-wider text-slate-700">
          {label}
        </label>
        {error ? (
          <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
            <AlertCircle size={12} /> {error}
          </span>
        ) : helperText ? (
          <span className="text-[11px] font-semibold text-slate-400">
            {helperText}
          </span>
        ) : null}
      </div>

      <div className="relative flex items-center">
        {/* LEADING ICON */}
        <span
          className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none z-10 ${
            error
              ? "text-rose-400"
              : focused
              ? "text-sky-500 scale-105"
              : "text-slate-400"
          }`}
        >
          <Icon size={18} strokeWidth={2.2} />
        </span>

        {/* INPUT FIELD */}
        <input
          {...rest}
          type={resolvedType}
          disabled={disabled}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          className={`w-full pl-11 ${
            isPassword ? "pr-11" : "pr-4"
          } py-3 text-sm font-semibold rounded-2xl border transition-all duration-200 text-slate-900 placeholder:text-slate-400 placeholder:font-normal bg-white/90 backdrop-blur-xl ${
            disabled
              ? "bg-slate-100/70 border-slate-200 text-slate-400 cursor-not-allowed"
              : error
              ? "border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 shadow-sm"
              : "border-slate-200/90 hover:border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 shadow-xs shadow-slate-100"
          } focus:outline-none ${className}`}
        />

        {/* PASSWORD VISIBILITY TOGGLE */}
        {isPassword && !disabled && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-all active:scale-95"
            title={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}

        {/* ANIMATED BOTTOM GRADIENT ACCENT BAR */}
        {!disabled && !error && (
          <motion.span
            className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 rounded-full pointer-events-none"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: focused ? 1 : 0, opacity: focused ? 1 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        )}
      </div>
    </div>
  );
}