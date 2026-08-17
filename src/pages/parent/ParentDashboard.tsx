import { useQuery } from "@tanstack/react-query";
import { BarChart3, History, TrendingUp } from "lucide-react";
import { parentService } from "../../services/parentService";
import { useLanguage } from "../../context/LanguageContext";
import Card from "../../components/common/Card";
import Spinner from "../../components/common/Spinner";
import StatCard from "../../components/dashboard/StatCard";
import { Target, Trophy, Zap } from "lucide-react";

export default function ParentDashboard() {
  const { t } = useLanguage();
  const { data, isLoading } = useQuery({
    queryKey: ["parent-analytics"],
    queryFn: parentService.getChildAnalytics,
  });

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold flex items-center gap-2">
        <BarChart3 className="text-sky-dark" /> {t.parent.title}
      </h1>

      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Trophy} label={t.dashboard.lessonsCompleted} value={data?.completedLessons ?? 0} color="sky" />
            <StatCard icon={Target} label={t.dashboard.avgScore} value={Math.round(data?.averageMarks ?? 0)} color="grass" />
            <StatCard icon={Zap} label={t.dashboard.xp} value={data?.totalXP ?? 0} color="sunshine" />
            <StatCard icon={TrendingUp} label="Quizzes Taken" value={data?.totalQuizzes ?? 0} color="coral" />
          </div>

          <Card>
            <h2 className="text-lg font-extrabold mb-4">{t.parent.accuracy}</h2>
            <div className="w-full bg-ink/5 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-grass to-sky rounded-full transition-all"
                style={{ width: `${data?.progressPercentage ?? 0}%` }}
              />
            </div>
            <p className="text-sm text-ink/50 mt-2 font-semibold">
              {data?.progressPercentage.toFixed(0) ?? 0}% overall lesson completion
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-extrabold mb-2 flex items-center gap-2">
              <History size={18} /> {t.parent.history}
            </h2>
            <p className="text-ink/50 text-sm font-medium">
              Detailed per-quiz history requires a backend endpoint returning
              individual Result rows (currently only aggregated analytics are exposed).
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
