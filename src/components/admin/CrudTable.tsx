import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import Button from "../common/Button";
import TextField from "../common/TextField";
import { useLanguage } from "../../context/LanguageContext";

export interface FieldDef {
  key: string;
  label: string;
  type?: "text" | "number";
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
    fields.forEach((f) => (initial[f.key] = f.type === "number" ? 0 : ""));
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

  return (
    <div className="bg-white rounded-3xl shadow-md border-4 border-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-extrabold text-lg">{title}</h3>
        <Button size="sm" onClick={startCreate}>
          <Plus size={16} /> {t.admin.add}
        </Button>
      </div>

      {editingId === "new" && (
        <div className="border-2 border-sky/30 bg-sky/5 rounded-2xl p-4 mb-4">
          {fields.map((f) => (
            <TextField
              key={f.key}
              label={f.label}
              type={f.type ?? "text"}
              value={form[f.key] ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
            />
          ))}
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
                <div className="border-2 border-sky/30 bg-sky/5 rounded-2xl p-4">
                  {fields.map((f) => (
                    <TextField
                      key={f.key}
                      label={f.label}
                      type={f.type ?? "text"}
                      value={form[f.key] ?? ""}
                      onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                    />
                  ))}
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
                  <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    {fields.map((f) => (
                      <span key={f.key}>
                        <span className="text-ink/40 font-semibold">{f.label}: </span>
                        <span className="font-bold">{String(item[f.key])}</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(item)}
                      className="h-9 w-9 flex items-center justify-center rounded-xl text-sky-dark hover:bg-sky/10"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
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
