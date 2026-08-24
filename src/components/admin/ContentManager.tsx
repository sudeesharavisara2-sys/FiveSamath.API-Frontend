import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Layers,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookmarkCheck,
  Library,
} from "lucide-react";

import { adminService } from "../../services/adminService";
import { learningService } from "../../services/learningService";
import CrudTable from "./CrudTable";
import Spinner from "../common/Spinner";
import type { Subject, TextBook } from "../../types";

const stepVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.99 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: { duration: 0.2 },
  },
};

type Book = {
  id: number;
  title: string;
  grade?: string;
  coverImageUrl?: string;
};

type MutationValues = Record<string, unknown>;

function StepPill({
  stepNumber,
  active,
  done,
  label,
  onClick,
}: {
  stepNumber: string;
  active: boolean;
  done: boolean;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`group flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 border ${
        active
          ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white border-transparent shadow-lg shadow-sky-500/25 ring-2 ring-sky-400/30"
          : done
          ? "bg-emerald-50/90 border-emerald-200 text-emerald-800 hover:bg-emerald-100/80 hover:border-emerald-300"
          : "bg-slate-100/70 border-slate-200/60 text-slate-400"
      } ${onClick ? "cursor-pointer active:scale-95" : "cursor-default"}`}
    >
      <span
        className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black transition-colors ${
          active
            ? "bg-white/20 text-white"
            : done
            ? "bg-emerald-200/60 text-emerald-900"
            : "bg-slate-200 text-slate-500"
        }`}
      >
        {done ? <CheckCircle2 size={12} className="stroke-[3]" /> : stepNumber}
      </span>
      <span className="truncate max-w-[200px] sm:max-w-xs">{label}</span>
    </button>
  );
}

export default function ContentManager() {
  const qc = useQueryClient();

  const [subject, setSubject] = useState<Subject | null>(null);
  const [book, setBook] = useState<Book | null>(null);

  // ============================================================
  // SUBJECTS
  // ============================================================

  const {
    data: subjects,
    isLoading: subjectsLoading,
    isError: subjectsError,
  } = useQuery({
    queryKey: ["subjects"],
    queryFn: learningService.getSubjects,
  });

  // ============================================================
  // TEXTBOOKS
  // ============================================================

  const {
    data: books,
    isLoading: booksLoading,
    isError: booksError,
  } = useQuery({
    queryKey: ["textbooks", subject?.id],
    queryFn: () => learningService.getTextbooksBySubject(subject!.id),
    enabled: !!subject,
  });

  // ============================================================
  // CHAPTERS
  // ============================================================

  const {
    data: chapters,
    isLoading: chaptersLoading,
    isError: chaptersError,
  } = useQuery({
    queryKey: ["chapters", book?.id],
    queryFn: () => learningService.getChaptersByTextbook(book!.id),
    enabled: !!book,
  });

  // ============================================================
  // QUERY INVALIDATION
  // ============================================================

  const invalidate = (key: unknown[]) => {
    return qc.invalidateQueries({
      queryKey: key,
    });
  };

  // ============================================================
  // TEXTBOOK MUTATIONS
  // ============================================================

  const createTextbook = useMutation({
    mutationFn: (values: MutationValues) => {
      if (!subject) {
        throw new Error("Please select a subject first.");
      }

      return adminService.createTextBook({
        title: String(values.title ?? "").trim(),
        grade: String(values.grade ?? "5"),
        coverImageUrl: String(values.coverImageUrl ?? "").trim(),
        subjectId: subject.id,
      });
    },

    onSuccess: async () => {
      await invalidate(["textbooks", subject?.id]);
      toast.success("Textbook created successfully");
    },

    onError: (error) => {
      console.error("Create textbook error:", error);
      toast.error("Failed to create textbook");
    },
  });

  const updateTextbook = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: MutationValues;
    }) => {
      if (!subject) {
        throw new Error("Please select a subject first.");
      }

      return adminService.updateTextBook(id, {
        title: String(values.title ?? "").trim(),
        grade: String(values.grade ?? "5"),
        coverImageUrl: String(values.coverImageUrl ?? "").trim(),
        subjectId: subject.id,
      });
    },

    onSuccess: async () => {
      await invalidate(["textbooks", subject?.id]);
      toast.success("Textbook updated successfully");
    },

    onError: (error) => {
      console.error("Update textbook error:", error);
      toast.error("Failed to update textbook");
    },
  });

  const deleteTextbook = useMutation({
    mutationFn: (id: number) => {
      return adminService.deleteTextBook(id);
    },

    onSuccess: async (_, deletedId) => {
      await invalidate(["textbooks", subject?.id]);

      if (book?.id === deletedId) {
        setBook(null);
      }

      toast.success("Textbook deleted successfully");
    },

    onError: (error) => {
      console.error("Delete textbook error:", error);
      toast.error("Failed to delete textbook");
    },
  });

  // ============================================================
  // CHAPTER MUTATIONS
  // ============================================================

  const createChapter = useMutation({
    mutationFn: (values: MutationValues) => {
      if (!book) {
        throw new Error("Please select a textbook first.");
      }

      return adminService.createChapter({
        title: String(values.title ?? "").trim(),
        orderNumber: Number(values.orderNumber ?? 1),
        textBookId: book.id,
      });
    },

    onSuccess: async () => {
      await invalidate(["chapters", book?.id]);
      toast.success("Chapter created successfully");
    },

    onError: (error) => {
      console.error("Create chapter error:", error);
      toast.error("Failed to create chapter");
    },
  });

  const updateChapter = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: MutationValues;
    }) => {
      if (!book) {
        throw new Error("Please select a textbook first.");
      }

      return adminService.updateChapter(id, {
        title: String(values.title ?? "").trim(),
        orderNumber: Number(values.orderNumber ?? 1),
        textBookId: book.id,
      });
    },

    onSuccess: async () => {
      await invalidate(["chapters", book?.id]);
      toast.success("Chapter updated successfully");
    },

    onError: (error) => {
      console.error("Update chapter error:", error);
      toast.error("Failed to update chapter");
    },
  });

  const deleteChapter = useMutation({
    mutationFn: (id: number) => {
      return adminService.deleteChapter(id);
    },

    onSuccess: async () => {
      await invalidate(["chapters", book?.id]);
      toast.success("Chapter deleted successfully");
    },

    onError: (error) => {
      console.error("Delete chapter error:", error);
      toast.error("Failed to delete chapter");
    },
  });

  // ============================================================
  // SELECTION HANDLERS
  // ============================================================

  const selectSubject = (selectedSubject: Subject) => {
    setSubject(selectedSubject);
    setBook(null);
  };

  const goToSubjects = () => {
    setSubject(null);
    setBook(null);
  };

  const goToTextbooks = () => {
    setBook(null);
  };

  const selectBook = (selectedBook: TextBook) => {
    setBook({
      id: selectedBook.id,
      title: selectedBook.title,
      grade: selectedBook.grade,
      coverImageUrl: selectedBook.coverImageUrl,
    });
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8 space-y-8">
      {/* CARD HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-md shadow-indigo-500/20">
            <Layers size={22} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Content Manager
            </h2>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              Subject → Textbook → Chapter workflow hierarchy
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 border border-sky-100 rounded-2xl text-sky-700 text-xs font-bold">
          <Sparkles size={14} className="text-sky-500" /> Administrative Portal
        </div>
      </div>

      {/* BREADCRUMB / STEP NAVIGATION PILLS */}
      <div className="bg-slate-50/80 border border-slate-200/60 rounded-2xl p-2.5 flex flex-wrap items-center gap-2 shadow-inner">
        <StepPill
          stepNumber="1"
          active={!subject}
          done={!!subject}
          label="Subject"
          onClick={subject ? goToSubjects : undefined}
        />

        <ChevronRight size={15} className="text-slate-300 shrink-0" />

        <StepPill
          stepNumber="2"
          active={!!subject && !book}
          done={!!book}
          label={subject ? `Textbooks (${subject.name})` : "Textbooks"}
          onClick={subject ? goToTextbooks : undefined}
        />

        <ChevronRight size={15} className="text-slate-300 shrink-0" />

        <StepPill
          stepNumber="3"
          active={!!book}
          done={false}
          label={book ? `Chapters (${book.title})` : "Chapters"}
        />
      </div>

      {/* STEP 1 - SUBJECT SELECTOR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-extrabold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <GraduationCap size={16} className="text-indigo-500" />
            1. Select Subject
          </p>
          {subject && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 size={13} /> Active: {subject.name}
            </span>
          )}
        </div>

        {subjectsLoading ? (
          <div className="py-8 flex justify-center">
            <Spinner />
          </div>
        ) : subjectsError ? (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center gap-2 text-xs font-semibold">
            <AlertCircle size={16} /> Failed to load subjects. Please refresh.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {subjects?.map((s) => {
              const isSelected = subject?.id === s.id;
              return (
                <motion.button
                  key={s.id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => selectSubject(s)}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs transition-all duration-200 flex items-center gap-2 border ${
                    isSelected
                      ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 ring-2 ring-slate-900/20"
                      : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/40"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? "bg-sky-400" : "bg-slate-300"
                    }`}
                  />
                  {s.name}
                </motion.button>
              );
            })}

            {subjects?.length === 0 && (
              <p className="text-xs text-slate-400 italic py-2">
                No subjects found in the database.
              </p>
            )}
          </div>
        )}
      </div>

      {/* STEP 2 - TEXTBOOKS MANAGER */}
      <AnimatePresence mode="wait">
        {subject && (
          <motion.div
            key={`textbooks-${subject.id}`}
            variants={stepVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="space-y-4 pt-2 border-t border-slate-100"
          >
            <CrudTable
              title={`Textbooks in "${subject.name}"`}
              items={books ?? []}
              isLoading={booksLoading}
              fields={[
                {
                  key: "title",
                  label: "Title",
                },
                {
                  key: "grade",
                  label: "Grade",
                },
                {
                  key: "coverImageUrl",
                  label: "Cover Image URL",
                  type: "file",
                },
              ]}
              onCreate={(values) => createTextbook.mutate(values)}
              onUpdate={(id, values) =>
                updateTextbook.mutate({
                  id,
                  values,
                })
              }
              onDelete={(id) => {
                deleteTextbook.mutate(id);
              }}
            />

            {booksError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center gap-2 text-xs font-semibold">
                <AlertCircle size={16} /> Failed to load textbooks for this subject.
              </div>
            )}

            {/* SELECT TEXTBOOK TO VIEW CHAPTERS */}
            {books && books.length > 0 && (
              <div className="bg-gradient-to-r from-indigo-50/70 via-sky-50/50 to-transparent p-4 rounded-2xl border border-indigo-100/80 space-y-3">
                <p className="font-extrabold text-[11px] uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                  <Library size={14} className="text-indigo-600" />
                  2. Select a Textbook to Manage Chapters
                </p>

                <div className="flex flex-wrap gap-2">
                  {books.map((b) => {
                    const isSelected = book?.id === b.id;
                    return (
                      <motion.button
                        key={b.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => selectBook(b)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                            : "bg-white border-slate-200/90 text-slate-700 hover:border-indigo-300 hover:bg-white"
                        }`}
                      >
                        <BookOpen
                          size={14}
                          className={isSelected ? "text-white" : "text-indigo-500"}
                        />
                        <span>{b.title}</span>
                        {b.grade && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                              isSelected
                                ? "bg-white/20 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            Grade {b.grade}
                          </span>
                        )}
                        <ChevronRight
                          size={13}
                          className={isSelected ? "text-white/80" : "text-slate-400"}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 3 - CHAPTERS MANAGER */}
      <AnimatePresence mode="wait">
        {book && (
          <motion.div
            key={`chapters-${book.id}`}
            variants={stepVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="pt-2 border-t border-slate-100 space-y-3"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 px-1">
              <BookmarkCheck size={14} className="text-sky-500" />
              <span>
                Managing Chapters for: <strong className="text-slate-800">{book.title}</strong>
              </span>
            </div>

            <CrudTable
              title={`Chapters in "${book.title}"`}
              items={chapters ?? []}
              isLoading={chaptersLoading}
              fields={[
                {
                  key: "title",
                  label: "Title",
                },
                {
                  key: "orderNumber",
                  label: "Order",
                  type: "number",
                },
              ]}
              onCreate={(values) => createChapter.mutate(values)}
              onUpdate={(id, values) =>
                updateChapter.mutate({
                  id,
                  values,
                })
              }
              onDelete={(id) => deleteChapter.mutate(id)}
            />

            {chaptersError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center gap-2 text-xs font-semibold">
                <AlertCircle size={16} /> Failed to load chapters for this textbook.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}