import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { adminService } from "../../services/adminService";
import { gradesService } from "../../services/gradesService";
import { useLanguage } from "../../context/LanguageContext";
import type { CreateSubjectRequest, Subject } from "../../types";

const emptyForm: CreateSubjectRequest = { name: "", description: "", icon: "book-open", gradeIds: [] };

function gradeIdsFor(subject: Subject): number[] {
  return subject.gradeIds ?? subject.grades?.map((grade) => grade.id) ?? [];
}

export default function SubjectManager() {
  const { t } = useLanguage();
  const client = useQueryClient();
  const [form, setForm] = useState<CreateSubjectRequest>(emptyForm);
  const [editing, setEditing] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const { data: grades = [], isLoading: gradesLoading, isError: gradesError, refetch: retryGrades } = useQuery({ queryKey: ["grades", "active"], queryFn: gradesService.getGrades, select: (items) => items.filter((grade) => grade.isActive) });
  const { data: subjects = [], isLoading } = useQuery({ queryKey: ["admin-subjects"], queryFn: adminService.getSubjects });
  const invalidate = () => client.invalidateQueries({ queryKey: ["admin-subjects"] });
  const save = useMutation({
    mutationFn: () => editing ? adminService.updateSubject(editing, form) : adminService.createSubject(form),
    onSuccess: () => { invalidate(); setEditing(null); setForm(emptyForm); toast.success(editing ? "Subject updated!" : "Subject created!"); },
    onError: (error: { response?: { data?: { message?: string } } }) => toast.error(error.response?.data?.message || t.common.error),
  });
  const remove = useMutation({ mutationFn: adminService.deleteSubject, onSuccess: invalidate, onError: () => toast.error(t.common.error) });
  const visible = subjects.filter((subject) => subject.name.toLowerCase().includes(search.toLowerCase()));
  const toggleGrade = (id: number) => setForm((current) => ({ ...current, gradeIds: current.gradeIds.includes(id) ? current.gradeIds.filter((value) => value !== id) : [...current.gradeIds, id] }));
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!form.name.trim()) return; if (!form.gradeIds.length) { toast.error(t.admin.selectOneGrade); return; } save.mutate(); };
  const startEdit = (subject: Subject) => { setEditing(subject.id); setForm({ name: subject.name, description: subject.description || "", icon: subject.icon || "book-open", gradeIds: gradeIdsFor(subject) }); };

  return <section className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-5">
    <div className="flex flex-wrap gap-3 justify-between items-center"><h2 className="text-xl font-black text-ink">{t.admin.subjects}</h2><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.admin.searchSubjects} className="rounded-xl border-2 border-ink/10 px-3 py-2 text-sm outline-none focus:border-sky" /></div>
    <form onSubmit={submit} className="rounded-2xl bg-sky/5 border-2 border-sky/15 p-4 space-y-3">
      <div className="flex justify-between items-center"><h3 className="font-extrabold">{editing ? t.admin.edit : t.admin.add} {t.admin.subjects}</h3>{editing && <button type="button" onClick={() => { setEditing(null); setForm(emptyForm); }} className="text-ink/50"><X size={18} /></button>}</div>
      <div className="grid sm:grid-cols-2 gap-3"><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={t.admin.subjectName} className="rounded-xl border-2 border-ink/10 px-3 py-2.5 text-sm" /><input value={form.icon} onChange={(event) => setForm({ ...form, icon: event.target.value })} placeholder={t.admin.subjectIcon} className="rounded-xl border-2 border-ink/10 px-3 py-2.5 text-sm" /></div>
      <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder={t.admin.description} className="w-full rounded-xl border-2 border-ink/10 px-3 py-2.5 text-sm" />
      <fieldset><legend className="font-bold text-sm text-ink/70 mb-2">{t.admin.chooseGrades}</legend>{gradesLoading ? <p className="text-sm text-ink/50">{t.common.loading}</p> : gradesError ? <button type="button" onClick={() => retryGrades()} className="text-sm text-coral font-bold">{t.common.retry}</button> : <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{grades.map((grade) => { const selected = form.gradeIds.includes(grade.id); return <button key={grade.id} type="button" onClick={() => toggleGrade(grade.id)} aria-pressed={selected} className={`rounded-xl border-2 p-2.5 text-sm font-bold text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky ${selected ? "border-sky bg-sky text-white" : "border-ink/10 hover:border-sky/50"}`}>{selected && <Check size={14} className="inline mr-1" />}{grade.displayName || grade.name}</button>; })}</div>}</fieldset>
      <button disabled={save.isPending || gradesLoading} className="rounded-xl bg-sky px-4 py-2.5 text-sm font-black text-white disabled:opacity-50">{save.isPending ? t.common.loading : t.admin.save}</button>
    </form>
    {isLoading ? <p className="text-ink/50">{t.common.loading}</p> : <div className="space-y-2">{visible.map((subject) => <div key={subject.id} className="rounded-2xl border border-ink/10 p-4 flex gap-3 justify-between"><div><h3 className="font-black">{subject.name}</h3><p className="text-sm text-ink/60">{subject.description}</p><p className="text-xs font-bold text-sky-dark mt-2">{t.admin.grades}: {gradeIdsFor(subject).map((id) => grades.find((grade) => grade.id === id)?.displayName || grades.find((grade) => grade.id === id)?.name || id).join(", ") || "—"}</p></div><div className="flex h-fit"><button onClick={() => startEdit(subject)} className="p-2 text-sky"><Pencil size={16} /></button><button onClick={() => remove.mutate(subject.id)} className="p-2 text-coral"><Trash2 size={16} /></button></div></div>)}{!visible.length && <p className="text-sm text-ink/50">{t.admin.noSubjects}</p>}</div>}
  </section>;
}
