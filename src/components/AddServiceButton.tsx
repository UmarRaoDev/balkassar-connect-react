import { useState } from "react";
import AddWorkerForm from "./AddWorkerForm";
import { WhatsAppIcon } from "./Icons";

const WHATSAPP = "923140978485"; // your number in international format

export default function AddServiceButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
            <div dir="rtl" className="mb-4 mt-3 flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="cursor-pointer rounded-full bg-accent px-4 py-2 font-urdu text-sm font-bold text-white shadow-soft active:scale-95"
        >
          ➕ اپنی سروس شامل کریں
        </button>
               <a
          href={`https://wa.me/${WHATSAPP}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-whatsapp px-4 py-2 font-urdu text-sm font-bold text-white shadow-soft active:scale-95"
        >
          <WhatsAppIcon />
          واٹس ایپ پر ہم سے رابطہ کریں
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