import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, LogOut, Menu, Trophy, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import type { Language } from "../../types";

const LANGS: { code: Language; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "si", label: "සිං" },
  { code: "ta", label: "தமி" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const homePath =
    user?.role === "Admin" ? "/admin" : user?.role === "Parent" ? "/parent" : "/";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const links = user
    ? user.role === "Student"
      ? [
          { to: "/", label: t.nav.dashboard },
          { to: "/practice", label: t.nav.practice },
          { to: "/mock-exam", label: t.nav.mockExam },
          { to: "/leaderboard", label: t.nav.leaderboard },
        ]
      : user.role === "Parent"
      ? [{ to: "/parent", label: t.nav.dashboard }]
      : [{ to: "/admin", label: t.nav.dashboard }]
    : [];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b-4 border-sky/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to={homePath} className="flex items-center gap-2 font-extrabold text-xl text-sky-dark">
          <span className="h-9 w-9 rounded-2xl bg-sky flex items-center justify-center text-white shadow-md">
            <GraduationCap size={20} />
          </span>
          {t.appName}
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 rounded-xl font-semibold text-ink/70 hover:text-sky-dark hover:bg-sky/10 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-cream rounded-full p-1 border-2 border-ink/5">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-3 py-1.5 rounded-full text-sm font-bold transition-colors ${
                  lang === l.code ? "bg-sunshine text-ink shadow" : "text-ink/50 hover:text-ink"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {user?.role === "Student" && (
            <Link
              to="/leaderboard"
              className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-full bg-grape/10 text-grape hover:bg-grape/20"
              title={t.nav.leaderboard}
            >
              <Trophy size={20} />
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-coral hover:bg-coral/10"
            >
              <LogOut size={16} /> {t.nav.logout}
            </button>
          ) : (
            <div className="hidden sm:flex gap-2">
              <Link to="/login" className="px-4 py-2 rounded-xl font-semibold text-sky-dark hover:bg-sky/10">
                {t.nav.login}
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl font-semibold bg-sky text-white hover:bg-sky-dark shadow"
              >
                {t.nav.register}
              </Link>
            </div>
          )}

          <button className="md:hidden p-2 text-ink" onClick={() => setOpen((o) => !o)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden bg-white border-t-2 border-ink/5 px-4 py-3 flex flex-col gap-1"
        >
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-xl font-semibold text-ink/70">
              {l.label}
            </Link>
          ))}
          <div className="flex gap-1 py-2">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                  lang === l.code ? "bg-sunshine text-ink" : "bg-cream text-ink/50"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          {user ? (
            <button onClick={handleLogout} className="px-3 py-2.5 rounded-xl font-semibold text-coral text-left">
              {t.nav.logout}
            </button>
          ) : (
            <div className="flex gap-2 pt-1">
              <Link to="/login" className="flex-1 text-center px-4 py-2 rounded-xl font-semibold text-sky-dark bg-sky/10">
                {t.nav.login}
              </Link>
              <Link to="/register" className="flex-1 text-center px-4 py-2 rounded-xl font-semibold bg-sky text-white">
                {t.nav.register}
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </header>
  );
}
