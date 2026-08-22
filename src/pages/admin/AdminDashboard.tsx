import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Award,
  ListChecks,
  Sparkles,
  ShieldCheck,
  BookOpen,
  FolderTree,
  BookMarked,
  Filter,
} from "lucide-react";

import { adminService } from "../../services/adminService";
import { useLanguage } from "../../context/LanguageContext";

import StatCard from "../../components/dashboard/StatCard";
import CrudTable from "../../components/admin/CrudTable";
import ContentManager from "../../components/admin/ContentManager";
import Spinner from "../../components/common/Spinner";

type MutationValues = Record<string, unknown>;

interface LessonFormData {
  title: string;
  chapterId: number;
  content: string;
  videoUrl: string | null;
  animationUrl: string | null;
  xpReward: number;
  hasQuiz: boolean;
  orderNumber: number;
}

interface TextBookFormData {
  title: string;
  book: string;
  grade: string;
  coverImageUrl: string | null;
  subjectId: number;
}

interface ChapterFormData {
  title: string;
  textBookId: number;
  orderNumber: number;
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<"subjects" | "textbooks" | "chapters" | "lessons">("subjects");

  // Cascading Selection Filters
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  // =========================================================
  // FETCH ADMIN STATISTICS
  // =========================================================

  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: adminService.getStats,
  });

  // =========================================================
  // FETCH DATA
  // =========================================================

  // 1. Fetch Subjects
  const { data: subjects = [], isLoading: subjectsLoading } = useQuery({
    queryKey: ["subjects"],
    queryFn: adminService.getSubjects,
  });

  // Automatically select first subject if none selected
  const activeSubjectId = selectedSubjectId ?? (subjects.length > 0 ? subjects[0].id : null);

  // 2. Fetch TextBooks based on selected Subject
  const { data: textBooks = [], isLoading: textBooksLoading } = useQuery({
    queryKey: ["admin-textbooks", activeSubjectId],
    queryFn: () => (activeSubjectId ? adminService.getTextBooksBySubject(activeSubjectId) : Promise.resolve([])),
    enabled: !!activeSubjectId,
  });

  const activeBookId = selectedBookId ?? (textBooks.length > 0 ? textBooks[0].id : null);

  // 3. Fetch Chapters based on selected TextBook
  const { data: chapters = [], isLoading: chaptersLoading } = useQuery({
    queryKey: ["admin-chapters", activeBookId],
    queryFn: () => (activeBookId ? adminService.getChaptersByBook(activeBookId) : Promise.resolve([])),
    enabled: !!activeBookId,
  });

  const activeChapterId = selectedChapterId ?? (chapters.length > 0 ? chapters[0].id : null);

  // 4. Fetch Lessons (Filtered by active chapter if available, or fetch all)
  const { data: lessons = [], isLoading: lessonsLoading } = useQuery({
    queryKey: ["admin-lessons", activeChapterId],
    queryFn: () => {
      // If adminService has getLessonsByChapter, use it. Otherwise fallback to getLessons
      if (activeChapterId && adminService.getLessonsByChapter) {
        return adminService.getLessonsByChapter(activeChapterId);
      }
      return adminService.getLessons();
    },
  });

  // Filter lessons on client side if API doesn't support chapter filtering directly
  const filteredLessons = activeChapterId
    ? lessons.filter((l: any) => l.chapterId === activeChapterId || !l.chapterId)
    : lessons;

  // =========================================================
  // CACHE INVALIDATION
  // =========================================================

  const invalidate = async (key: string) => {
    await queryClient.invalidateQueries({
      queryKey: [key],
    });
  };

  // =========================================================
  // ERROR MESSAGE HELPER
  // =========================================================

  const getErrorMessage = (error: any, fallback: string) => {
    console.error(error);

    const responseData = error?.response?.data;

    if (responseData?.errors) {
      const errors = Object.values(responseData.errors)
        .flat()
        .filter(Boolean)
        .map((item) => String(item));

      if (errors.length > 0) {
        return errors.join(", ");
      }
    }

    if (responseData?.detail) return String(responseData.detail);
    if (responseData?.title) return String(responseData.title);
    if (responseData?.message) return String(responseData.message);

    return fallback;
  };

  // =========================================================
  // DATA BUILDERS & VALIDATION
  // =========================================================

  const buildLessonData = (values: MutationValues): LessonFormData => {
    return {
      title: String(values.title ?? "").trim(),
      chapterId: Number(values.chapterId) || (activeChapterId ? Number(activeChapterId) : 0),
      content: String(values.content ?? "").trim(),
      videoUrl: String(values.videoUrl ?? "").trim() || null,
      animationUrl: String(values.animationUrl ?? "").trim() || null,
      xpReward: Number(values.xpReward ?? 0),
      hasQuiz: values.hasQuiz === true || values.hasQuiz === "true",
      orderNumber: Number(values.orderNumber ?? 1),
    };
  };

  const validateLesson = (lesson: LessonFormData): string | null => {
    if (!lesson.title) return "Lesson title is required.";
    if (!Number.isInteger(lesson.chapterId) || lesson.chapterId <= 0) return "Please select a valid Chapter.";
    if (!lesson.content) return "Lesson content is required.";
    if (!Number.isFinite(lesson.xpReward) || lesson.xpReward < 0) return "XP Reward must be 0 or greater.";
    if (!Number.isInteger(lesson.orderNumber) || lesson.orderNumber <= 0) return "Order Number must be greater than 0.";
    return null;
  };

  // =========================================================
  // MUTATIONS (SUBJECT)
  // =========================================================

  const subjectCreateMutation = useMutation({
    mutationFn: (values: MutationValues) => {
      const name = String(values.name ?? "").trim();
      if (!name) throw new Error("Subject name is required.");
      return adminService.createSubject({ name });
    },
    onSuccess: async () => {
      await invalidate("subjects");
      toast.success("Subject created successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to create subject.")),
  });

  const subjectUpdateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: MutationValues }) => {
      const name = String(values.name ?? "").trim();
      if (!name) throw new Error("Subject name is required.");
      return adminService.updateSubject(id, { name });
    },
    onSuccess: async () => {
      await invalidate("subjects");
      toast.success("Subject updated successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to update subject.")),
  });

  const subjectDeleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteSubject(id),
    onSuccess: async () => {
      await invalidate("subjects");
      toast.success("Subject deleted successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to delete subject.")),
  });

  // =========================================================
  // MUTATIONS (TEXTBOOK)
  // =========================================================

  const textBookCreateMutation = useMutation({
    mutationFn: (values: MutationValues) => {
      const subId = Number(values.subjectId) || (activeSubjectId ? Number(activeSubjectId) : 0);
      const titleVal = String(values.title ?? "").trim();

      const payload: TextBookFormData = {
        title: titleVal,
        book: titleVal,
        grade: String(values.grade ?? "5"),
        coverImageUrl: String(values.coverImageUrl ?? "").trim() || null,
        subjectId: subId,
      };

      if (!payload.title) throw new Error("TextBook title is required.");
      if (!payload.subjectId || isNaN(payload.subjectId) || payload.subjectId <= 0) {
        throw new Error("Subject selection is required.");
      }

      return adminService.createTextBook(payload);
    },
    onSuccess: async () => {
      await invalidate("admin-textbooks");
      toast.success("TextBook created successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to create textbook.")),
  });

  const textBookUpdateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: MutationValues }) => {
      const subId = Number(values.subjectId) || (activeSubjectId ? Number(activeSubjectId) : 0);
      const titleVal = String(values.title ?? "").trim();

      const payload: TextBookFormData = {
        title: titleVal,
        book: titleVal,
        grade: String(values.grade ?? "5"),
        coverImageUrl: String(values.coverImageUrl ?? "").trim() || null,
        subjectId: subId,
      };

      return adminService.updateTextBook(id, payload);
    },
    onSuccess: async () => {
      await invalidate("admin-textbooks");
      toast.success("TextBook updated successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to update textbook.")),
  });

  const textBookDeleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteTextBook(id),
    onSuccess: async () => {
      await invalidate("admin-textbooks");
      toast.success("TextBook deleted successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to delete textbook.")),
  });

  // =========================================================
  // MUTATIONS (CHAPTER)
  // =========================================================

  const chapterCreateMutation = useMutation({
    mutationFn: (values: MutationValues) => {
      const bookId = Number(values.textBookId) || (activeBookId ? Number(activeBookId) : 0);

      const payload: ChapterFormData = {
        title: String(values.title ?? "").trim(),
        textBookId: bookId,
        orderNumber: Number(values.orderNumber ?? 1),
      };

      if (!payload.title) throw new Error("Chapter title is required.");
      if (!payload.textBookId || isNaN(payload.textBookId) || payload.textBookId <= 0) {
        throw new Error("TextBook selection is required.");
      }

      return adminService.createChapter(payload);
    },
    onSuccess: async () => {
      await invalidate("admin-chapters");
      toast.success("Chapter created successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to create chapter.")),
  });

  const chapterUpdateMutation = useMutation({
    mutationFn: ({ id, values }: { id: number; values: MutationValues }) => {
      const bookId = Number(values.textBookId) || (activeBookId ? Number(activeBookId) : 0);

      const payload: ChapterFormData = {
        title: String(values.title ?? "").trim(),
        textBookId: bookId,
        orderNumber: Number(values.orderNumber ?? 1),
      };

      return adminService.updateChapter(id, payload);
    },
    onSuccess: async () => {
      await invalidate("admin-chapters");
      toast.success("Chapter updated successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to update chapter.")),
  });

  const chapterDeleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteChapter(id),
    onSuccess: async () => {
      await invalidate("admin-chapters");
      toast.success("Chapter deleted successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to delete chapter.")),
  });

  // =========================================================
  // MUTATIONS (LESSON)
  // =========================================================

  const lessonCreateMutation = useMutation({
    mutationFn: async (values: MutationValues) => {
      const lessonData = buildLessonData(values);
      const err = validateLesson(lessonData);
      if (err) throw new Error(err);
      return adminService.createLesson(lessonData);
    },
    onSuccess: async () => {
      await invalidate("admin-lessons");
      toast.success("Lesson created successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to create lesson.")),
  });

  const lessonUpdateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: number; values: MutationValues }) => {
      const lessonData = buildLessonData(values);
      const err = validateLesson(lessonData);
      if (err) throw new Error(err);
      return adminService.updateLesson(id, lessonData);
    },
    onSuccess: async () => {
      await invalidate("admin-lessons");
      toast.success("Lesson updated successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to update lesson.")),
  });

  const lessonDeleteMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteLesson(id),
    onSuccess: async () => {
      await invalidate("admin-lessons");
      toast.success("Lesson deleted successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err, "Failed to delete lesson.")),
  });

  const isAnyMutationLoading =
    subjectCreateMutation.isPending ||
    subjectUpdateMutation.isPending ||
    subjectDeleteMutation.isPending ||
    textBookCreateMutation.isPending ||
    textBookUpdateMutation.isPending ||
    textBookDeleteMutation.isPending ||
    chapterCreateMutation.isPending ||
    chapterUpdateMutation.isPending ||
    chapterDeleteMutation.isPending ||
    lessonCreateMutation.isPending ||
    lessonUpdateMutation.isPending ||
    lessonDeleteMutation.isPending;

  // Options for Dropdowns
  const subjectOptions = subjects?.map((s: any) => ({ label: s.name, value: s.id })) ?? [];
  const textBookOptions = textBooks?.map((tb: any) => ({ label: tb.title || tb.book, value: tb.id })) ?? [];
  const chapterOptions = chapters?.map((c: any) => ({ label: c.title, value: c.id })) ?? [];

  return (
    <div className="space-y-8 pb-12">
      {/* HEADER */}
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
            <ShieldCheck size={14} className="text-emerald-400" />
            Admin Command Center
          </span>

          <h1 className="text-3xl lg:text-4xl font-black tracking-tight flex items-center gap-3">
            <LayoutDashboard size={30} className="text-indigo-300" />
            {t.admin.title}
          </h1>

          <p className="text-indigo-200/70 text-sm font-medium">
            Manage your platform's educational content and monitoring metrics.
          </p>
        </div>
      </motion.div>

      {/* STATISTICS */}
      {statsLoading ? (
        <div className="py-12 flex justify-center">
          <Spinner />
        </div>
      ) : statsError ? (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-center">
          <p className="text-red-600 font-semibold">Failed to load admin statistics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Total Students" value={stats?.totalStudents ?? 0} color="sky" />
          <StatCard icon={ListChecks} label="Total Quizzes Taken" value={stats?.totalQuizzes ?? 0} color="grass" />
          <StatCard icon={Award} label="Average Score" value={`${Number(stats?.averageScore ?? 0).toFixed(1)}%`} color="sunshine" />
        </div>
      )}

      {/* EDUCATIONAL DATA HIERARCHY MANAGER */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
        
        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab("subjects")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === "subjects"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <BookOpen size={18} />
            1. Subjects
          </button>

          <button
            onClick={() => setActiveTab("textbooks")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === "textbooks"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <BookMarked size={18} />
            2. TextBooks
          </button>

          <button
            onClick={() => setActiveTab("chapters")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === "chapters"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <FolderTree size={18} />
            3. Chapters
          </button>

          <button
            onClick={() => setActiveTab("lessons")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all ${
              activeTab === "lessons"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Sparkles size={18} />
            4. Lessons
          </button>
        </div>

        {/* CASCADING FILTER CONTROLS FOR TEXTBOOKS, CHAPTERS & LESSONS */}
        {activeTab !== "subjects" && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm">
              <Filter size={16} className="text-indigo-600" />
              Filter Content:
            </div>

            {/* Subject Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-500">Subject:</label>
              <select
                value={activeSubjectId ?? ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSelectedSubjectId(val);
                  setSelectedBookId(null);
                  setSelectedChapterId(null);
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {subjectOptions.length === 0 && <option value="">No subjects available</option>}
                {subjectOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Textbook Selector */}
            {(activeTab === "chapters" || activeTab === "lessons") && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500">Textbook:</label>
                <select
                  value={activeBookId ?? ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSelectedBookId(val);
                    setSelectedChapterId(null);
                  }}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {textBookOptions.length === 0 && <option value="">No textbooks available</option>}
                  {textBookOptions.map((tb) => (
                    <option key={tb.value} value={tb.value}>
                      {tb.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Chapter Selector */}
            {activeTab === "lessons" && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-500">Chapter:</label>
                <select
                  value={activeChapterId ?? ""}
                  onChange={(e) => setSelectedChapterId(Number(e.target.value))}
                  className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {chapterOptions.length === 0 && <option value="">No chapters available</option>}
                  {chapterOptions.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT */}
        <div>
          {activeTab === "subjects" && (
            <CrudTable
              title="Subject Management"
              items={subjects ?? []}
              isLoading={subjectsLoading}
              fields={[{ key: "name", label: "Name" }]}
              onCreate={(v) => subjectCreateMutation.mutateAsync(v)}
              onUpdate={(id, v) => subjectUpdateMutation.mutateAsync({ id, values: v })}
              onDelete={(id) => subjectDeleteMutation.mutate(id)}
            />
          )}

          {activeTab === "textbooks" && (
            <CrudTable
              title="TextBook Management"
              items={textBooks ?? []}
              isLoading={textBooksLoading}
              fields={[
                { key: "title", label: "Title" },
                { key: "grade", label: "Grade" },
                {
                  key: "subjectId",
                  label: "Subject",
                  type: "select",
                  options: subjectOptions,
                },
                { key: "coverImageUrl", label: "Cover Image URL" },
              ]}
              onCreate={(v) => textBookCreateMutation.mutateAsync(v)}
              onUpdate={(id, v) => textBookUpdateMutation.mutateAsync({ id, values: v })}
              onDelete={(id) => textBookDeleteMutation.mutate(id)}
            />
          )}

          {activeTab === "chapters" && (
            <CrudTable
              title="Chapter Management"
              items={chapters ?? []}
              isLoading={chaptersLoading}
              fields={[
                { key: "title", label: "Title" },
                {
                  key: "textBookId",
                  label: "Text Book",
                  type: "select",
                  options: textBookOptions,
                },
                { key: "orderNumber", label: "Order Number", type: "number" },
              ]}
              onCreate={(v) => chapterCreateMutation.mutateAsync(v)}
              onUpdate={(id, v) => chapterUpdateMutation.mutateAsync({ id, values: v })}
              onDelete={(id) => chapterDeleteMutation.mutate(id)}
            />
          )}

          {activeTab === "lessons" && (
            <CrudTable
              title="Lesson Management"
              items={filteredLessons ?? []}
              isLoading={lessonsLoading}
              fields={[
                { key: "title", label: "Title" },
                {
                  key: "chapterId",
                  label: "Chapter",
                  type: "select",
                  options: chapterOptions,
                },
                { key: "content", label: "Lesson Content", type: "textarea" },
                { key: "videoUrl", label: "Video URL" },
                { key: "animationUrl", label: "Animation URL" },
                { key: "orderNumber", label: "Order Number", type: "number" },
                { key: "xpReward", label: "XP Reward", type: "number" },
                { key: "hasQuiz", label: "Has Quiz", type: "checkbox" },
              ]}
              onCreate={(v) => lessonCreateMutation.mutateAsync(v)}
              onUpdate={(id, v) => lessonUpdateMutation.mutateAsync({ id, values: v })}
              onDelete={(id) => lessonDeleteMutation.mutate(id)}
            />
          )}
        </div>
      </div>

      {/* CONTENT MANAGER */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
        <ContentManager />
      </motion.div>

      {/* USER MANAGEMENT */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6"
      >
        <h3 className="font-extrabold text-slate-800 text-base mb-2 flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600 shadow-sm">
            <Users size={18} />
          </div>
          {t.admin.users}
        </h3>
        <p className="text-slate-500 text-xs font-medium leading-relaxed">
          User management needs a backend endpoint. This section will be available once the Admin User CRUD API is implemented.
        </p>
      </motion.div>

      {/* MUTATION STATUS */}
      {isAnyMutationLoading && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-sm font-semibold">Saving changes...</span>
          </div>
        </div>
      )}
    </div>
  );
}