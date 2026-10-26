import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import WorkerForm from "./WorkerForm";
import CategoriesManager from "./CategoriesManager";
import PendingRequests from "../components/PendingRequests";
import { fetchCategories, defaultCategories } from "../categories";

const emptyForm = { name: "", phone: "", category: "", location: "", type: "", subtype: "" };
const keys = Object.keys(emptyForm);
const clean = (v) => Object.fromEntries(keys.map((k) => [k, (v[k] || "").trim()]));
const low = (v) => (v || "").toLowerCase();

export default function Panel() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState("");
  const [cats, setCats] = useState(defaultCategories);
  const [seeded, setSeeded] = useState(true);
  const [tab, setTab] = useState("workers");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function load() {
    try {
      const snap = await getDocs(collection(db, "workers"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      setWorkers(list);
    } catch (e) {
      console.error(e);
      showToast("⚠️ ڈیٹا لوڈ نہیں ہو سکا");
    }
    setLoading(false);
  }

  async function loadCats() {
    try {
      const r = await fetchCategories();
      setCats(r.list);
      setSeeded(r.fromFirestore);
    } catch (e) {
      console.error(e);
      setCats(defaultCategories);
      setSeeded(false);
      showToast("⚠️ کیٹیگریز لوڈ نہیں ہو سکیں — Firestore rules چیک کریں");
    }
  }

  useEffect(() => {
    load();
    loadCats();
  }, []);

  const q = search.toLowerCase().trim();
  const filtered = q
    ? workers.filter((w) => [w.name, w.category, w.location, w.type].some((f) => low(f).includes(q)))
    : workers;

  async function addWorker() {
    const data = clean(form);
    if (!data.name || !data.phone || !data.category || !data.location || !data.type) {
      showToast("⚠️ تمام ضروری خانے پُر کریں");
      return;
    }
    setAdding(true);
    try {
      await addDoc(collection(db, "workers"), data);
      setForm(emptyForm);
      showToast("✅ نیا کارکن کامیابی سے شامل ہو گیا");
      await load();
    } catch (e) {
      console.error(e);
      showToast("⚠️ کارکن شامل نہیں ہو سکا");
    }
    setAdding(false);
  }

  async function saveEdit() {
    try {
      await updateDoc(doc(db, "workers", editing.id), clean(editing));
      setEditing(null);
      showToast("✅ معلومات کامیابی سے محفوظ ہو گئی");
      await load();
    } catch (e) {
      console.error(e);
      showToast("⚠️ محفوظ نہیں ہو سکا");
    }
  }

  async function removeWorker(w) {
    if (!confirm(`کیا آپ واقعی "${w.name}" کو حذف کرنا چاہتے ہیں؟`)) return;
    try {
      await deleteDoc(doc(db, "workers", w.id));
      showToast("🗑️ کارکن حذف کر دیا گیا");
      await load();
    } catch (e) {
      console.error(e);
      showToast("⚠️ حذف نہیں ہو سکا");
    }
  }

  const card = "mb-6 rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]";

  return (
    <div dir="rtl" className="min-h-screen [font-family:'Segoe_UI',sans-serif]">
      <div className="flex items-center justify-between bg-[#1a1a2e] px-4 py-4 text-white sm:px-6">
        <h1 className="text-base sm:text-xl">⚙️ Balkassar Connect — Admin Panel</h1>
        <button onClick={() => signOut(auth)} className="cursor-pointer rounded-lg bg-[#e53935] px-4 py-2 text-sm text-white">
          باہر نکلیں
        </button>
      </div>

      <div className="mx-auto max-w-[900px] p-4 sm:p-6">
        <div className="mb-6 flex items-center gap-4 rounded-xl bg-white px-6 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <strong className="text-xl text-[#1a1a2e]">{workers.length}</strong>
          <span className="text-[0.95rem] text-[#555]">کل کارکن Firestore میں محفوظ ہیں</span>
        </div>

        <div className="mb-6 flex gap-2">
                   {[
            ["workers", "👷 کارکن"],
            ["categories", "🗂️ کیٹیگریز"],
            ["requests", "📥 درخواستیں"],
          ].map(([id, label]) => (
            <button
              key={id}
                            onClick={() => { setTab(id); if (id === "workers") load(); }}
              className={`flex-1 cursor-pointer rounded-lg py-3 font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${
                tab === id ? "bg-[#1a1a2e] text-white" : "bg-white text-[#555]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "workers" ? (
        <>
        <div className={card}>
          <h2 className="mb-5 border-b-2 border-[#f0f2f5] pb-3 text-lg font-bold text-[#1a1a2e]">➕ نیا کارکن شامل کریں</h2>
          <WorkerForm values={form} onChange={(k, v) => setForm({ ...form, [k]: v })} categories={cats} />
          <button
            onClick={addWorker}
            disabled={adding}
            className="mt-4 w-full cursor-pointer rounded-lg bg-[#4caf50] py-3.5 font-semibold text-white hover:bg-[#43a047] disabled:cursor-not-allowed disabled:bg-[#aaa]"
          >
            {adding ? "شامل ہو رہا ہے..." : "✅ شامل کریں"}
          </button>
        </div>

        <div className="mb-4 rounded-xl bg-white px-6 py-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 نام، کیٹیگری یا مقام سے تلاش کریں..."
            className="w-full rounded-lg border-2 border-[#e0e0e0] px-4 py-3 focus:border-[#1a1a2e] focus:outline-none"
          />
        </div>

        {!loading && <div className="mb-3 px-1 text-sm text-[#888]">{filtered.length} کارکن مل گئے</div>}

        {loading ? (
          <div className="p-8 text-center text-[#888]">لوڈ ہو رہا ہے...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-[#888]">کوئی کارکن نہیں ملا</div>
        ) : (
          filtered.map((w) => (
            <div key={w.id} className="mb-3 flex flex-col items-start gap-4 rounded-[10px] bg-white p-4 shadow-[0_2px_6px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center">
              <div className="flex-1">
                <div className="font-bold text-[#1a1a2e]">{w.name}</div>
                <div className="mt-1 text-[0.82rem] text-[#777]">
                  {w.type} — {w.location}
                </div>
                <div dir="ltr" className="mt-1 text-left text-[0.85rem] text-[#4caf50]">
                  {w.phone}
                </div>
              </div>
              <div className="flex w-full shrink-0 gap-2 sm:w-auto">
                <button onClick={() => setEditing({ ...w })} className="flex-1 cursor-pointer rounded-md bg-[#1976d2] px-4 py-2 text-sm text-white hover:bg-[#1565c0]">
                  ترمیم
                </button>
                <button onClick={() => removeWorker(w)} className="flex-1 cursor-pointer rounded-md bg-[#e53935] px-4 py-2 text-sm text-white hover:bg-[#c62828]">
                  حذف
                </button>
              </div>
            </div>
          ))
        )}
        </>
                ) : tab === "categories" ? (
          <CategoriesManager categories={cats} seeded={seeded} workers={workers} reload={loadCats} showToast={showToast} />
        ) : (
          <PendingRequests />
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-[500px] overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className="mb-5 border-b-2 border-[#f0f2f5] pb-3 text-lg font-bold text-[#1a1a2e]">✏️ کارکن کی معلومات تبدیل کریں</h2>
            <WorkerForm values={editing} onChange={(k, v) => setEditing({ ...editing, [k]: v })} categories={cats} />
            <div className="mt-4 flex gap-3">
              <button onClick={() => setEditing(null)} className="flex-1 cursor-pointer rounded-lg bg-[#f0f2f5] py-3.5 font-semibold text-[#333] hover:bg-[#e0e0e0]">
                منسوخ
              </button>
              <button onClick={saveEdit} className="flex-1 cursor-pointer rounded-lg bg-[#4caf50] py-3.5 font-semibold text-white hover:bg-[#43a047]">
                💾 محفوظ کریں
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`pointer-events-none fixed bottom-8 left-1/2 z-[9999] -translate-x-1/2 rounded-[10px] bg-[#1a1a2e] px-6 py-3.5 text-white transition-opacity duration-300 ${toast ? "opacity-100" : "opacity-0"}`}>
        {toast}
      </div>
    </div>
  );
}
