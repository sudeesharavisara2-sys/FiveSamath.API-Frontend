import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
  Plus,
  Trash2,
  X,
  Image as ImageIcon,
  UploadCloud,
  Check,
  Sparkles,
  Inbox,
} from "lucide-react";
import Button from "../common/Button";
import TextField from "../common/TextField";
import { useLanguage } from "../../context/LanguageContext";

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "number" | "file";
  accept?: string;
}

interface Props<T extends { id: number }> {
  title: string;
  items: T[];
  fields: FieldDef[];
  isLoading?: boolean;
  onCreate: (values: Record<string, any>) => void;
  onUpdate: (id: number, values: Record<string, any>) => void;
  onDelete: (id: number) => void;
}

export default function CrudTable<T extends { id: number } & Record<string, any>>({
  title,
  items,
  fields,
  isLoading,
  onCreate,
  onUpdate,
  onDelete,
}: Props<T>) {
  const { t } = useLanguage();
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const startEdit = (item: T) => {
    setEditingId(item.id);
    const initial: Record<string, any> = {};
    fields.forEach((f) => (initial[f.key] = item[f.key]));
    setForm(initial);
  };

  const startCreate = () => {
    setEditingId("new");
    const initial: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "number") initial[f.key] = 0;
      else if (f.type === "file") initial[f.key] = null;
      else initial[f.key] = "";
    });
    setForm(initial);
  };

  const cancel = () => {
    setEditingId(null);
    setForm({});
  };

  const save = () => {
    if (editingId === "new") onCreate(form);
    else if (typeof editingId === "number") onUpdate(editingId, form);
    cancel();
  };

  const renderFieldInput = (f: FieldDef) => {
    if (f.type === "file") {
      const val = form[f.key];
      const previewUrl =
        val instanceof File
          ? URL.createObjectURL(val)
          : typeof val === "string" && val.trim() !== ""
          ? val
          : null;

      return (
        <div key={f.key} className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            {f.label}
          </label>
          {previewUrl ? (
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-indigo-500/40 shadow-sm group bg-slate-900">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    [f.key]: null,
                    removeCoverImage: true,
                  }))
                }
                className="absolute top-1.5 right-1.5 bg-rose-500/90 backdrop-blur-md text-white p-1 rounded-full hover:bg-rose-600 transition-colors shadow-sm"
              >
                <X size={13} />
              </button>
            </div>
          ) : (
            <label className="relative flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-700 hover:border-indigo-500 bg-slate-950/60 hover:bg-slate-900 rounded-2xl cursor-pointer transition-all group">
              <UploadCloud size={22} className="text-indigo-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold text-slate-300">Choose image file</span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">PNG, JPG, or WEBP</span>
              <input
                type="file"
                accept={f.accept || "image/*"}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setForm((prev) => ({
                      ...prev,
                      [f.key]: file,
                      removeCoverImage: false,
                    }));
                  }
                }}
                className="sr-only"
              />
            </label>
          )}
        </div>
      );
    }

    return (
      <TextField
        key={f.key}
        label={f.label}
        type={f.type ?? "text"}
        value={form[f.key] ?? ""}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
        }
      />
    );
  };

  const renderCellContent = (item: T, f: FieldDef) => {
    const val = item[f.key];

    if (f.type === "file" || f.key.toLowerCase().includes("image") || f.key.toLowerCase().includes("cover")) {
      const src =
        val instanceof File
          ? URL.createObjectURL(val)
          : typeof val === "string" && val.trim() !== ""
          ? val
          : null;

      return src ? (
        <img
          src={src}
          alt={f.label}
          className="w-9 h-9 object-cover rounded-xl border border-slate-700 shadow-xs inline-block shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 inline-block shrink-0">
          <ImageIcon size={15} />
        </div>
      );
    }

    return <span className="font-semibold text-slate-200">{String(val ?? "—")}</span>;
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800/80 p-6 space-y-6 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-black text-xl text-white tracking-tight">{title}</h3>
            <p className="text-slate-400 text-xs font-medium">Manage records and content details</p>
          </div>
        </div>

        {editingId !== "new" && (
          <Button size="sm" onClick={startCreate} className="shadow-lg shadow-indigo-600/30">
            <Plus size={16} /> {t.admin.add}
          </Button>
        )}
      </div>

      {/* CREATE FORM INLINE MODAL */}
      <AnimatePresence>
        {editingId === "new" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border border-indigo-500/30 bg-slate-950/80 rounded-2xl p-5 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Plus size={14} /> Create New Entry
                </span>
                <button
                  onClick={cancel}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {fields.map((f) => renderFieldInput(f))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <Button size="sm" variant="ghost" onClick={cancel}>
                  {t.admin.cancel}
                </Button>
                <Button size="sm" onClick={save}>
                  <Check size={15} /> {t.admin.save}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ITEMS LISTING */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-400">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-medium">{t.common.loading}</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-800/60">
          {items.map((item) => (
            <div key={item.id} className="py-3.5 first:pt-0 last:pb-0">
              <AnimatePresence mode="wait">
                {editingId === item.id ? (
                  <motion.div
                    key="edit-form"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="border border-indigo-500/30 bg-slate-950/80 rounded-2xl p-5 space-y-4 shadow-2xl"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                        <Pencil size={14} /> Editing Record #{item.id}
                      </span>
                      <button
                        onClick={cancel}
                        className="text-slate-400 hover:text-white transition-colors p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {fields.map((f) => renderFieldInput(f))}
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                      <Button size="sm" variant="ghost" onClick={cancel}>
                        {t.admin.cancel}
                      </Button>
                      <Button size="sm" onClick={save}>
                        <Check size={15} /> {t.admin.save}
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="row-content"
                    className="flex items-center justify-between gap-4 p-3 rounded-2xl hover:bg-slate-800/40 transition-colors group"
                  >
                    <div className="flex-1 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      {fields.map((f) => (
                        <div key={f.key} className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                            {f.label}:
                          </span>
                          {renderCellContent(item, f)}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="h-9 w-9 flex items-center justify-center rounded-xl text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="h-9 w-9 flex items-center justify-center rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {items.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
              <Inbox size={36} className="text-slate-600 stroke-[1.5]" />
              <p className="text-xs font-semibold">Nothing here yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}