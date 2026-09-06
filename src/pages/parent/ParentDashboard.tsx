import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  BookOpen,
  Flame,
  Sparkles,
  UserPlus,
  BarChart3,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { parentService } from "../../services/parentService";
import type { LinkedChild, ParentChildAnalytics } from "../../types";

export default function ParentDashboard() {
  const [children, setChildren] = useState<LinkedChild[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [analytics, setAnalytics] = useState<ParentChildAnalytics | null>(null);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Link child modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [studentEmail, setStudentEmail] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function loadLinkedChildren() {
      try {
        setLoadingChildren(true);
        const data = await parentService.getChildren();
        setChildren(data);
        if (data.length > 0) {
          setSelectedChildId(data[0].studentId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingChildren(false);
      }
    }
    loadLinkedChildren();
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    async function loadAnalytics() {
      try {
        setLoadingAnalytics(true);
        const data = await parentService.getChildAnalytics(selectedChildId!);
        setAnalytics(data);
      } catch (err) {
        console.error(err);
        setAnalytics(null);
      } finally {
        setLoadingAnalytics(false);
      }
    }
    loadAnalytics();
  }, [selectedChildId]);

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail) return;
    try {
      setLinking(true);
      setLinkMsg(null);
      const res = await parentService.linkChild(studentEmail);
      setLinkMsg({ type: "success", text: res.message });
      setStudentEmail("");
      // Refresh children list
      const updatedChildren = await parentService.getChildren();
      setChildren(updatedChildren);
      if (res.studentId) setSelectedChildId(res.studentId);
      setTimeout(() => setShowLinkModal(false), 1500);
    } catch (err: unknown) {
      const errorResponse = err as { response?: { data?: string | { message?: string } } };
      const errText =
        typeof errorResponse.response?.data === "string"
          ? errorResponse.response.data
          : errorResponse.response?.data?.message || "Failed to link student.";
      setLinkMsg({ type: "error", text: errText });
    } finally {
      setLinking(false);
    }
  };

  if (loadingChildren) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky border-t-transparent"></div>
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-sky-dark text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="bg-white/20 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Parent & Guardian Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">Child Learning Analytics</h1>
          <p className="text-white/80 text-sm mt-1">
            Track Grade 5 scholarship progress, quiz mastery & active streak.
          </p>
        </div>

        <button
          onClick={() => {
            setLinkMsg(null);
            setShowLinkModal(true);
          }}
          className="bg-sunshine hover:bg-amber-400 text-ink font-black text-xs px-5 py-3 rounded-2xl shadow transition-transform active:scale-95 flex items-center gap-2"
        >
          <UserPlus size={18} /> Link Student Account
        </button>
      </div>

      {/* Linked Child Selector Dropdown */}
      {children.length > 0 ? (
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border-2 border-ink/5 shadow-sm">
          <Users className="text-purple-700" size={24} />
          <span className="font-extrabold text-sm text-ink">Selected Student:</span>
          <select
            value={selectedChildId || ""}
            onChange={(e) => setSelectedChildId(Number(e.target.value))}
            className="flex-1 max-w-xs p-2.5 rounded-xl border-2 border-ink/10 font-bold text-sm text-ink bg-cream focus:outline-none focus:border-purple-600"
          >
            {children.map((child) => (
              <option key={child.studentId} value={child.studentId}>
                {child.name} ({child.gradeName})
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border-2 border-ink/5 shadow-sm">
          <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full mx-auto flex items-center justify-center text-2xl">
            👨‍👩‍👧‍👦
          </div>
          <h2 className="text-xl font-black text-ink">No Linked Student Account Yet</h2>
          <p className="text-sm text-ink/60 max-w-md mx-auto">
            Enter your child's registered 5 Samath email address below to link their account and view live progress.
          </p>
          <button
            onClick={() => setShowLinkModal(true)}
            className="bg-purple-700 text-white font-extrabold text-xs px-6 py-3 rounded-2xl shadow hover:bg-purple-800"
          >
            Link Child Account Now
          </button>
        </div>
      )}

      {/* Analytics Dashboard Content */}
      {loadingAnalytics ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto"></div>
        </div>
      ) : analytics ? (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border-2 border-ink/5 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-xs font-extrabold text-ink/60">
                <span>Total XP</span>
                <Sparkles className="text-amber-500" size={18} />
              </div>
              <div className="text-2xl font-black text-ink">{analytics.totalXP} XP</div>
              <div className="text-[11px] font-bold text-sky-dark">Level {analytics.level} Student</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border-2 border-ink/5 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-xs font-extrabold text-ink/60">
                <span>Current Streak</span>
                <Flame className="text-amber-500 fill-amber-500" size={18} />
              </div>
              <div className="text-2xl font-black text-ink">{analytics.currentStreak} Days</div>
              <div className="text-[11px] font-bold text-emerald-600">Active Study Habit</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border-2 border-ink/5 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-xs font-extrabold text-ink/60">
                <span>Average Quiz Score</span>
                <Award className="text-purple-600" size={18} />
              </div>
              <div className="text-2xl font-black text-ink">{analytics.averageQuizScore}%</div>
              <div className="text-[11px] font-bold text-purple-700">{analytics.totalQuizzesTaken} Quizzes Taken</div>
            </div>

            <div className="p-5 rounded-3xl bg-white border-2 border-ink/5 shadow-sm space-y-1">
              <div className="flex justify-between items-center text-xs font-extrabold text-ink/60">
                <span>Exam Paper Average</span>
                <BarChart3 className="text-sky" size={18} />
              </div>
              <div className="text-2xl font-black text-ink">{analytics.averagePaperScore}%</div>
              <div className="text-[11px] font-bold text-sky-dark">{analytics.totalPaperAttempts} Papers Attempted</div>
            </div>
          </div>

          {/* Subject Mastery Progress Bars */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-ink/5 shadow-md space-y-6">
            <h3 className="text-lg font-black text-ink flex items-center gap-2">
              <BookOpen className="text-sky" size={22} /> Subject Mastery & Completed Lessons
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              {analytics.subjectProgress?.map((sp) => (
                <div key={sp.subjectId} className="p-4 rounded-2xl bg-cream border border-ink/5 space-y-2">
                  <div className="flex justify-between items-center text-sm font-extrabold text-ink">
                    <span>{sp.subjectName}</span>
                    <span>{sp.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sp.progressPercentage}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-sky rounded-full"
                    />
                  </div>
                  <div className="text-xs text-ink/60 font-medium">
                    {sp.completedLessons} of {sp.totalLessons} Lessons Completed
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Earned */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-ink/5 shadow-md space-y-4">
            <h3 className="text-lg font-black text-ink flex items-center gap-2">
              <Award className="text-amber-500" size={22} /> Earned Badges & Achievements
            </h3>

            {analytics.badges?.length === 0 ? (
              <p className="text-xs text-ink/50 font-bold">No badges earned yet.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.badges?.map((b, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-amber-50/60 border border-sunshine/40 flex items-center gap-3">
                    <span className="text-3xl">🏆</span>
                    <div>
                      <div className="font-black text-sm text-ink">{b.name}</div>
                      <div className="text-xs text-ink/60">{b.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Link Child Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative"
          >
            <h3 className="text-xl font-black text-ink">Link Student Account</h3>
            <p className="text-xs text-ink/60">
              Enter your child's registered 5 Samath student email address.
            </p>

            {linkMsg && (
              <div
                className={`p-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 ${
                  linkMsg.type === "success"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {linkMsg.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {linkMsg.text}
              </div>
            )}

            <form onSubmit={handleLinkChild} className="space-y-4">
              <div>
                <label className="text-xs font-black text-ink/70 block mb-1">Student Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="student1@fivesamath.com"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-ink/10 font-bold text-sm text-ink focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="flex-1 py-3 rounded-xl border-2 border-ink/10 font-extrabold text-xs text-ink hover:bg-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linking}
                  className="flex-1 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black text-xs shadow"
                >
                  {linking ? "Linking..." : "Link Student"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
