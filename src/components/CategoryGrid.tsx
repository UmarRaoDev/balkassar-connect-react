import { useState } from "react";

const SHOW_FIRST = 8; // how many categories to show before "See all"

export default function CategoryGrid({ categories, active, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const items = categories.filter((c) => c.id !== "all");
  const canCollapse = items.length > SHOW_FIRST;
  const visible = expanded || !canCollapse ? items : items.slice(0, SHOW_FIRST);

  return (
    <div dir="rtl" className="grid grid-cols-3 gap-x-2 gap-y-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {visible.map((c) => {
        const isActive = c.id === active;
        return (
          <button
            key={c.id}
            id={`cat-${c.id}`}
            // tapping the selected category again shows everyone
            onClick={() => onSelect(isActive ? "all" : c.id)}
            className="flex cursor-pointer flex-col items-center gap-1.5 active:scale-95"
          >
            <span
              className={`flex size-14 items-center justify-center rounded-full text-[1.6rem] shadow-soft transition ${
                isActive
                  ? "bg-accent ring-2 ring-accent/40 ring-offset-2"
                  : "bg-primary/10"
              }`}
            >
              {c.icon}
            </span>
            <span
              className={`line-clamp-2 w-full px-0.5 text-center font-urdu text-[0.7rem] leading-snug font-bold sm:text-xs ${
                isActive ? "text-accent-dark" : "text-ink"
              }`}
            >
              {c.label}
            </span>
          </button>
        );
      })}

      {canCollapse && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex cursor-pointer flex-col items-center gap-1.5 active:scale-95"
        >
          <span className="flex size-14 items-center justify-center rounded-full bg-primary text-[1.6rem] text-white shadow-soft">
            {expanded ? "▲" : "⋯"}
          </span>
          <span className="w-full px-0.5 text-center font-urdu text-[0.7rem] leading-snug font-bold text-ink sm:text-xs">
            {expanded ? "کم دکھائیں" : "تمام دیکھیں"}
          </span>
        </button>
      )}
    </div>
  );
}