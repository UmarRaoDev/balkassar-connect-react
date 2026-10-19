import { WhatsAppIcon, CallIcon } from "./Icons";

const btn =
  "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/15 px-3 py-3 text-[0.8rem] font-semibold text-white backdrop-blur-md transition active:scale-95 active:bg-white/25 sm:text-sm";

export default function CreatorCard() {
  return (
    <div className="relative mx-auto mt-6 mb-8 max-w-lg overflow-hidden rounded-[20px] bg-linear-to-br from-primary to-primary-dark p-4 shadow-[0_8px_24px_rgba(45,90,61,0.25)] sm:p-6">
      <div className="pointer-events-none absolute -top-1/2 -right-[20%] size-52 rounded-full bg-white/10" />

      <div className="relative mb-4 flex items-center gap-4">
        <img
          src="/new.png"
          alt="Rao Umar Farooq"
          className="size-[60px] rounded-full border-[3px] border-white/30 object-cover shadow-[0_4px_12px_rgba(0,0,0,0.2)] sm:size-20"
        />
        <div className="flex-1">
          <div className="mb-0.5 font-poppins text-base font-bold text-white sm:text-xl">
            Rao Umar Farooq
          </div>
          <span className="inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
            Developer
          </span>
        </div>
      </div>

      <p dir="rtl" className="relative mb-4 text-right font-urdu text-[0.85rem] leading-[1.9] text-white/95 sm:text-base">
        اس پلیٹ فارم پر اپنا نمبر درج کروانے کے لیے رابطہ کریں۔
      </p>

      <div className="relative flex gap-3">
        <a href="https://wa.me/923140978485" className={btn}>
          <WhatsAppIcon />
          WhatsApp
        </a>
        <a href="tel:+923140978485" className={btn}>
          <CallIcon />
          Call
        </a>
      </div>
    </div>
  );
}
