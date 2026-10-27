import { useState } from "react";
import AddWorkerForm from "./AddWorkerForm";
import { WhatsAppIcon } from "./Icons";

const WHATSAPP = "923140978485"; // your number in international format

export default function AddServiceButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div dir="rtl" className="mx-auto mb-4 mt-3 flex w-full max-w-[280px] flex-col gap-2">
        {/* Add service button */}
        <button
          onClick={() => setOpen(true)}
          className="flex w-full cursor-pointer items-center justify-between rounded-xl border-b-[3px] border-black/20 bg-accent px-3 py-1.5 font-urdu text-sm font-bold leading-relaxed text-white shadow-soft transition active:translate-y-0.5 active:border-b-2"
        >
          <span className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-white text-base font-bold text-accent">
              +
            </span>
            اپنی سروس شامل کریں
          </span>
          <span className="text-xl leading-none">‹</span>
        </button>

        {/* WhatsApp button */}
        <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl border-b-[3px] border-black/20 bg-whatsapp px-3 py-1.5 font-urdu text-sm font-bold leading-relaxed text-white shadow-soft transition active:translate-y-0.5 active:border-b-2"
        >
          <WhatsAppIcon />
          ہمارا واٹس ایپ رابطہ
        </a>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-gray-100 text-lg text-gray-600"
            >
              ✕
            </button>
            <AddWorkerForm />
          </div>
        </div>
      )}
    </>
  );
}