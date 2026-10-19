export default function CategoryGrid({ categories, active, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5">
      {categories.map((c, i) => {
        const isActive = c.id === active;
        return (
          <button
            key={c.id}
            id={`cat-${c.id}`}
            dir="rtl"
            onClick={() => onSelect(c.id)}
            className={`relative flex cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border-2 bg-white px-2 py-3 font-urdu text-[0.8rem] font-bold shadow-soft transition duration-300 sm:text-base ${
              i === 0 ? "col-span-full" : ""
            } ${
              isActive
                ? "-translate-y-0.5 border-accent shadow-[0_4px_16px_rgba(230,126,34,0.3)]"
                : "border-transparent"
            }`}
          >
            {isActive && (
              <span className="absolute inset-0 bg-linear-to-br from-accent to-accent-dark opacity-[0.08]" />
            )}
            <span className={`relative ${i === 0 ? "text-[1.3rem]" : "text-[1.75rem]"}`}>
              {c.icon}
            </span>
            <span className="relative leading-relaxed">{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}
