import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Users, BookOpen, Award, ListChecks, Sparkles, ShieldCheck } from "lucide-react";
import { adminService } from "../../services/adminService";
import { useLanguage } from "../../context/LanguageContext";
import StatCard from "../../components/dashboard/StatCard";
import CrudTable from "../../components/admin/CrudTable";
import Spinner from "../../components/common/Spinner";
import SubjectManager from "../../components/admin/SubjectManager";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const qc = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminService.getStats,
  });

  const { data: grades, isLoading: gradesLoading } = useQuery({
    queryKey: ["admin-grades"],
    queryFn: adminService.getGrades,
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ["admin-lessons"],
    queryFn: () => adminService.getLessons(),
  });

  const { data: papers, isLoading: papersLoading } = useQuery({
    queryKey: ["admin-papers"],
    queryFn: adminService.getPapers,
  });

  const { data: chapters, isLoading: chaptersLoading } = useQuery({
    queryKey: ["admin-chapters"],
    queryFn: () => adminService.getChapters(),
  });

  const invalidate = (key: string) => qc.invalidateQueries({ queryKey: [key] });

  const gradeMutations = {
    create: useMutation({
      mutationFn: adminService.createGrade,
      onSuccess: () => {
        invalidate("admin-grades");
        toast.success("Grade created!");
      },
    }),
    update: useMutation({
      mutationFn: ({ id, values }: { id: number; values: unknown }) =>
        adminService.updateGrade(id, values as Partial<import("../../types").Grade>),
      onSuccess: () => {
        invalidate("admin-grades");
        toast.success("Grade updated!");
      },
    }),
    remove: useMutation({
      mutationFn: adminService.deleteGrade,
      onSuccess: () => {
        invalidate("admin-grades");
        toast.success("Grade deleted!");
      },
    }),
  };

  const lessonMutations = {
    create: useMutation({
      mutationFn: adminService.createLesson,
      onSuccess: () => {
        invalidate("admin-lessons");
        toast.success("Lesson created!");
      },
    }),
    update: useMutation({
      mutationFn: ({ id, values }: { id: number; values: unknown }) =>
        adminService.updateLesson(id, values as Partial<import("../../types").Lesson>),
      onSuccess: () => {
        invalidate("admin-lessons");
        toast.success("Lesson updated!");
      },
    }),
    remove: useMutation({
      mutationFn: adminService.deleteLesson,
      onSuccess: () => {
        invalidate("admin-lessons");
        toast.success("Lesson deleted!");
      },
    }),
  };


  const chapterMutations = {
    create: useMutation({
      mutationFn: adminService.createChapter,
      onSuccess: () => {
        invalidate("admin-chapters");
        toast.success("Chapter created!");
      },
    }),
    update: useMutation({
      mutationFn: ({ id, values }: { id: number; values: unknown }) =>
        adminService.updateChapter(id, values as Partial<import("../../types").Chapter>),
      onSuccess: () => {
        invalidate("admin-chapters");
        toast.success("Chapter updated!");
      },
    }),
    remove: useMutation({
      mutationFn: adminService.deleteChapter,
      onSuccess: () => {
        invalidate("admin-chapters");
        toast.success("Chapter deleted!");
      },
    }),
  };
  const paperMutations = {
    create: useMutation({
      mutationFn: adminService.createPaper,
      onSuccess: () => {
        invalidate("admin-papers");
        toast.success("Paper created!");
      },
    }),
    update: useMutation({
      mutationFn: ({ id, values }: { id: number; values: unknown }) =>
        adminService.updatePaper(id, values as Partial<import("../../types").Paper>),
      onSuccess: () => {
        invalidate("admin-papers");
        toast.success("Paper updated!");
      },
    }),
    remove: useMutation({
      mutationFn: adminService.deletePaper,
      onSuccess: () => {
        invalidate("admin-papers");
        toast.success("Paper deleted!");
      },
    }),
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Sparkles size={200} />
        </div>
        <div className="relative z-10 space-y-1.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-extrabold uppercase text-indigo-200">
            <ShieldCheck size={14} className="text-emerald-400" /> Admin Command Center
          </span>
          <h1 className="text-3xl lg:text-4xl font-black tracking-tight">{t.admin.title}</h1>
          <p className="text-indigo-200/70 text-sm font-medium">
            Manage Grades, Subjects, Lessons, Chapters, Quizzes & Exam Papers.
          </p>
        </div>
      </motion.div>

      {/* Analytics Stats Grid */}
      {statsLoading ? (
        <div className="py-12 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Students" value={stats?.totalStudents ?? 0} color="sky" />
          <StatCard icon={BookOpen} label="Total Lessons" value={stats?.totalLessons ?? 0} color="grape" />
          <StatCard icon={ListChecks} label="Total Quizzes" value={stats?.totalQuizzes ?? 0} color="grass" />
          <StatCard icon={Award} label="Avg Quiz Score" value={`${Number(stats?.averageQuizScore ?? 0).toFixed(1)}%`} color="sunshine" />
        </div>
      )}

      {/* CRUD Tables Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Grades Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100"
        >
          <CrudTable
            title={t.admin.grades}
            items={grades ?? []}
            isLoading={gradesLoading}
            fields={[
              { key: "name", label: "Name" },
              { key: "displayName", label: "Display Name" },
              { key: "orderNumber", label: "Order", type: "number" },
            ]}
            onCreate={(values) => gradeMutations.create.mutate(values)}
            onUpdate={(id, values) => gradeMutations.update.mutate({ id, values })}
            onDelete={(id) => gradeMutations.remove.mutate(id)}
          />
        </motion.div>

        <SubjectManager />

        {/* Lessons Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100"
        >
          <CrudTable
            title={t.admin.lessons}
            items={lessons ?? []}
            isLoading={lessonsLoading}
            fields={[
              { key: "title", label: "Title" },
              { key: "gradeId", label: "Grade ID", type: "number" },
              { key: "subjectId", label: "Subject ID", type: "number" },
              { key: "orderNumber", label: "Order", type: "number" },
              { key: "xpReward", label: "XP Reward", type: "number" },
            ]}
            onCreate={(values) => lessonMutations.create.mutate(values)}
            onUpdate={(id, values) => lessonMutations.update.mutate({ id, values })}
            onDelete={(id) => lessonMutations.remove.mutate(id)}
          />
        </motion.div>


        {/* Chapters Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100"
        >
          <CrudTable
            title={t.admin.chapters}
            items={chapters ?? []}
            isLoading={chaptersLoading}
            fields={[
              { key: "title", label: "Title" },
              { key: "lessonId", label: "Lesson ID", type: "number" },
              { key: "orderNumber", label: "Order", type: "number" },
              { key: "xpReward", label: "XP Reward", type: "number" },
            ]}
            onCreate={(values) => chapterMutations.create.mutate(values)}
            onUpdate={(id, values) => chapterMutations.update.mutate({ id, values })}
            onDelete={(id) => chapterMutations.remove.mutate(id)}
          />
        </motion.div>

        {/* Exam Papers Table */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100"
        >
          <CrudTable
            title={t.admin.papers}
            items={papers ?? []}
            isLoading={papersLoading}
            fields={[
              { key: "title", label: "Title" },
              { key: "gradeId", label: "Grade ID", type: "number" },
              { key: "subjectId", label: "Subject ID", type: "number" },
              { key: "year", label: "Year", type: "number" },
              { key: "paperType", label: "Type" },
              { key: "durationMinutes", label: "Minutes", type: "number" },
              { key: "totalMarks", label: "Total Marks", type: "number" },
              { key: "pdfUrl", label: "PDF URL" },
            ]}
            onCreate={(values) => paperMutations.create.mutate(values)}
            onUpdate={(id, values) => paperMutations.update.mutate({ id, values })}
            onDelete={(id) => paperMutations.remove.mutate(id)}
          />
        </motion.div>
      </div>
    </div>
  );
}
