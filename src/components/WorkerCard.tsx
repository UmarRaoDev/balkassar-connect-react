import { subtypeCategories } from "../data";
import { WhatsAppIcon, CallIcon } from "./Icons";

export default function WorkerCard({ worker, showType, index }) {
  const showSubtype = subtypeCategories.includes(worker.category) && worker.subtype;
  const badge = showType ? worker.type : showSubtype ? worker.subtype : "";

  return (
    <div
      className="animate-slide-up rounded-2xl bg-white p-3 shadow-soft transition duration-300 active:scale-[0.98] sm:p-5"
      style={{ animationDelay: `${Math.min(index, 4) * 50}ms` }}
    >
      <div className="mb-4">
        <div className="mb-1.5 flex flex-wrap items-center gap-2 font-poppins text-[0.95rem] font-bold sm:text-lg">
          <span>{worker.name}</span>
          {badge && (
            <span
              dir="rtl"
              className="inline-block rounded-md bg-primary px-2.5 py-1 font-urdu text-xs font-semibold text-white"
            >
              {badge}
            </span>
          )}
        </div>
        <div dir="rtl" className="text-right font-urdu text-[0.95rem] leading-[1.8] font-medium text-ink-light">
          {worker.location}
        </div>
      </div>

      <div className="flex gap-3">
        <a
          href={`https://wa.me/${String(worker.phone).replace(/\+/g, "")}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-whatsapp px-3 py-2.5 text-[0.8rem] font-semibold text-white shadow-[0_2px_8px_rgba(37,211,102,0.3)] transition active:scale-95 sm:px-4 sm:py-3.5 sm:text-sm"
        >
          <WhatsAppIcon />
          WhatsApp
        </a>
        <a
          href={`tel:${worker.phone}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-3 py-2.5 text-[0.8rem] font-semibold text-white shadow-[0_2px_8px_rgba(230,126,34,0.3)] transition active:scale-95 sm:px-4 sm:py-3.5 sm:text-sm"
        >
          <CallIcon />
          Call
        </a>
      </div>
    </div>
  );
}
