import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

export function useWorkers() {
  const [workers, setWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDocs(collection(db, 'workers'))
      .then((snap) => {
        setWorkers(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      })
      .catch((err) => console.error('Firebase error:', err))
      .finally(() => setLoading(false))
  }, [])

  return { workers, loading }
}