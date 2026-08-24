import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  Layers,
  Info,
} from "lucide-react";

import { adminService } from "../../services/adminService";
import { useLanguage } from "../../context/LanguageContext";

import StatCard from "../../components/dashboard/StatCard";
import CrudTable from "../../components/admin/CrudTable";
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

  // Tab Definitions
  const tabs = [
    { id: "subjects", label: "1. Subjects", icon: BookOpen, count: subjects.length },
    { id: "textbooks", label: "2. Textbooks", icon: BookMarked, count: textBooks.length },
    { id: "chapters", label: "3. Chapters", icon: FolderTree, count: chapters.length },
    { id: "lessons", label: "4. Lessons", icon: Sparkles, count: filteredLessons.length },
  ] as const;

  return (
    <div className="space-y-8 pb-16">
      {/* HERO HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl"
      >
        <div className="absolute -right-12 -top-12 opacity-10 pointer-events-none text-indigo-400">
          <Sparkles size={260} />
        </div>
        <div className="absolute right-1/3 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-bold tracking-wider uppercase text-indigo-300 backdrop-blur-md">
              <ShieldCheck size={14} className="text-emerald-400" />
              Admin Command Center
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <LayoutDashboard size={32} className="text-indigo-400" />
              {t.admin.title}
            </h1>

            <p className="text-slate-300 text-sm max-w-xl font-medium leading-relaxed">
              Manage educational curriculum hierarchy, configure content levels, and monitor platform performance.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/60 backdrop-blur-md border border-slate-700/60 rounded-2xl p-3.5 px-5 self-start md:self-auto">
            <Layers className="text-indigo-400" size={24} />
            <div>
              <p className="text-xs font-semibold text-slate-400">Hierarchy Depth</p>
              <p className="text-sm font-bold text-white">4 Levels Active</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* OVERVIEW METRICS / STATS */}
      {statsLoading ? (
        <div className="py-12 flex justify-center bg-slate-900/40 rounded-3xl border border-slate-800">
          <Spinner />
        </div>
      ) : statsError ? (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 text-center backdrop-blur-md">
          <p className="text-rose-400 font-semibold text-sm">Failed to load platform statistics.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Total Students" value={stats?.totalStudents ?? 0} color="sky" />
          <StatCard icon={ListChecks} label="Total Quizzes Taken" value={stats?.totalQuizzes ?? 0} color="grass" />
          <StatCard icon={Award} label="Average Score" value={`${Number(stats?.averageScore ?? 0).toFixed(1)}%`} color="sunshine" />
        </div>
      )}

      {/* CURRICULUM MANAGEMENT SUITE */}
      <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-slate-800/80 space-y-6">
        
        {/* STEP-BY-STEP TAB NAVIGATION */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800/80 pb-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative flex items-center gap-2.5 px-5 py-3 rounded-2xl font-bold text-sm transition-all duration-200 outline-none ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30"
                    : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent"
                }`}
              >
                <Icon size={18} className={isActive ? "text-indigo-200" : "text-slate-400"} />
                <span>{tab.label}</span>
                <span
                  className={`ml-1 text-xs px-2 py-0.5 rounded-full font-extrabold ${
                    isActive ? "bg-indigo-900/80 text-indigo-100" : "bg-slate-700/50 text-slate-400"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* CASCADING BREADCRUMB FILTERS */}
        {activeTab !== "subjects" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-4 text-sm"
          >
            <div className="flex items-center gap-2 text-indigo-300 font-bold px-2">
              <Filter size={16} />
              <span>Scope Filters:</span>
            </div>

            {/* Subject Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Subject</span>
              <select
                value={activeSubjectId ?? ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setSelectedSubjectId(val);
                  setSelectedBookId(null);
                  setSelectedChapterId(null);
                }}
                className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {subjectOptions.length === 0 && <option value="">No subjects found</option>}
                {subjectOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Textbook Dropdown */}
            {(activeTab === "chapters" || activeTab === "lessons") && (
              <>
                <ChevronRight size={14} className="text-slate-600" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Textbook</span>
                  <select
                    value={activeBookId ?? ""}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSelectedBookId(val);
                      setSelectedChapterId(null);
                    }}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {textBookOptions.length === 0 && <option value="">No textbooks found</option>}
                    {textBookOptions.map((tb) => (
                      <option key={tb.value} value={tb.value}>
                        {tb.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Chapter Dropdown */}
            {activeTab === "lessons" && (
              <>
                <ChevronRight size={14} className="text-slate-600" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Chapter</span>
                  <select
                    value={activeChapterId ?? ""}
                    onChange={(e) => setSelectedChapterId(Number(e.target.value))}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {chapterOptions.length === 0 && <option value="">No chapters found</option>}
                    {chapterOptions.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* ACTIVE MANAGEMENT TABLE */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
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
          </motion.div>
        </AnimatePresence>
      </div>

      {/* USER MANAGEMENT SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-slate-800 p-6 flex items-start gap-4"
      >
        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
          <Users size={22} />
        </div>
        <div>
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            {t.admin.users}
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
              Upcoming
            </span>
          </h3>
          <p className="text-slate-400 text-xs font-medium leading-relaxed mt-1 flex items-center gap-1.5">
            <Info size={14} className="text-slate-500 shrink-0" />
            User management requires backend CRUD endpoints. This tab will become interactive once the User Management API is integrated.
          </p>
        </div>
      </motion.div>

      {/* MUTATION LOADING FLOATING BADGE */}
      <AnimatePresence>
        {isAnyMutationLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <div className="flex items-center gap-3 bg-slate-900 border border-indigo-500/40 text-white px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-lg">
              <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold tracking-wide">Saving changes...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}