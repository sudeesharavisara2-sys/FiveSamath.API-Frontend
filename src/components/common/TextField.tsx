import type { InputHTMLAttributes } from "react";

export default function TextField({
  label,
  className = "",
  ...rest
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block mb-4">
      <span className="text-sm font-bold text-ink/60 mb-1.5 block">{label}</span>
      <input
        {...rest}
        className={`w-full px-4 py-3 rounded-2xl border-2 border-ink/10 focus:border-sky focus:outline-none font-medium transition-colors ${className}`}
      />
    </label>
  );
}
