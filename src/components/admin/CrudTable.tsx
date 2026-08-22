import { useState } from "react";
import { Pencil, Plus, Trash2, X, Image as ImageIcon } from "lucide-react";
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
        <div key={f.key} className="mb-3">
          <label className="block text-xs font-bold text-slate-600 mb-1">
            {f.label}
          </label>
          {previewUrl ? (
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 mb-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
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
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
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
              className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky/10 file:text-sky-dark hover:file:bg-sky/20 transition cursor-pointer"
            />
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
          className="w-10 h-10 object-cover rounded-xl border border-slate-200 shadow-sm inline-block"
        />
      ) : (
        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 inline-block">
          <ImageIcon size={16} />
        </div>
      );
    }

    return <span className="font-bold">{String(val ?? "—")}</span>;
  };

  return (
    <div className="bg-white rounded-3xl shadow-md border-4 border-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-lg">{title}</h3>
        <Button size="sm" onClick={startCreate}>
          <Plus size={16} /> {t.admin.add}
        </Button>
      </div>

      {editingId === "new" && (
        <div className="border-2 border-sky/30 bg-sky/5 rounded-2xl p-4 mb-4 space-y-3">
          {fields.map((f) => renderFieldInput(f))}
          <div className="flex gap-2">
            <Button size="sm" onClick={save}>
              {t.admin.save}
            </Button>
            <Button size="sm" variant="ghost" onClick={cancel}>
              {t.admin.cancel}
            </Button>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-ink/40 text-sm">{t.common.loading}</p>
      ) : (
        <div className="divide-y divide-ink/5">
          {items.map((item) => (
            <div key={item.id} className="py-3">
              {editingId === item.id ? (
                <div className="border-2 border-sky/30 bg-sky/5 rounded-2xl p-4 space-y-3">
                  {fields.map((f) => renderFieldInput(f))}
                  <div className="flex gap-2">
                    <Button size="sm" onClick={save}>
                      {t.admin.save}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={cancel}>
                      <X size={14} /> {t.admin.cancel}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                    {fields.map((f) => (
                      <span key={f.key} className="flex items-center gap-1.5">
                        <span className="text-ink/40 font-semibold">{f.label}: </span>
                        {renderCellContent(item, f)}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="h-9 w-9 flex items-center justify-center rounded-xl text-sky-dark hover:bg-sky/10"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="h-9 w-9 flex items-center justify-center rounded-xl text-coral-dark hover:bg-coral/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && <p className="text-ink/40 text-sm py-4">Nothing here yet.</p>}
        </div>
      )}
    </div>
  );
}