import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronRight, Layers, GraduationCap } from "lucide-react";

import { adminService } from "../../services/adminService";
import { learningService } from "../../services/learningService";
import CrudTable from "./CrudTable";
import Spinner from "../common/Spinner";
import type { Subject, TextBook } from "../../types";

const stepVariants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
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
  active,
  done,
  label,
  onClick,
}: {
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
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold transition-colors ${
        active
          ? "bg-sky text-white shadow"
          : done
          ? "bg-grass/15 text-grass-dark hover:bg-grass/25"
          : "bg-ink/5 text-ink/30"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      {label}
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
    <div className="bg-white rounded-[1.75rem] shadow-md border border-ink/5 p-6">
      {/* HEADER */}
      <h3 className="text-xl font-extrabold flex items-center gap-2 mb-1">
        <span className="h-9 w-9 rounded-xl bg-grape/10 text-grape flex items-center justify-center">
          <Layers size={18} />
        </span>
        Content Manager
      </h3>

      <p className="text-sm text-ink/40 font-medium mb-5">
        Subject → Textbook → Chapter. Pick a level to manage its records.
      </p>

      {/* BREADCRUMB / STEP PILLS */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <StepPill
          active={!subject}
          done={!!subject}
          label="1. Subject"
          onClick={subject ? goToSubjects : undefined}
        />

        <ChevronRight size={14} className="text-ink/20" />

        <StepPill
          active={!!subject && !book}
          done={!!book}
          label={
            subject
              ? `2. Textbooks — ${subject.name}`
              : "2. Textbooks"
          }
          onClick={subject ? goToTextbooks : undefined}
        />

        <ChevronRight size={14} className="text-ink/20" />

        <StepPill
          active={!!book}
          done={false}
          label={
            book
              ? `3. Chapters — ${book.title}`
              : "3. Chapters"
          }
        />
      </div>

      {/* STEP 1 - SUBJECTS */}
      <div className="mb-6">
        <p className="font-bold text-ink/50 text-sm mb-2 flex items-center gap-1.5">
          <GraduationCap size={14} />
          Subjects
        </p>

        {subjectsLoading ? (
          <Spinner />
        ) : subjectsError ? (
          <p className="text-red-500 text-sm">
            Failed to load subjects.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {subjects?.map((s) => (
              <motion.button
                key={s.id}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => selectSubject(s)}
                className={`px-4 py-2 rounded-xl font-semibold border-2 transition-colors ${
                  subject?.id === s.id
                    ? "border-sky bg-sky/10 text-sky-dark"
                    : "border-ink/10 text-ink/60 hover:border-sky/40"
                }`}
              >
                {s.name}
              </motion.button>
            ))}

            {subjects?.length === 0 && (
              <p className="text-ink/40 text-sm">
                No subjects yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* STEP 2 - TEXTBOOKS */}
      <AnimatePresence mode="wait">
        {subject && (
          <motion.div
            key={subject.id}
            variants={stepVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            className="mb-6"
          >
            <CrudTable
              title={`Textbooks in ${subject.name}`}
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
              <p className="text-red-500 text-sm mt-2">
                Failed to load textbooks.
              </p>
            )}

            {/* Select textbook */}
            {books && books.length > 0 && (
              <div className="mt-4">
                <p className="font-bold text-ink/40 text-xs uppercase tracking-wide mb-2">
                  Select a textbook to manage its chapters
                </p>

                <div className="flex flex-wrap gap-2">
                  {books.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => selectBook(b)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold border-2 transition-colors ${
                        book?.id === b.id
                          ? "border-grape bg-grape/10 text-grape"
                          : "border-ink/10 text-ink/50 hover:border-grape/40"
                      }`}
                    >
                      <BookOpen size={14} />
                      {b.title}
                      <ChevronRight
                        size={14}
                        className="opacity-40"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 3 - CHAPTERS */}
      <AnimatePresence mode="wait">
        {book && (
          <motion.div
            key={book.id}
            variants={stepVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            <CrudTable
              title={`Chapters in ${book.title}`}
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
              <p className="text-red-500 text-sm mt-2">
                Failed to load chapters.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}