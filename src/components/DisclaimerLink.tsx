
import { useState } from "react";

export default function DisclaimerLink() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mt-10 mb-6 text-center">
        <button
          onClick={() => setOpen(true)}
          className="font-urdu text-sm text-gray-500 underline underline-offset-4"
        >
          اہم بات (Disclaimer)
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            dir="rtl"
            className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 text-right font-urdu shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="mb-2 text-lg font-bold text-gray-900">
              اہم بات
            </h4>

           

            <ul className="list-disc space-y-2 pr-5 text-sm leading-loose text-gray-700">
              <li>
                رابطہ نمبرز اور معلومات متعلقہ افراد کی جانب سے فراہم
                کی جاتی ہیں۔
              </li>

              <li>
                کام، ریٹس اور سروس کی تفصیلات براہِ راست سروس فراہم
                کرنے والے سے طے کریں۔
              </li>

              <li>
                <strong className="font-semibold text-gray-900">
                  ادائیگی میں احتیاط:
                </strong>{" "}
                کسی کو بھی پیشگی رقم بھیجنے سے گریز کریں اور ادائیگی
                سے پہلے اچھی طرح تسلی کر لیں۔
              </li>

              <li>
                <strong className="font-semibold text-gray-900">
                  ہماری ذمہ داری:
                </strong>{" "}
                بلکسر کنیکٹ صرف رابطے فراہم کرتا ہے۔ سروس کے معیار،
                کام یا پیسوں کے لین دین سے متعلق معاملات کی ذمہ داری
                بلکسر کنیکٹ پر نہیں ہوگی۔
              </li>
            </ul>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white active:scale-95"
            >
              ٹھیک ہے
            </button>
          </div>
        </div>
      )}
    </>
  );
}
