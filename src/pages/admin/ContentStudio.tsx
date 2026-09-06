import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { BookOpen, FileUp, Film, HelpCircle, FileQuestion, Sparkles } from "lucide-react";
import { adminService } from "../../services/adminService";
import type { Chapter, Paper } from "../../types";

const inputClass = "w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-sky";
const labelClass = "text-xs font-black uppercase tracking-wide text-slate-500";

export default function ContentStudio() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [chapterId, setChapterId] = useState(0);
  const [paperId, setPaperId] = useState(0);
  const [quizId, setQuizId] = useState(0);
  const [busy, setBusy] = useState(false);

  const [material, setMaterial] = useState({ title: "", description: "", materialType: "Pdf", fileUrl: "", externalUrl: "", textContent: "", orderNumber: 1 });
  const [animation, setAnimation] = useState({ title: "", description: "", backgroundUrl: "", sceneText: "", imageUrl: "", durationSeconds: 5, transitionType: "fade" });
  const [quiz, setQuiz] = useState({ title: "", description: "", passMarkPercentage: 50, xpReward: 30 });
  const [question, setQuestion] = useState({ questionText: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A", explanation: "", orderNumber: 1 });
  const [paperQuestion, setPaperQuestion] = useState({ questionText: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswer: "A", explanation: "", marks: 1, orderNumber: 1 });

  useEffect(() => {
    Promise.all([adminService.getChapters(), adminService.getPapers()])
      .then(([chapterData, paperData]) => {
        setChapters(chapterData);
        setPapers(paperData);
        if (chapterData[0]) setChapterId(chapterData[0].id);
        if (paperData[0]) setPaperId(paperData[0].id);
      })
      .catch(() => toast.error("Could not load content studio data."));
  }, []);

  const selectedChapter = useMemo(() => chapters.find((c) => c.id === chapterId), [chapters, chapterId]);
  const selectedPaper = useMemo(() => papers.find((p) => p.id === paperId), [papers, paperId]);

  async function withBusy(action: () => Promise<unknown>, success: string) {
    try {
      setBusy(true);
      await action();
      toast.success(success);
    } catch (error) {
      console.error(error);
      toast.error("Action failed. Check the values and try again.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadMaterialFile(file?: File) {
    if (!file) return;
    await withBusy(async () => {
      const result = await adminService.uploadFile(file, "materials");
      setMaterial((m) => ({ ...m, fileUrl: result.url }));
    }, "File uploaded. Save the material to attach it to the chapter.");
  }

  const cardClass = "rounded-3xl border border-slate-200 bg-white p-6 shadow-lg space-y-4";

  return (
    <div className="space-y-8 pb-12">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 p-8 text-white shadow-xl">
        <div className="flex items-center gap-3"><Sparkles className="text-amber-300" /><h1 className="text-3xl font-black">Content Studio</h1></div>
        <p className="mt-2 text-sm font-semibold text-indigo-200">Build chapter resources, animated scenes, quizzes, and online exam questions.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className={cardClass}>
          <label className={labelClass}>Working chapter</label>
          <select className={inputClass} value={chapterId} onChange={(e) => setChapterId(Number(e.target.value))}>
            {chapters.map((c) => <option key={c.id} value={c.id}>#{c.id} · {c.title}</option>)}
          </select>
          <p className="text-xs text-slate-500">{selectedChapter?.summary || "Create a chapter in the Admin Dashboard first."}</p>
        </div>
        <div className={cardClass}>
          <label className={labelClass}>Working paper</label>
          <select className={inputClass} value={paperId} onChange={(e) => setPaperId(Number(e.target.value))}>
            {papers.map((p) => <option key={p.id} value={p.id}>#{p.id} · {p.title}</option>)}
          </select>
          <p className="text-xs text-slate-500">{selectedPaper?.paperType || "Create an exam paper in the Admin Dashboard first."}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className={cardClass}>
          <div className="flex items-center gap-2"><FileUp className="text-sky" /><h2 className="text-lg font-black">Learning Material</h2></div>
          <input className={inputClass} placeholder="Material title" value={material.title} onChange={(e) => setMaterial({ ...material, title: e.target.value })} />
          <textarea className={inputClass} placeholder="Description" value={material.description} onChange={(e) => setMaterial({ ...material, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <select className={inputClass} value={material.materialType} onChange={(e) => setMaterial({ ...material, materialType: e.target.value })}>
              {['Pdf','Video','Note','Image','Animation','Link','Download'].map((x) => <option key={x}>{x}</option>)}
            </select>
            <input className={inputClass} type="number" min="1" value={material.orderNumber} onChange={(e) => setMaterial({ ...material, orderNumber: Number(e.target.value) })} />
          </div>
          <input className={inputClass} placeholder="External URL (YouTube, website, etc.)" value={material.externalUrl} onChange={(e) => setMaterial({ ...material, externalUrl: e.target.value })} />
          <textarea className={inputClass} placeholder="Written note content (optional)" value={material.textContent} onChange={(e) => setMaterial({ ...material, textContent: e.target.value })} />
          <input className={inputClass} type="file" accept=".pdf,.jpg,.jpeg,.png,.gif,.mp4,.webm" onChange={(e) => uploadMaterialFile(e.target.files?.[0])} />
          {material.fileUrl && <p className="text-xs font-bold text-emerald-700">Uploaded: {material.fileUrl}</p>}
          <button disabled={busy || !chapterId || !material.title} className="rounded-xl bg-sky px-4 py-2.5 text-sm font-black text-white disabled:opacity-50" onClick={() => withBusy(() => adminService.createMaterial({ ...material, chapterId, isPublished: true }), "Material added to chapter.")}>Save Material</button>
        </section>

        <section className={cardClass}>
          <div className="flex items-center gap-2"><Film className="text-purple-600" /><h2 className="text-lg font-black">Animation Scene</h2></div>
          <input className={inputClass} placeholder="Animation title" value={animation.title} onChange={(e) => setAnimation({ ...animation, title: e.target.value })} />
          <textarea className={inputClass} placeholder="Animation description" value={animation.description} onChange={(e) => setAnimation({ ...animation, description: e.target.value })} />
          <textarea className={inputClass} placeholder="Scene text / narration" value={animation.sceneText} onChange={(e) => setAnimation({ ...animation, sceneText: e.target.value })} />
          <input className={inputClass} placeholder="Scene image URL (optional)" value={animation.imageUrl} onChange={(e) => setAnimation({ ...animation, imageUrl: e.target.value })} />
          <div className="grid grid-cols-2 gap-3"><input className={inputClass} type="number" min="1" value={animation.durationSeconds} onChange={(e) => setAnimation({ ...animation, durationSeconds: Number(e.target.value) })} /><select className={inputClass} value={animation.transitionType} onChange={(e) => setAnimation({ ...animation, transitionType: e.target.value })}><option>fade</option><option>slide</option><option>scale</option></select></div>
          <button disabled={busy || !chapterId || !animation.title || !animation.sceneText} className="rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-black text-white disabled:opacity-50" onClick={() => withBusy(() => adminService.createAnimation({ chapterId, title: animation.title, description: animation.description, backgroundUrl: animation.backgroundUrl, isPublished: true, scenes: [{ orderNumber: 1, textContent: animation.sceneText, imageUrl: animation.imageUrl, durationSeconds: animation.durationSeconds, transitionType: animation.transitionType, narrationUrl: "" }] }), "Animation added to chapter.")}>Create Animation</button>
        </section>

        <section className={cardClass}>
          <div className="flex items-center gap-2"><HelpCircle className="text-amber-500" /><h2 className="text-lg font-black">Chapter Quiz</h2></div>
          <input className={inputClass} placeholder="Quiz title" value={quiz.title} onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
          <textarea className={inputClass} placeholder="Description" value={quiz.description} onChange={(e) => setQuiz({ ...quiz, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-3"><input className={inputClass} type="number" min="0" max="100" value={quiz.passMarkPercentage} onChange={(e) => setQuiz({ ...quiz, passMarkPercentage: Number(e.target.value) })} /><input className={inputClass} type="number" min="0" value={quiz.xpReward} onChange={(e) => setQuiz({ ...quiz, xpReward: Number(e.target.value) })} /></div>
          <button disabled={busy || !chapterId || !quiz.title} className="rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-black text-white disabled:opacity-50" onClick={() => withBusy(async () => { const created = await adminService.createQuiz({ ...quiz, chapterId, isRequiredToUnlockNext: true, isActive: true }) as { id?: number }; if (created?.id) setQuizId(created.id); }, "Quiz created. You can now add questions below.")}>Create Quiz</button>
          <div className="border-t pt-4 space-y-3">
            <label className={labelClass}>Quiz ID</label><input className={inputClass} type="number" min="1" value={quizId || ""} onChange={(e) => setQuizId(Number(e.target.value))} placeholder="Created quiz ID" />
            <textarea className={inputClass} placeholder="Question" value={question.questionText} onChange={(e) => setQuestion({ ...question, questionText: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">{(['A','B','C','D'] as const).map((key) => <input key={key} className={inputClass} placeholder={`Option ${key}`} value={question[`option${key}` as keyof typeof question] as string} onChange={(e) => setQuestion({ ...question, [`option${key}`]: e.target.value })} />)}</div>
            <div className="grid grid-cols-2 gap-3"><select className={inputClass} value={question.correctAnswer} onChange={(e) => setQuestion({ ...question, correctAnswer: e.target.value })}>{['A','B','C','D'].map((x) => <option key={x}>{x}</option>)}</select><input className={inputClass} type="number" min="1" value={question.orderNumber} onChange={(e) => setQuestion({ ...question, orderNumber: Number(e.target.value) })} /></div>
            <textarea className={inputClass} placeholder="Explanation" value={question.explanation} onChange={(e) => setQuestion({ ...question, explanation: e.target.value })} />
            <button disabled={busy || !quizId || !question.questionText} className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-black text-white disabled:opacity-50" onClick={() => withBusy(() => adminService.createQuestion({ ...question, quizId, imageUrl: "" }), "Quiz question added.")}>Add Quiz Question</button>
          </div>
        </section>

        <section className={cardClass}>
          <div className="flex items-center gap-2"><FileQuestion className="text-emerald-600" /><h2 className="text-lg font-black">Online Paper Question</h2></div>
          <textarea className={inputClass} placeholder="Question" value={paperQuestion.questionText} onChange={(e) => setPaperQuestion({ ...paperQuestion, questionText: e.target.value })} />
          <div className="grid grid-cols-2 gap-2">{(['A','B','C','D'] as const).map((key) => <input key={key} className={inputClass} placeholder={`Option ${key}`} value={paperQuestion[`option${key}` as keyof typeof paperQuestion] as string} onChange={(e) => setPaperQuestion({ ...paperQuestion, [`option${key}`]: e.target.value })} />)}</div>
          <div className="grid grid-cols-3 gap-3"><select className={inputClass} value={paperQuestion.correctAnswer} onChange={(e) => setPaperQuestion({ ...paperQuestion, correctAnswer: e.target.value })}>{['A','B','C','D'].map((x) => <option key={x}>{x}</option>)}</select><input className={inputClass} type="number" min="1" value={paperQuestion.marks} onChange={(e) => setPaperQuestion({ ...paperQuestion, marks: Number(e.target.value) })} /><input className={inputClass} type="number" min="1" value={paperQuestion.orderNumber} onChange={(e) => setPaperQuestion({ ...paperQuestion, orderNumber: Number(e.target.value) })} /></div>
          <textarea className={inputClass} placeholder="Explanation" value={paperQuestion.explanation} onChange={(e) => setPaperQuestion({ ...paperQuestion, explanation: e.target.value })} />
          <button disabled={busy || !paperId || !paperQuestion.questionText} className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white disabled:opacity-50" onClick={() => withBusy(() => adminService.createPaperQuestion(paperId, { ...paperQuestion, imageUrl: "" }), "Online paper question added.")}>Add Paper Question</button>
        </section>
      </div>

      <div className="rounded-2xl bg-sky/10 p-4 text-sm font-semibold text-sky-dark flex items-start gap-2"><BookOpen size={18} className="mt-0.5 shrink-0" /><p>Student progression is enforced by the API: lessons are freely accessible, while chapters unlock sequentially inside each lesson. Required chapter quizzes must be passed before the chapter can be completed.</p></div>
    </div>
  );
}
