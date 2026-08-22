import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, BookOpen, Award, ListChecks, Sparkles, ShieldCheck } from "lucide-react";
import { adminService } from "../../services/adminService";
import { learningService } from "../../services/learningService";
import { useLanguage } from "../../context/LanguageContext";
import StatCard from "../../components/dashboard/StatCard";
import CrudTable from "../../components/admin/CrudTable";
import Spinner from "../../components/common/Spinner";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const qc = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminService.getStats,
  });

  const { data: subjects, isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: learningService.getSubjects,
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["admin-lessons"],
    queryFn: adminService.getLessons,
  });

  const invalidate = (key: string) => qc.invalidateQueries({ queryKey: [key] });

  const subjectMutations = {
    create: useMutation({
      mutationFn: adminService.createSubject,
      onSuccess: () => {
        invalidate("subjects");
        toast.success("Subject created successfully!");
      },
    }),
    update: useMutation({
      mutationFn: ({ id, values }: { id: number; values: any }) => adminService.updateSubject(id, values),
      onSuccess: () => {
        invalidate("subjects");
        toast.success("Subject updated successfully!");
      },
    }),
    remove: useMutation({
      mutationFn: adminService.deleteSubject,
      onSuccess: () => {
        invalidate("subjects");
        toast.success("Subject deleted");
      },
    }),
  };

  const lessonMutations = {
    create: useMutation({
      mutationFn: adminService.createLesson,
      onSuccess: () => {
        invalidate("admin-lessons");
        toast.success("Lesson created successfully!");
      },
    }),
    update: useMutation({
      mutationFn: ({ id, values }: { id: number; values: any }) => adminService.updateLesson(id, values),
      onSuccess: () => {
        invalidate("admin-lessons");
        toast.success("Lesson updated successfully!");
      },
    }),
    remove: useMutation({
      mutationFn: adminService.deleteLesson,
      onSuccess: () => {
        invalidate("admin-lessons");
        toast.success("Lesson deleted");
      },
    }),
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-8 rounded-3xl shadow-xl shadow-slate-950/15 relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Sparkles size={200} />
        </div>
        <div className="relative z-10 space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-extrabold tracking-wider uppercase text-indigo-200">
            <ShieldCheck size={14} className="text-emerald-400" /> Admin Command Center
          </span>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight flex items-center gap-3">
            {t.admin.title}
          </h1>
          <p className="text-indigo-200/70 text-sm font-medium">
            Manage your platform's core educational data, subjects, and monitoring metrics.
          </p>
        </div>
      </motion.div>

      {/* Analytics Stats Grid */}
      {statsLoading ? (
        <div className="py-12 flex justify-center"><Spinner /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Total Students" value={stats?.totalStudents ?? 0} color="sky" />
          <StatCard icon={ListChecks} label="Total Quizzes Taken" value={stats?.totalQuizzes ?? 0} color="grass" />
          <StatCard icon={Award} label="Average Score" value={`${Number(stats?.averageScore ?? 0).toFixed(1)}%`} color="sunshine" />
        </div>
      )}

      {/* CRUD Tables Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <CrudTable
            title={t.admin.subjects}
            items={subjects ?? []}
            isLoading={subjectsLoading}
            fields={[{ key: "name", label: "Name" }]}
            onCreate={(values) => subjectMutations.create.mutate(values)}
            onUpdate={(id, values) => subjectMutations.update.mutate({ id, values })}
            onDelete={(id) => subjectMutations.remove.mutate(id)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <CrudTable
            title={t.admin.lessons}
            items={lessons ?? []}
            isLoading={lessonsLoading}
            fields={[
              { key: "title", label: "Title" },
              { key: "chapterId", label: "Chapter ID", type: "number" },
              { key: "orderNumber", label: "Order", type: "number" },
              { key: "xpReward", label: "XP Reward", type: "number" },
            ]}
            onCreate={(values) => lessonMutations.create.mutate(values)}
            onUpdate={(id, values) => lessonMutations.update.mutate({ id, values })}
            onDelete={(id) => lessonMutations.remove.mutate(id)}
          />
        </motion.div>
      </div>

      {/* Info Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6"
      >
        <h3 className="font-extrabold text-slate-800 text-base mb-2 flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shadow-sm">
            <BookOpen size={18} /> 
          </div>
          {t.admin.textbooks} / {t.admin.chapters} / {t.admin.users}
        </h3>
        <p className="text-slate-500 text-xs font-medium leading-relaxed">
          Wired the same way as Subjects/Lessons above via <code>adminService</code> — add
          more <code>CrudTable</code> blocks here (textbooks, chapters) as your data grows.
          User management needs a backend endpoint (Admin controller currently has no
          User CRUD routes).
        </p>
      </motion.div>
    </div>
  );
}