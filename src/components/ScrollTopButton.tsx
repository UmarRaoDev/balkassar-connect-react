import { useEffect, useState } from "react";

export default function ScrollTopButton({ getLastCategory }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    const last = getLastCategory();
    const btn = last && document.getElementById(`cat-${last}`);
    if (btn) btn.scrollIntoView({ behavior: "smooth", block: "center" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Scroll to top"
      className={`fixed right-6 bottom-3 z-100 size-10 cursor-pointer rounded-full bg-primary text-lg text-white shadow-soft transition active:scale-90 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      ↑
    </button>
  );
}
