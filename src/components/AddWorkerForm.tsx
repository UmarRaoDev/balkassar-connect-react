import { useEffect, useState } from 'react';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // change this path to wherever your db is exported

type Cat = { slug: string; label: string; order: number };

const OTHER = '__other__';
const HIDDEN = ['whatsapp-group', 'other-services', 'multi-service'];

export default function AddWorkerForm() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [trap, setTrap] = useState(''); // hidden field, bots fill it
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getDocs(collection(db, 'categories')).then(snap => {
      const list = snap.docs
        .map(d => ({ slug: d.id, label: d.data().label as string, order: (d.data().order as number) ?? 999 }))
        .filter(c => c.label && !HIDDEN.includes(c.slug))
        .sort((a, b) => a.order - b.order);
      setCats(list);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError('');

    const cleanPhone = phone.replace(/[\s-]/g, '');
    const isOther = category === OTHER;

    if (name.trim().length < 2) return setError('براہ کرم اپنا نام لکھیں');
    if (!/^(\+92|0)?3\d{9}$/.test(cleanPhone)) return setError('براہ کرم درست موبائل نمبر لکھیں');
    if (location.trim().length < 2) return setError('براہ کرم اپنا علاقہ لکھیں');
    if (!category) return setError('براہ کرم اپنا کام منتخب کریں');
    if (isOther && customCategory.trim().length < 2) return setError('براہ کرم اپنا کام لکھیں');

    if (trap) { setDone(true); return; } // bot, pretend success

    setLoading(true);
    try {
      const cat = cats.find(c => c.slug === category);
      await addDoc(collection(db, 'pendingWorkers'), {
        name: name.trim(),
        phone: cleanPhone,
        location: location.trim(),
       category: isOther ? 'other-services' : category,
        type: isOther ? customCategory.trim() : (cat?.label ?? ''),
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch {
      setError('کچھ غلط ہو گیا۔ براہ کرم دوبارہ کوشش کریں۔');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div dir="rtl" className="p-6 text-center">
        <p className="text-lg font-semibold">شکریہ!</p>
        <p className="text-gray-600">آپ کی درخواست موصول ہو گئی ہے۔ منظوری کے بعد یہ ویب سائٹ پر نظر آئے گی۔</p>
      </div>
    );
  }

  return (
    <form dir="rtl" onSubmit={handleSubmit} className="space-y-3 p-4 max-w-md mx-auto">
     <h2 className="text-xl font-bold pr-12">اپنی سروس شامل کریں</h2>

     <input dir="auto" className="w-full border rounded-lg p-3" placeholder="اپنا نام لکھیں"
  value={name} onChange={e => setName(e.target.value)} maxLength={60} />


      <input dir="auto" className="w-full border rounded-lg p-3" placeholder="موبائل نمبر (03xx xxxxxxx)"
  inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} maxLength={15} />

     <input dir="auto" className="w-full border rounded-lg p-3" placeholder="علاقہ / محلہ"
  value={location} onChange={e => setLocation(e.target.value)} maxLength={60} />

      <select className="w-full border rounded-lg p-3" value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">اپنا کام منتخب کریں</option>
        {cats.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
        <option value={OTHER}>ان میں سے کوئی نہیں</option>
      </select>

      {category === OTHER && (
        <input dir="auto" className="w-full border rounded-lg p-3" placeholder="اپنا کام لکھیں (مثلاً: درزی)"
  value={customCategory} onChange={e => setCustomCategory(e.target.value)} maxLength={40} />
      )}

      {/* hidden trap for bots */}
      <input className="hidden" tabIndex={-1} autoComplete="off" value={trap} onChange={e => setTrap(e.target.value)} />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button disabled={loading} className="w-full bg-green-600 text-white rounded-lg p-3 font-semibold disabled:opacity-60">
        {loading ? 'بھیجا جا رہا ہے...' : 'درخواست بھیجیں'}
      </button>
    </form>
  );
}