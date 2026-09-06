import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Download,
  Play,
  Clock,
  Award,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { paperService } from "../../services/paperService";
import type { Paper } from "../../types";

export default function Papers() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("All");

  useEffect(() => {
    async function loadPapers() {
      try {
        setLoading(true);
        if (!user?.gradeId) {
          setPapers([]);
          return;
        }
        const data = await paperService.getPapers(user.gradeId);
        setPapers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPapers();
  }, [user?.gradeId]);

  const filteredPapers = papers.filter((p) => {
    if (filterType === "All") return true;
    return p.paperType.toLowerCase().includes(filterType.toLowerCase());
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky to-sky-dark text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="bg-white/20 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            {user?.gradeId ? `${t.learning.grade} ${user.gradeId}` : t.dashboard.gradeUnavailable}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">{t.papers.title}</h1>
          <p className="text-white/80 text-sm mt-1">{t.papers.subtitle}</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 bg-white/10 p-1.5 rounded-2xl backdrop-blur">
          {["All", "Model Paper", "Past Paper"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-colors ${
                filterType === type ? "bg-white text-sky-dark shadow" : "text-white/80 hover:text-white"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Papers Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky border-t-transparent mx-auto"></div>
        </div>
      ) : filteredPapers.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center text-ink/50 font-bold border-2 border-ink/5">
          No exam papers found for this filter. Check back soon!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper, idx) => (
            <motion.div
              key={paper.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-3xl p-6 border-2 border-ink/5 shadow-md flex flex-col justify-between space-y-4 hover:border-sky/40 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="bg-sky/10 text-sky-dark font-extrabold text-xs px-3 py-1 rounded-full">
                    {paper.year} • {paper.term}
                  </span>
                  <span className="bg-purple-50 text-purple-700 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                    {paper.paperType}
                  </span>
                </div>

                <h3 className="font-extrabold text-lg text-ink line-clamp-2">{paper.title}</h3>
                <p className="text-xs text-ink/60 line-clamp-2">{paper.description}</p>

                <div className="flex items-center gap-4 text-xs font-bold text-ink/70 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-sky" /> {paper.durationMinutes} Mins
                  </span>
                  <span className="flex items-center gap-1">
                    <Award size={14} className="text-amber-500" /> {paper.totalMarks} Marks
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-ink/5 flex gap-2">
                {paper.pdfUrl && (
                  <a
                    href={paper.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3 rounded-xl border-2 border-ink/10 text-ink font-extrabold text-xs inline-flex items-center justify-center gap-1.5 hover:bg-cream transition-colors"
                  >
                    <Download size={14} /> PDF
                  </a>
                )}

                {paper.isOnlineAttemptEnabled && (
                  <Link
                    to={`/papers/${paper.id}/attempt`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-sky text-white font-extrabold text-xs inline-flex items-center justify-center gap-1.5 hover:bg-sky-dark shadow transition-transform active:scale-95"
                  >
                    <Play size={14} /> Attempt Online
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
