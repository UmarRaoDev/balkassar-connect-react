// Fixed placeholder + three example words that never change:
// driver in Urdu, mistri in Roman Urdu, plumber in English.
// Tapping an example fills the search bar. To change them, edit this list.
const EXAMPLES = ["ڈرائیور", "mistri", "plumber"];

export default function SearchBar({ value, onChange }) {
  return (
    <div className="mx-auto mb-5 max-w-lg">
      <div className="relative">
        <svg
          className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink-light"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>

        <input
          type="search"
          dir="rtl"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="تلاش کریں"
          autoComplete="off"
          enterKeyHint="search"
          className="w-full rounded-2xl border-2 border-transparent bg-white py-3 pr-12 pl-11 font-urdu text-base shadow-soft outline-none transition placeholder:text-ink-light/70 focus:border-accent [&::-webkit-search-cancel-button]:hidden"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear search"
            className="absolute top-1/2 left-3 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-primary/10 text-sm text-primary active:scale-90"
          >
            ✕
          </button>
        )}
      </div>

      {!value && (
        <div dir="rtl" className="mt-2 flex flex-wrap items-center justify-center gap-2 font-urdu text-xs text-ink-light">
          <span>مثلاً:</span>
          {EXAMPLES.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => onChange(e)}
              className="cursor-pointer rounded-full bg-primary/10 px-3 py-1 text-primary active:scale-95"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}