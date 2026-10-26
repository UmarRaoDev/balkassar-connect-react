import { useEffect, useState } from 'react';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase'; // change this path to wherever your db is exported

type Cat = { slug: string; label: string; order: number };

export default function AddWorkerForm() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [trap, setTrap] = useState(''); // hidden field, bots fill it
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getDocs(collection(db, 'categories')).then(snap => {
      const list = snap.docs
        .map(d => ({ slug: d.id, label: d.data().label as string, order: (d.data().order as number) ?? 999 }))
        .filter(c => c.label && c.slug !== 'whatsapp-group')
        .sort((a, b) => a.order - b.order);
      setCats(list);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setError('');

    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (name.trim().length < 2) return setError('Please enter your name');
    if (!/^(\+92|0)?3\d{9}$/.test(cleanPhone)) return setError('Please enter a valid mobile number');
    if (location.trim().length < 2) return setError('Please enter your location');
    if (!category) return setError('Please choose your work');

    if (trap) { setDone(true); return; } // bot, pretend success

    setLoading(true);
    try {
      const cat = cats.find(c => c.slug === category);
      await addDoc(collection(db, 'pendingWorkers'), {
        name: name.trim(),
        phone: cleanPhone,
        location: location.trim(),
        category,
        type: cat?.label ?? '',
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg font-semibold">Thank you!</p>
        <p className="text-gray-600">Your request has been received. It will appear on the website after approval.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Add your service</h2>

      <input className="w-full border rounded-lg p-3" placeholder="Name"
        value={name} onChange={e => setName(e.target.value)} maxLength={60} />

      <input className="w-full border rounded-lg p-3" placeholder="Mobile number (03xx xxxxxxx)"
        inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} maxLength={15} />

      <input className="w-full border rounded-lg p-3" placeholder="Location (area / mohalla)"
        value={location} onChange={e => setLocation(e.target.value)} maxLength={60} />

      <select className="w-full border rounded-lg p-3" value={category} onChange={e => setCategory(e.target.value)}>
        <option value="">Choose your work</option>
        {cats.map(c => <option key={c.slug} value={c.slug}>{c.label}</option>)}
      </select>

      {/* hidden trap for bots */}
      <input className="hidden" tabIndex={-1} autoComplete="off" value={trap} onChange={e => setTrap(e.target.value)} />

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button disabled={loading} className="w-full bg-green-600 text-white rounded-lg p-3 font-semibold disabled:opacity-60">
        {loading ? 'Sending...' : 'Send request'}
      </button>
    </form>
  );
}