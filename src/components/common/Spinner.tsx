export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div className="h-12 w-12 rounded-full border-4 border-sky/20 border-t-sky animate-spin" />
      {label && <p className="text-ink/60 font-medium">{label}</p>}
    </div>
  );
}
