import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Sparkles,
  Trophy,
  UserPlus,
  X,
} from "lucide-react";
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
  const location = useLocation();

  const [open, setOpen] = useState(false);

  const homePath =
    user?.role === "Admin"
      ? "/admin"
      : user?.role === "Parent"
        ? "/parent"
        : "/";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  const links = user
    ? user.role === "Student"
      ? [
          {
            to: "/",
            label: t.nav.dashboard,
            icon: LayoutDashboard,
          },
          {
            to: "/practice",
            label: t.nav.practice,
            icon: BookOpen,
          },
          {
            to: "/mock-exam",
            label: t.nav.mockExam,
            icon: ClipboardCheck,
          },
          {
            to: "/leaderboard",
            label: t.nav.leaderboard,
            icon: Trophy,
          },
        ]
      : user.role === "Parent"
        ? [
            {
              to: "/parent",
              label: t.nav.dashboard,
              icon: LayoutDashboard,
            },
          ]
        : [
            {
              to: "/admin",
              label: t.nav.dashboard,
              icon: LayoutDashboard,
            },
          ]
    : [];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <motion.div
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mx-auto max-w-7xl"
      >
        {/* =========================
            MAIN NAVBAR
        ========================== */}
        <div className="relative flex min-h-[76px] items-center justify-between rounded-3xl border border-white/10 bg-slate-950/60 px-3 shadow-2xl shadow-black/20 backdrop-blur-2xl sm:px-5 lg:px-6">
          
          {/* Decorative background glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
            <div className="absolute -left-16 top-0 h-32 w-40 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="absolute -right-16 bottom-0 h-32 w-40 rounded-full bg-sky-500/10 blur-3xl" />
          </div>

          {/* =========================
              LOGO
          ========================== */}
          <Link
            to={homePath}
            onClick={() => setOpen(false)}
            className="relative z-10 flex shrink-0 items-center gap-3"
          >
            <motion.div
              whileHover={{
                scale: 1.08,
                rotate: -4,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 shadow-lg shadow-violet-500/30"
            >
              <GraduationCap
                size={25}
                strokeWidth={2.5}
                className="relative z-10 text-white"
              />

              <motion.div
                animate={{
                  scale: [1, 1.18, 1],
                  opacity: [0.12, 0.35, 0.12],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-2xl bg-white"
              />
            </motion.div>

            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="bg-gradient-to-r from-violet-300 via-white to-sky-300 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                  {t.appName}
                </span>

                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.12, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles
                    size={17}
                    className="text-amber-300"
                  />
                </motion.div>
              </div>

              <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-500">
                Learn • Practice • Achieve
              </p>
            </div>
          </Link>

          {/* =========================
              DESKTOP NAVIGATION
          ========================== */}
          <nav className="relative z-10 hidden items-center gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.035] p-1.5 lg:flex">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className="relative"
                >
                  {active && (
                    <motion.div
                      layoutId="active-nav"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 28,
                      }}
                      className="absolute inset-0 rounded-xl border border-violet-300/10 bg-gradient-to-r from-violet-500/30 via-indigo-500/20 to-sky-500/20 shadow-lg shadow-violet-500/10"
                    />
                  )}

                  <motion.div
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className={`relative flex min-h-[48px] items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                      active
                        ? "text-white"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={2.4}
                      className={
                        active
                          ? "text-sky-300"
                          : "text-slate-500 transition-colors group-hover:text-sky-300"
                      }
                    />

                    <span>{link.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* =========================
              RIGHT SIDE ACTIONS
          ========================== */}
          <div className="relative z-10 flex shrink-0 items-center gap-2.5">
            
            {/* Language Selector */}
            <div className="hidden min-h-[48px] items-center rounded-2xl border border-white/[0.08] bg-white/[0.04] p-1 sm:flex">
              {LANGS.map((language) => {
                const active = lang === language.code;

                return (
                  <motion.button
                    key={language.code}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setLang(language.code)}
                    className={`relative min-h-[38px] rounded-xl px-3 text-xs font-bold transition-colors ${
                      active
                        ? "text-white"
                        : "text-slate-500 hover:text-slate-200"
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="active-language"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                        className="absolute inset-0 rounded-xl border border-violet-400/20 bg-violet-500/25 shadow-sm shadow-violet-500/20"
                      />
                    )}

                    <span className="relative z-10">
                      {language.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Logout */}
            {user ? (
              <motion.button
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.96,
                }}
                onClick={handleLogout}
                className="hidden min-h-[48px] items-center gap-2 rounded-2xl border border-rose-400/15 bg-rose-500/[0.07] px-4 text-sm font-bold text-rose-300 transition-all hover:bg-rose-500/15 hover:text-rose-200 sm:inline-flex"
              >
                <LogOut
                  size={18}
                  strokeWidth={2.4}
                />

                <span className="hidden xl:inline">
                  {t.nav.logout}
                </span>
              </motion.button>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link to="/login">
                  <motion.div
                    whileHover={{
                      y: -2,
                    }}
                    whileTap={{
                      scale: 0.96,
                    }}
                    className="flex min-h-[48px] items-center gap-2 rounded-2xl px-4 text-sm font-bold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <LogIn
                      size={18}
                      strokeWidth={2.4}
                    />

                    <span>{t.nav.login}</span>
                  </motion.div>
                </Link>

                <Link to="/register">
                  <motion.div
                    whileHover={{
                      y: -2,
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="flex min-h-[48px] items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 px-5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-shadow hover:shadow-violet-500/40"
                  >
                    <UserPlus
                      size={18}
                      strokeWidth={2.4}
                    />

                    <span>{t.nav.register}</span>
                  </motion.div>
                </Link>
              </div>
            )}

            {/* =========================
                MOBILE MENU BUTTON
            ========================== */}
            <motion.button
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.92,
              }}
              onClick={() => setOpen((value) => !value)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.05] text-slate-300 transition hover:bg-white/[0.1] hover:text-white lg:hidden"
              aria-label="Toggle navigation menu"
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div
                    key="close"
                    initial={{
                      rotate: -90,
                      opacity: 0,
                    }}
                    animate={{
                      rotate: 0,
                      opacity: 1,
                    }}
                    exit={{
                      rotate: 90,
                      opacity: 0,
                    }}
                  >
                    <X
                      size={24}
                      strokeWidth={2.5}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{
                      rotate: 90,
                      opacity: 0,
                    }}
                    animate={{
                      rotate: 0,
                      opacity: 1,
                    }}
                    exit={{
                      rotate: -90,
                      opacity: 0,
                    }}
                  >
                    <Menu
                      size={24}
                      strokeWidth={2.5}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* =========================
            MOBILE / TABLET MENU
        ========================== */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                y: -12,
                height: 0,
              }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                y: -12,
                height: 0,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
              className="overflow-hidden lg:hidden"
            >
              <div className="mt-3 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-3 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-4">
                
                {/* Navigation Links */}
                <nav className="flex flex-col gap-2">
                  {links.map((link, index) => {
                    const Icon = link.icon;
                    const active = isActive(link.to);

                    return (
                      <motion.div
                        key={link.to}
                        initial={{
                          opacity: 0,
                          x: -15,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay: index * 0.06,
                        }}
                      >
                        <Link
                          to={link.to}
                          onClick={() => setOpen(false)}
                          className={`flex min-h-[64px] items-center gap-4 rounded-2xl px-4 text-base font-bold transition-all ${
                            active
                              ? "border border-violet-400/20 bg-gradient-to-r from-violet-500/25 via-indigo-500/15 to-sky-500/15 text-white shadow-lg shadow-violet-500/10"
                              : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                          }`}
                        >
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                              active
                                ? "bg-gradient-to-br from-violet-500/35 to-sky-500/25 text-sky-200"
                                : "bg-white/[0.05] text-slate-500"
                            }`}
                          >
                            <Icon
                              size={21}
                              strokeWidth={2.4}
                            />
                          </div>

                          <span>{link.label}</span>

                          {active && (
                            <motion.div
                              layoutId="mobile-active-dot"
                              className="ml-auto h-2.5 w-2.5 rounded-full bg-sky-300 shadow-[0_0_14px_rgba(125,211,252,0.9)]"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Language Section */}
                <div className="mt-4 border-t border-white/[0.07] pt-4">
                  <p className="mb-2 px-1 text-xs font-bold uppercase tracking-widest text-slate-500">
                    Language
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    {LANGS.map((language) => {
                      const active = lang === language.code;

                      return (
                        <motion.button
                          key={language.code}
                          whileTap={{ scale: 0.96 }}
                          onClick={() => setLang(language.code)}
                          className={`min-h-[46px] rounded-2xl border text-sm font-bold transition-all ${
                            active
                              ? "border-violet-400/20 bg-gradient-to-r from-violet-500/25 to-sky-500/20 text-white shadow-md shadow-violet-500/10"
                              : "border-white/[0.07] bg-white/[0.04] text-slate-500 hover:bg-white/[0.07] hover:text-slate-300"
                          }`}
                        >
                          {language.label}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Authentication Section */}
                <div className="mt-4 border-t border-white/[0.07] pt-4">
                  {user ? (
                    <motion.button
                      whileHover={{
                        y: -1,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      onClick={handleLogout}
                      className="flex min-h-[54px] w-full items-center justify-center gap-3 rounded-2xl border border-rose-400/20 bg-rose-500/[0.08] px-4 text-sm font-bold text-rose-300 transition hover:bg-rose-500/15"
                    >
                      <LogOut
                        size={20}
                        strokeWidth={2.4}
                      />

                      {t.nav.logout}
                    </motion.button>
                  ) : (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                      >
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          className="flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm font-bold text-slate-300"
                        >
                          <LogIn
                            size={19}
                            strokeWidth={2.4}
                          />

                          {t.nav.login}
                        </motion.div>
                      </Link>

                      <Link
                        to="/register"
                        onClick={() => setOpen(false)}
                      >
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          className="flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-sky-500 px-4 text-sm font-bold text-white shadow-lg shadow-violet-500/25"
                        >
                          <UserPlus
                            size={19}
                            strokeWidth={2.4}
                          />

                          {t.nav.register}
                        </motion.div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </header>
  );
}