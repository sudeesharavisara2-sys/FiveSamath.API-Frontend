import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Sparkles, Star } from "lucide-react";
import Navbar from "./Navbar";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#0B1020] text-white selection:bg-violet-500/40 selection:text-white">
      
      {/* =========================
          ANIMATED BACKGROUND
      ========================== */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        
        {/* Base gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#1e1b4b_0%,_transparent_35%),radial-gradient(circle_at_top_right,_#172554_0%,_transparent_35%),linear-gradient(135deg,_#080d1f_0%,_#0f172a_50%,_#111827_100%)]" />

        {/* Soft grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Purple orb */}
        <motion.div
          animate={{
            x: [0, 80, 20, 0],
            y: [0, 40, -40, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-32 -left-32 h-[32rem] w-[32rem] rounded-full bg-violet-600/30 blur-[120px]"
        />

        {/* Blue orb */}
        <motion.div
          animate={{
            x: [0, -70, 40, 0],
            y: [0, 70, -30, 0],
            scale: [1, 1.2, 1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[10%] -right-40 h-[36rem] w-[36rem] rounded-full bg-sky-500/25 blur-[130px]"
        />

        {/* Pink orb */}
        <motion.div
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.12, 0.95, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-48 left-[20%] h-[34rem] w-[34rem] rounded-full bg-fuchsia-500/20 blur-[130px]"
        />

        {/* Floating decorative elements */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[18%] left-[8%] text-violet-300/50"
        >
          <Sparkles size={28} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, 25, 0],
            rotate: [0, -15, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-[40%] right-[8%] text-sky-300/40"
        >
          <Star size={22} fill="currentColor" />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -18, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-[18%] left-[10%] text-pink-300/40"
        >
          <Sparkles size={20} />
        </motion.div>

        {/* Small glowing particles */}
        <motion.div
          animate={{
            y: [0, -35, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[25%] top-[30%] h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_25px_rgba(125,211,252,0.9)]"
        />

        <motion.div
          animate={{
            y: [0, 30, 0],
            opacity: [0.3, 0.9, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute right-[25%] top-[65%] h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_30px_rgba(167,139,250,0.9)]"
        />
      </div>

      {/* =========================
          NAVBAR
      ========================== */}
      <header className="relative z-30">
        <Navbar />
      </header>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.985,
              filter: "blur(6px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              y: -12,
              scale: 0.99,
              filter: "blur(4px)",
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="w-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="relative z-10 mt-12 border-t border-white/10 bg-slate-950/30 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-2 text-center"
          >
            <p className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-slate-300">
              <span>Made with</span>

              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex items-center justify-center"
              >
                <Heart
                  size={18}
                  className="fill-rose-400 text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.8)]"
                />
              </motion.span>

              <span>for Sri Lankan Grade 5 Scholarship students</span>

              <motion.span
                animate={{
                  rotate: [0, 15, -15, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Sparkles size={17} className="text-amber-300" />
              </motion.span>
            </p>

            <p className="text-xs tracking-wide text-slate-500">
              Learn • Practice • Achieve
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}