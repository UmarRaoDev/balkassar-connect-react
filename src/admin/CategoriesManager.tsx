import { useState } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { defaultCategories } from "../categories";

const input =
  "rounded-lg border-2 border-[#e0e0e0] px-3.5 py-2.5 text-[0.95rem] focus:border-[#4caf50] focus:outline-none";
const card = "mb-6 rounded-xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]";
const heading = "mb-5 border-b-2 border-[#f0f2f5] pb-3 text-lg font-bold text-[#1a1a2e]";
const emptyForm = { label: "", icon: "", showSubtype: false };

function CategoryForm({ values, onChange }) {
  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.85rem] font-semibold text-[#555]">کیٹیگری کا نام</label>
        <input className={input} value={values.label} onChange={(e) => onChange("label", e.target.value)} placeholder="مثال: ویلڈنگ" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-[0.85rem] font-semibold text-[#555]">آئیکن (ایک ایموجی)</label>
        <input className={input} value={values.icon} onChange={(e) => onChange("icon", e.target.value)} placeholder="مثال: 🔥" />
        <span className="text-xs text-[#888]">کوئی ایک ایموجی پیسٹ کریں۔ ونڈوز میں Win + . دبائیں۔</span>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-[0.9rem] text-[#555]">
        <input type="checkbox" checked={!!values.showSubtype} onChange={(e) => onChange("showSubtype", e.target.checked)} />
        کارڈ پر سروس کا مختصر نام (subtype) دکھائیں
      </label>
    </div>
  );
}

export default function CategoriesManager({ categories, seeded, workers, reload, showToast }) {
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  async function run(action, errorMsg) {
    setBusy(true);
    try {
      await action();
      await reload();
    } catch (e) {
      console.error(e);
      showToast(errorMsg);
    }
    setBusy(false);
  }

  const seed = () =>
    run(async () => {
      const batch = writeBatch(db);
      defaultCategories.forEach((c) =>
        batch.set(doc(db, "categories", c.id), {
          label: c.label,
          icon: c.icon,
          order: c.order,
          showSubtype: c.showSubtype,
        })
      );
      await batch.commit();
      showToast("✅ کیٹیگریز منتقل ہو گئیں");
    }, "⚠️ منتقل نہیں ہو سکیں");

  const addCategory = () => {
    const label = form.label.trim();
    const icon = form.icon.trim();
    if (!label || !icon) {
      showToast("⚠️ نام اور آئیکن دونوں درج کریں");
      return;
    }
    const order = Math.max(0, ...categories.map((c) => c.order || 0)) + 1;
    return run(async () => {
      await addDoc(collection(db, "categories"), { label, icon, order, showSubtype: form.showSubtype });
      setForm(emptyForm);
      showToast("✅ نئی کیٹیگری شامل ہو گئی");
    }, "⚠️ کیٹیگری شامل نہیں ہو سکی");
  };

  const saveEdit = () => {
    const label = editing.label.trim();
    const icon = editing.icon.trim();
    if (!label || !icon) {
      showToast("⚠️ نام اور آئیکن دونوں درج کریں");
      return;
    }
    return run(async () => {
      await updateDoc(doc(db, "categories", editing.id), { label, icon, showSubtype: !!editing.showSubtype });
      setEditing(null);
      showToast("✅ کیٹیگری محفوظ ہو گئی");
    }, "⚠️ محفوظ نہیں ہو سکی");
  };

  const move = (index, dir) => {
    const j = index + dir;
    if (j < 0 || j >= categories.length) return;
    const list = [...categories];
    [list[index], list[j]] = [list[j], list[index]];
    return run(async () => {
      const batch = writeBatch(db);
      list.forEach((c, i) => {
        if (c.order !== i + 1) batch.update(doc(db, "categories", c.id), { order: i + 1 });
      });
      await batch.commit();
    }, "⚠️ ترتیب تبدیل نہیں ہو سکی");
  };

  const remove = (c) => {
    const used = workers.filter((w) => w.category === c.id).length;
    if (used > 0) {
      showToast(`⚠️ اس میں ${used} کارکن ہیں، پہلے انہیں کسی اور کیٹیگری میں منتقل کریں`);
      return;
    }
    if (!confirm(`کیا آپ واقعی "${c.label}" کو حذف کرنا چاہتے ہیں؟`)) return;
    return run(async () => {
      await deleteDoc(doc(db, "categories", c.id));
      showToast("🗑️ کیٹیگری حذف ہو گئی");
    }, "⚠️ حذف نہیں ہو سکی");
  };

  const iconBtn =
    "cursor-pointer rounded-md bg-[#f0f2f5] px-3 py-2 text-sm text-[#333] hover:bg-[#e0e0e0] disabled:cursor-not-allowed disabled:opacity-40";

  if (!seeded) {
    return (
      <div className={card}>
        <h2 className={heading}>📥 پہلے کیٹیگریز منتقل کریں</h2>
        <p className="mb-4 text-[0.95rem] leading-7 text-[#555]">
          کیٹیگریز ابھی ایپ کے کوڈ میں لکھی ہوئی ہیں۔ ایڈمن پینل سے بدلنے کے لیے انہیں ایک بار Firestore میں منتقل کریں۔ آپ کے کارکن اور ان کی کیٹیگریز نہیں بدلیں گی۔
        </p>
        <button onClick={seed} disabled={busy} className="w-full cursor-pointer rounded-lg bg-[#4caf50] py-3.5 font-semibold text-white hover:bg-[#43a047] disabled:bg-[#aaa]">
          {busy ? "..." : "📥 ایک بار منتقل کریں"}
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={card}>
        <h2 className={heading}>➕ نئی کیٹیگری شامل کریں</h2>
        <CategoryForm values={form} onChange={(k, v) => setForm({ ...form, [k]: v })} />
        <button onClick={addCategory} disabled={busy} className="mt-4 w-full cursor-pointer rounded-lg bg-[#4caf50] py-3.5 font-semibold text-white hover:bg-[#43a047] disabled:bg-[#aaa]">
          ✅ شامل کریں
        </button>
      </div>

      <div className="mb-3 px-1 text-sm text-[#888]">{categories.length} کیٹیگریز</div>
      {categories.map((c, i) => (
        <div key={c.id} className="mb-3 flex flex-wrap items-center gap-3 rounded-[10px] bg-white p-4 shadow-[0_2px_6px_rgba(0,0,0,0.05)]">
          <span className="text-2xl">{c.icon}</span>
          <span className="flex-1 font-bold text-[#1a1a2e]">{c.label}</span>
          <div className="flex gap-2">
            <button className={iconBtn} disabled={busy || i === 0} onClick={() => move(i, -1)} aria-label="اوپر">↑</button>
            <button className={iconBtn} disabled={busy || i === categories.length - 1} onClick={() => move(i, 1)} aria-label="نیچے">↓</button>
            <button onClick={() => setEditing({ ...c })} className="cursor-pointer rounded-md bg-[#1976d2] px-4 py-2 text-sm text-white hover:bg-[#1565c0]">ترمیم</button>
            {c.id !== "whatsapp-group" && (
              <button onClick={() => remove(c)} disabled={busy} className="cursor-pointer rounded-md bg-[#e53935] px-4 py-2 text-sm text-white hover:bg-[#c62828]">حذف</button>
            )}
          </div>
        </div>
      ))}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-[500px] overflow-y-auto rounded-2xl bg-white p-6">
            <h2 className={heading}>✏️ کیٹیگری تبدیل کریں</h2>
            <CategoryForm values={editing} onChange={(k, v) => setEditing({ ...editing, [k]: v })} />
            <div className="mt-4 flex gap-3">
              <button onClick={() => setEditing(null)} className="flex-1 cursor-pointer rounded-lg bg-[#f0f2f5] py-3.5 font-semibold text-[#333] hover:bg-[#e0e0e0]">منسوخ</button>
              <button onClick={saveEdit} disabled={busy} className="flex-1 cursor-pointer rounded-lg bg-[#4caf50] py-3.5 font-semibold text-white hover:bg-[#43a047]">💾 محفوظ کریں</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
