import { useState, type ReactNode } from "react";
import { motion, useSpring } from "framer-motion";
import { GraduationCap, Sparkles, BookOpen, Stars } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { t } = useLanguage();

  // Anti-Gravity Physics for Background Orbs & Card Icons
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  const iconSpring = { damping: 18, stiffness: 90 };
  const iconX = useSpring(cursorX, iconSpring);
  const iconY = useSpring(cursorY, iconSpring);

  const [rawMousePos, setRawMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calculate normalized offset from center (-0.5 to 0.5)
    const offsetX = clientX / windowWidth - 0.5;
    const offsetY = clientY / windowHeight - 0.5;

    cursorX.set(offsetX);
    cursorY.set(offsetY);

    setRawMousePos({ x: clientX, y: clientY });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen w-full flex bg-[#060A21] overflow-hidden relative font-sans select-none"
    >
      {/* ---------------- INTERACTIVE ANTIGRAVITY CURSOR GLOW ---------------- */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-500 opacity-60"
        style={{
          background: `radial-gradient(600px circle at ${rawMousePos.x}px ${rawMousePos.y}px, rgba(56, 189, 248, 0.15), rgba(168, 85, 247, 0.05) 50%, transparent 80%)`,
        }}
      />

      {/* ---------------- LEFT PANEL (Hidden on Mobile, Visible on Desktop lg:) ---------------- */}
      <div className="hidden lg:flex lg:w-1/2 min-h-screen relative flex-col items-center justify-center p-12 lg:p-16 bg-gradient-to-br from-[#0B1130] via-[#111942] to-[#070B24] overflow-hidden border-r border-white/10">
        
        {/* Anti-Gravity Reactive Background Orbs */}
        <motion.div
          style={{
            x: useSpring(cursorX, springConfig),
            y: useSpring(cursorY, springConfig),
          }}
          className="absolute -top-20 -left-20 h-[520px] w-[520px] rounded-full bg-sky-500/25 blur-[130px] pointer-events-none"
        />
        <motion.div
          style={{
            x: useSpring(cursorX, { damping: 35, stiffness: 100 }),
            y: useSpring(cursorY, { damping: 35, stiffness: 100 }),
          }}
          className="absolute -bottom-20 -right-20 h-[520px] w-[520px] rounded-full bg-purple-600/25 blur-[130px] pointer-events-none"
        />

        {/* Dynamic Anti-Gravity Sparkles Array */}
        {[...Array(10)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-sky-400/40 pointer-events-none"
            style={{
              left: `${10 + i * 9}%`,
              top: `${12 + ((i * 17) % 75)}%`,
            }}
            animate={{
              x: [i % 2 === 0 ? 10 : -10, i % 2 === 0 ? -15 : 15, i % 2 === 0 ? 10 : -10],
              y: [0, -30, 0],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 5 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            <Sparkles size={16 + (i % 3) * 6} />
          </motion.span>
        ))}

        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center max-w-lg"
        >
          <motion.div
            style={{ x: iconX, y: iconY }}
            whileHover={{ scale: 1.08, rotate: 4 }}
            className="h-28 w-28 shrink-0 rounded-3xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-500 p-[2px] shadow-2xl shadow-sky-500/30 mb-8 flex items-center justify-center"
          >
            <div className="w-full h-full bg-[#0B1130]/90 backdrop-blur-md rounded-[22px] flex items-center justify-center text-white">
              <BookOpen size={52} className="text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]" />
            </div>
          </motion.div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight leading-tight">
            Welcome to <br />
            <span className="bg-gradient-to-r from-sky-400 via-amber-300 to-purple-400 bg-clip-text text-transparent">
              {t.appName}
            </span>
          </h1>

          <p className="text-slate-300 text-base lg:text-lg leading-relaxed max-w-md font-medium">
            Empowering your educational journey with smart tools and seamless experiences.
          </p>
        </motion.div>
      </div>

      {/* ---------------- RIGHT PANEL (Full Screen on Mobile / 50% on Desktop) ---------------- */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-4 sm:p-8 lg:p-12 relative bg-[#06091E] overflow-hidden">
        
        {/* Background Grid */}
        <motion.div
          style={{
            x: useSpring(cursorX, { damping: 40, stiffness: 80 }),
            y: useSpring(cursorY, { damping: 40, stiffness: 80 }),
          }}
          className="absolute inset-[-40px] opacity-20 bg-[linear-gradient(to_right,#ffffff0f_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"
        />

        {/* Ambient Glow Nodes */}
        <motion.div
          style={{
            x: useSpring(cursorX, { damping: 20, stiffness: 120 }),
            y: useSpring(cursorY, { damping: 20, stiffness: 120 }),
          }}
          className="absolute top-1/4 right-10 h-72 w-72 rounded-full bg-purple-600/20 blur-[110px] pointer-events-none"
        />
        <motion.div
          style={{
            x: useSpring(cursorX, { damping: 30, stiffness: 90 }),
            y: useSpring(cursorY, { damping: 30, stiffness: 90 }),
          }}
          className="absolute bottom-1/4 left-10 h-72 w-72 rounded-full bg-sky-500/20 blur-[110px] pointer-events-none"
        />

        {/* Floating Stars */}
        {[...Array(6)].map((_, i) => (
          <motion.span
            key={`star-${i}`}
            className="absolute text-amber-300/30 pointer-events-none"
            style={{
              right: `${10 + i * 15}%`,
              top: `${15 + i * 14}%`,
            }}
            animate={{
              rotate: 360,
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "linear" }}
          >
            <Stars size={18 + i * 3} />
          </motion.span>
        ))}

        {/* Glassmorphic Form Card Layout */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md relative z-20 p-6 sm:p-10 rounded-3xl bg-[#0F173B]/85 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          {/* Mobile App Branding Header */}
          <motion.div
            style={{ x: iconX, y: iconY }}
            className="flex items-center justify-center gap-3 mb-6 lg:hidden"
          >
            <span className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-sky-400 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
              <GraduationCap size={30} />
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight leading-none">{t.appName}</h1>
          </motion.div>

          {/* Form Header */}
          <div className="relative mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-slate-300 font-medium mt-2 text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>

          {/* High Contrast Form Elements & Icons Styling */}
          <div className="relative text-white space-y-4
            [&_label]:text-sky-200 [&_label]:font-semibold [&_label]:text-sm [&_label]:mb-1.5 [&_label]:block
            [&_input]:w-full [&_input]:bg-[#080D2A]/90 [&_input]:border [&_input]:border-sky-500/30 [&_input]:text-white [&_input]:rounded-xl [&_input]:pl-11 [&_input]:pr-4 [&_input]:py-3 [&_input]:outline-none [&_input::placeholder]:text-slate-400 [&_input:focus]:border-sky-400 [&_input:focus]:ring-2 [&_input:focus]:ring-sky-400/30 [&_input]:transition-all
            [&_p]:text-slate-200 [&_span]:text-slate-200 [&_small]:text-slate-300
            [&_a]:text-sky-400 [&_a]:font-bold [&_a:hover]:text-sky-300 [&_a]:transition-colors
            [&_.text-muted]:text-slate-300 [&_.text-gray-500]:text-slate-300 [&_.text-slate-500]:text-slate-300
            [&_.field-icon]:absolute [&_.field-icon]:left-3.5 [&_.field-icon]:top-1/2 [&_.field-icon]:-translate-y-1/2 [&_.field-icon]:text-sky-400 [&_.field-icon]:drop-shadow-[0_0_6px_rgba(56,189,248,0.5)] [&_.field-icon]:pointer-events-none [&_.field-icon]:z-10
            [&_svg.lucide]:text-sky-400
            [&_button[type='submit']]:w-full [&_button[type='submit']]:py-3.5 [&_button[type='submit']]:rounded-xl [&_button[type='submit']]:bg-gradient-to-r [&_button[type='submit']]:from-sky-500 [&_button[type='submit']]:to-purple-600 [&_button[type='submit']]:text-white [&_button[type='submit']]:font-bold [&_button[type='submit']]:shadow-lg [&_button[type='submit']]:shadow-sky-500/25 [&_button[type='submit']:hover]:opacity-95
          ">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}