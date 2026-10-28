import { WhatsAppIcon, CallIcon } from "./Icons";

export default function WorkerCard({ worker, showType, index, categoryShowsSubtype }) {
  const showSubtype = categoryShowsSubtype && worker.subtype;
  const work = showType ? worker.type : showSubtype ? worker.subtype : "";

  return (
    <div
      dir="rtl"
      className="animate-slide-up flex items-center gap-2.5 rounded-2xl border-r-4 border-primary bg-white p-3 shadow-soft transition duration-300 active:scale-[0.98] sm:p-4"
      style={{ animationDelay: `${Math.min(index, 4) * 50}ms` }}
    >
      {/* Info */}
      <div className="min-w-0 flex-1">
        {work && (
          <h3 className="font-urdu text-lg leading-snug font-bold text-primary sm:text-xl">
            {work}
          </h3>
        )}

        <p className="font-poppins text-sm font-semibold text-gray-900 sm:text-base">
          {worker.name}
        </p>

        {worker.location && (
          <p className="mt-1 flex items-start gap-1.5 font-urdu text-[0.85rem] leading-relaxed font-medium text-gray-600">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="mt-1.5 size-3 shrink-0 opacity-70"
              aria-hidden="true"
            >
              <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
            </svg>
            <span>{worker.location}</span>
          </p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex shrink-0 gap-1.5">
        <a
          href={`https://wa.me/${String(worker.phone).replace(/\+/g, "")}`}
          className="flex items-center justify-center gap-1 rounded-full bg-whatsapp px-2.5 py-1 font-urdu text-xs font-semibold text-white transition active:scale-95 [&_svg]:size-3.5"
        >
          <WhatsAppIcon />
          واٹس ایپ
        </a>
        <a
          href={`tel:${worker.phone}`}
          className="flex items-center justify-center gap-1 rounded-full bg-accent px-2.5 py-1 font-urdu text-xs font-semibold text-white transition active:scale-95 [&_svg]:size-3.5"
        >
          <CallIcon />
          کال
        </a>
      </div>
    </div>
  );
}