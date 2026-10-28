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
import DisclaimerLink from "./components/DisclaimerLink";

const allCategory = { id: "all", icon: "🧩", label: "تمام خدمات" };

export default function Home() {
  const [workers, setWorkers] = useState([]);
  const [cats, setCats] = useState(defaultCategories);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [category, setCategory] = useState("all");
  const listRef = useRef(null);
  const lastCategory = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const snapshot = await getDocs(collection(db, "workers"));
        setWorkers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setStatus("ready");
      } catch (error) {
        console.error("Firebase error:", error);
        setStatus("error");
      }
    }
    load();
    fetchCategories()
      .then((r) => setCats(r.list))
      .catch((e) => console.error("Categories error:", e));
  }, []);

  const categories = [allCategory, ...cats];

  const selectCategory = (id) => {
    lastCategory.current = id;
    setCategory(id);
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const filtered = category === "all" ? workers : workers.filter((w) => w.category === category);
  const showGroups = category === "all" || category === "whatsapp-group";
  const title = categories.find((c) => c.id === category)?.label;

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-[1200px] px-3 sm:px-4">
        <CategoryGrid categories={categories} active={category} onSelect={selectCategory} />

        <p dir="rtl" className="mt-3 text-center font-urdu text-[0.85rem] text-ink-light italic opacity-80">
          مزید سروسز شامل کی جا رہی ہیں...
        </p>

        <CreatorCard />

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
                  showType={category === "all"}
                  showSubtype={cats.find((c) => c.id === worker.category)?.showSubtype}
                />
              ))}
              {showGroups && whatsappGroups.map((g) => <GroupCard key={g.link} group={g} />)}
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
