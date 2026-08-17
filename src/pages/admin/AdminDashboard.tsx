import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LayoutDashboard, Users, BookOpen, Award, ListChecks } from "lucide-react";
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
        toast.success("Subject created");
      },
    }),
    update: useMutation({
      mutationFn: ({ id, values }: { id: number; values: any }) => adminService.updateSubject(id, values),
      onSuccess: () => {
        invalidate("subjects");
        toast.success("Subject updated");
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
        toast.success("Lesson created");
      },
    }),
    update: useMutation({
      mutationFn: ({ id, values }: { id: number; values: any }) => adminService.updateLesson(id, values),
      onSuccess: () => {
        invalidate("admin-lessons");
        toast.success("Lesson updated");
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
    <div className="space-y-8">
      <h1 className="text-2xl font-extrabold flex items-center gap-2">
        <LayoutDashboard className="text-sky-dark" /> {t.admin.title}
      </h1>

      {statsLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Total Students" value={stats?.totalStudents ?? 0} color="sky" />
          <StatCard icon={ListChecks} label="Total Quizzes Taken" value={stats?.totalQuizzes ?? 0} color="grass" />
          <StatCard icon={Award} label="Average Score" value={(stats?.averageScore ?? 0).toFixed(1)} color="sunshine" />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <CrudTable
          title={t.admin.subjects}
          items={subjects ?? []}
          isLoading={subjectsLoading}
          fields={[{ key: "name", label: "Name" }]}
          onCreate={(values) => subjectMutations.create.mutate(values)}
          onUpdate={(id, values) => subjectMutations.update.mutate({ id, values })}
          onDelete={(id) => subjectMutations.remove.mutate(id)}
        />

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
      </div>

      <div className="bg-white rounded-3xl shadow-md border-4 border-white p-5">
        <h3 className="font-extrabold text-lg mb-2 flex items-center gap-2">
          <BookOpen size={18} /> {t.admin.textbooks} / {t.admin.chapters} / {t.admin.users}
        </h3>
        <p className="text-ink/50 text-sm font-medium">
          Wired the same way as Subjects/Lessons above via <code>adminService</code> — add
          more <code>CrudTable</code> blocks here (textbooks, chapters) as your data grows.
          User management needs a backend endpoint (Admin controller currently has no
          User CRUD routes).
        </p>
      </div>
    </div>
  );
}
