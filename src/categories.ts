import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { categories, subtypeCategories } from "./data";

// Used until categories are moved to Firestore (and as a fallback if loading fails)
export const defaultCategories = categories
  .filter((c) => c.id !== "all")
  .map((c, i) => ({ ...c, order: i + 1, showSubtype: subtypeCategories.includes(c.id) }));

export async function fetchCategories() {
  const snap = await getDocs(collection(db, "categories"));
  const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  if (list.length === 0) return { list: defaultCategories, fromFirestore: false };
 list.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  return { list, fromFirestore: true };
}
