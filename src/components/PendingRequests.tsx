import { useEffect, useState } from 'react';
import {
  collection, doc, onSnapshot, writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';

type Pending = {
  id: string;
  name: string;
  phone: string;
  location: string;
  category: string;
  type: string;
  createdAt?: { seconds: number };
};

function normalizePhone(raw: string) {
  const p = raw.replace(/[\s-]/g, '');
  if (p.startsWith('+92')) return p;
  if (p.startsWith('92')) return '+' + p;
  if (p.startsWith('0')) return '+92' + p.slice(1);
  return '+92' + p;
}

export default function PendingRequests() {
  const [items, setItems] = useState<Pending[]>([]);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'pendingWorkers'),
      snap => {
        const list = snap.docs
          .map(d => ({ id: d.id, ...(d.data() as Omit<Pending, 'id'>) }))
          .sort((a, b) => (a.createdAt?.seconds ?? 0) - (b.createdAt?.seconds ?? 0));
        setItems(list);
      },
      () => setError('Could not load requests. Are you logged in?')
    );
    return unsub;
  }, []);

  async function approve(p: Pending) {
    setBusyId(p.id);
    setError('');
    try {
      const batch = writeBatch(db);
      batch.set(doc(collection(db, 'workers')), {
        name: p.name,
        phone: normalizePhone(p.phone),
        location: p.location,
        category: p.category,
        type: p.type,
        subtype: '',
      });
      batch.delete(doc(db, 'pendingWorkers', p.id));
      await batch.commit();
    } catch {
      setError('Approve failed. Please try again.');
    } finally {
      setBusyId('');
    }
  }

  async function reject(p: Pending) {
    if (!window.confirm(`Reject ${p.name}?`)) return;
    setBusyId(p.id);
    setError('');
    try {
      const batch = writeBatch(db);
      batch.delete(doc(db, 'pendingWorkers', p.id));
      await batch.commit();
    } catch {
      setError('Reject failed. Please try again.');
    } finally {
      setBusyId('');
    }
  }

  return (
    <div className="my-4 rounded-2xl bg-white p-4 shadow">
      <h2 className="mb-3 text-lg font-bold">Pending requests ({items.length})</h2>
      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
      {items.length === 0 && <p className="text-gray-500">No pending requests.</p>}

      <div className="space-y-3">
        {items.map(p => (
          <div key={p.id} className="rounded-xl border p-3">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-gray-600">{p.phone}</div>
            <div dir="rtl" className="text-right text-sm">{p.location}</div>
            <div dir="rtl" className="text-right text-sm font-semibold">{p.type}</div>
            <div className="mt-2 flex gap-2">
              <button
                disabled={busyId === p.id}
                onClick={() => approve(p)}
                className="flex-1 rounded-lg bg-green-600 py-2 font-semibold text-white disabled:opacity-60"
              >
                Approve
              </button>
              <button
                disabled={busyId === p.id}
                onClick={() => reject(p)}
                className="flex-1 rounded-lg bg-red-600 py-2 font-semibold text-white disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}