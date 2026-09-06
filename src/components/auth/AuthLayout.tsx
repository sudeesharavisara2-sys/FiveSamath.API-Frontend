import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Brain, Gamepad2, GraduationCap, ShieldCheck, Sparkles, Target, Trophy, Users } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import type { Language } from "../../types";

const features = [
  [Sparkles, "XP & badges"], [BookOpen, "Interactive lessons"], [Trophy, "Chapter challenges"],
  [Target, "Quizzes & papers"], [Gamepad2, "Game-style learning"], [Users, "Parent progress"],
];

export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const { t, lang, setLang } = useLanguage();
  const reduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-ink lg:grid lg:grid-cols-2">
      <section className="relative isolate overflow-hidden bg-[#0c1233] px-6 py-7 text-white sm:px-10 lg:min-h-screen lg:px-14 lg:py-10">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(63,169,245,.28),transparent_30%),radial-gradient(circle_at_90%_88%,rgba(155,123,255,.26),transparent_34%)]" />
        <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:38px_38px]" />
        <Decorations reduceMotion={reduceMotion} />
        <div className="mx-auto flex max-w-xl flex-col lg:min-h-[calc(100vh-5rem)]">
          <Link to="/" className="group flex w-fit items-center gap-3" aria-label={`${t.appName} home`}>
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky text-white shadow-lg shadow-sky/30 transition-transform group-hover:-rotate-6"><GraduationCap size={23} /></span>
            <span><strong className="block text-xl font-extrabold tracking-tight">{t.appName}</strong><span className="text-xs font-bold tracking-[.18em] text-white/50">LEARN · PLAY · GROW</span></span>
          </Link>
          <div className="mt-12 lg:my-auto lg:mt-0">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-extrabold uppercase tracking-[.15em] text-sunshine"><ShieldCheck size={14} />{t.auth.authTag}</p>
            <h2 className="max-w-lg text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">{t.auth.brandHeadline.split(" ").map((word, index) => <span key={`${word}-${index}`} className={index > 1 ? "bg-gradient-to-r from-sky via-sunshine to-grass bg-clip-text text-transparent" : ""}>{word} </span>)}</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-white/65 sm:text-lg">{t.auth.brandDescription}</p>
            <div className="mt-8 grid max-w-lg grid-cols-2 gap-2.5 sm:grid-cols-3">{features.map(([Icon, label], index) => { const FeatureIcon = Icon as typeof Sparkles; return <span key={label as string} className={`flex items-center gap-2 rounded-full border border-white/10 bg-white/[.07] px-3 py-2 text-xs font-bold text-white/75 ${index > 3 ? "hidden sm:flex" : ""}`}><FeatureIcon size={14} className="shrink-0 text-sunshine" />{label as string}</span>; })}</div>
          </div>
          <div className="mt-10 flex items-center gap-3 text-xs font-bold text-white/35 lg:mt-0"><Brain size={15} />{t.auth.brandFooter}</div>
        </div>
      </section>

      <section className="relative flex min-h-[calc(100vh-15rem)] items-center justify-center px-5 py-10 sm:px-8 lg:min-h-screen lg:px-12 lg:py-14">
        <div className="absolute right-6 top-6 flex items-center gap-1 rounded-full border border-ink/10 bg-white p-1 shadow-sm sm:right-10 sm:top-8">{([['en', 'EN'], ['si', 'සිං'], ['ta', 'தமி']] as [Language, string][]).map(([code, label]) => <button type="button" key={code} onClick={() => setLang(code)} className={`rounded-full px-2.5 py-1.5 text-xs font-extrabold transition-colors ${lang === code ? "bg-sunshine text-ink" : "text-ink/45 hover:text-ink"}`}>{label}</button>)}</div>
        <motion.div initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }} className="w-full max-w-[500px] rounded-[2rem] border border-ink/[.07] bg-white p-6 shadow-[0_24px_70px_rgba(43,36,64,.10)] sm:p-9">
          <div className="mb-8"><p className="mb-2 text-sm font-extrabold text-sky-dark">{t.auth.authWelcome}</p><h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>{subtitle && <p className="mt-2 text-sm font-medium leading-6 text-ink/55">{subtitle}</p>}</div>
          {children}
          <Link to="/" className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-ink/45 hover:text-sky-dark">← {t.auth.backHome}</Link>
        </motion.div>
      </section>
    </div>
  );
}

function Decorations({ reduceMotion }: { reduceMotion: boolean | null }) {
  const marks = ["+10 XP", "★", "÷", "×", "123", "ABC"];
  return <>{marks.map((mark, index) => <motion.span key={mark} aria-hidden="true" className={`absolute select-none font-extrabold text-white/[.16] ${index % 2 ? "text-3xl" : "text-sm"}`} style={{ left: `${12 + (index * 17) % 74}%`, top: `${18 + (index * 13) % 65}%` }} animate={reduceMotion ? undefined : { y: [0, -10, 0], rotate: [0, index % 2 ? 5 : -5, 0] }} transition={{ duration: 5 + index, repeat: Infinity, ease: "easeInOut", delay: index * .25 }}>{mark}</motion.span>)}</>;
}
