import { useEffect, useRef, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { fetchCategories, defaultCategories } from "../categories";
import { whatsappGroups } from "../data";
import Header from "../components/Header";
import CategoryGrid from "../components/CategoryGrid";
import CreatorCard from "../components/CreatorCard";
import WorkerCard from "../components/WorkerCard";
import GroupCard from "../components/GroupCard";
import InstallGuide from "../components/InstallGuide";
import ScrollTopButton from "../components/ScrollTopButton";
import SearchBar from "../components/SearchBar";
import { matchesWorker } from "../search";

const allCategory = { id: "all", icon: "🧩", label: "تمام خدمات" };
const CACHE_KEY = "workers-cache";
const CATS_CACHE_KEY = "categories-cache";
export default function Home() {
  const [workers, setWorkers] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) || [];
  } catch {
    return [];
  }
});
  const [cats, setCats] = useState(() => {
  try {
    return JSON.parse(localStorage.getItem(CATS_CACHE_KEY));
  } catch {
    return null;
  }
}); // null = nothing saved yet, still loading from Firestore // null = still loading from Firestore
 const [status, setStatus] = useState(() =>
  localStorage.getItem(CACHE_KEY) ? "ready" : "loading"
);// loading | ready | error
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const listRef = useRef(null);
  const lastCategory = useRef(null);

  useEffect(() => {
    async function load() {
  try {
    const snapshot = await getDocs(collection(db, "workers"));
    const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setWorkers(list);
    setStatus("ready");
    localStorage.setItem(CACHE_KEY, JSON.stringify(list));
  } catch (error) {
    console.error("Firebase error:", error);
    setStatus((s) => (s === "ready" ? s : "error"));
  }
}
    load();
    fetchCategories()
  .then((r) => {
    setCats(r.list);
    localStorage.setItem(CATS_CACHE_KEY, JSON.stringify(r.list));
  })
      .catch((e) => {
        console.error("Categories error:", e);
        setCats(defaultCategories);
      });
  }, []);

  const categories = [allCategory, ...(cats || [])];

  const selectCategory = (id) => {
    setQuery("");
    lastCategory.current = id;
    setCategory(id);
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const searching = query.trim().length > 0;
  const filtered = searching
    ? workers.filter((w) => matchesWorker(w, query, cats || []))
    : category === "all"
      ? workers
      : workers.filter((w) => w.category === category);
  const showGroups = !searching && (category === "all" || category === "whatsapp-group");
  const title = searching
    ? `تلاش کے نتائج (${filtered.length})`
    : categories.find((c) => c.id === category)?.label;

  const notFoundLink = `https://wa.me/923140978485?text=${encodeURIComponent(
    `السلام علیکم، میں "${query.trim()}" تلاش کر رہا تھا لیکن بلکسر کنیکٹ پر نہیں ملا۔`
  )}`;

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-[1200px] px-3 sm:px-4">
        <SearchBar value={query} onChange={setQuery} />

        {!searching && (
          <>
            {cats === null ? (
              <p className="p-8 text-center">لوڈ ہو رہا ہے...</p>
            ) : (
              <CategoryGrid categories={cats} active={category} onSelect={selectCategory} />
            )}

            <p dir="rtl" className="mt-3 text-center font-urdu text-[0.85rem] text-ink-light italic opacity-80">
              مزید سروسز شامل کی جا رہی ہیں...
            </p>

            <CreatorCard />
          </>
        )}

        <section ref={listRef} className="scroll-mt-4">
          <h2
            dir="rtl"
            className="mb-4 flex items-center gap-2 font-urdu text-base font-bold text-primary sm:text-xl md:text-2xl"
          >
            <span className="h-6 w-1 rounded-sm bg-accent" />
            {title}
          </h2>

          {status === "loading" && <p className="p-8 text-center">لوڈ ہو رہا ہے...</p>}
          {status === "error" && (
            <p className="p-8 text-center">ڈیٹا لوڈ نہیں ہو سکا، دوبارہ کوشش کریں۔</p>
          )}

          {status === "ready" && (
            <div className="mx-auto grid max-w-lg gap-3 md:max-w-4xl md:grid-cols-2 xl:max-w-6xl xl:grid-cols-3">
              {filtered.map((worker, i) => (
                <WorkerCard
                  key={worker.id}
                  worker={worker}
                  index={i}
                  showType={category === "all" || searching}
                  showSubtype={cats?.find((c) => c.id === worker.category)?.showSubtype}
                />
              ))}
              {showGroups && whatsappGroups.map((g) => <GroupCard key={g.link} group={g} />)}
            </div>
          )}

          {status === "ready" && searching && filtered.length === 0 && (
            <div dir="rtl" className="mx-auto max-w-lg rounded-2xl bg-white p-5 text-center shadow-soft">
              <p className="mb-1 font-urdu text-base font-bold">کوئی نتیجہ نہیں ملا</p>
              <p className="mb-4 font-urdu text-[0.9rem] leading-[1.8] text-ink-light">
                جو آپ ڈھونڈ رہے ہیں وہ ہمیں بتائیں، ہم اسے شامل کر دیں گے۔
              </p>
              <a
                href={notFoundLink}
                className="inline-block rounded-xl bg-whatsapp px-5 py-2.5 font-urdu text-[0.9rem] font-semibold text-white shadow-[0_2px_8px_rgba(37,211,102,0.3)] transition active:scale-95"
              >
                ہمیں بتائیں
              </a>
            </div>
          )}
        </section>
      </main>

      <ScrollTopButton getLastCategory={() => lastCategory.current} />

      <InstallGuide />

      <p className="my-4 text-center text-[0.9rem] text-ink-light opacity-80">Built with ❤️ by Umar</p>
    </>
  );
}