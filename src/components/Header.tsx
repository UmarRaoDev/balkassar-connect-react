export default function Header() {
  return (
    <header className="relative mb-8 overflow-hidden bg-linear-to-br from-primary to-primary-dark px-3 pt-4 pb-6 text-white shadow-soft sm:px-4 sm:pt-6 sm:pb-8 md:pt-8 md:pb-10">
      <div className="pointer-events-none absolute -top-1/2 -right-[20%] size-52 rounded-full bg-white/5" />
      <div className="relative mx-auto max-w-[1200px] sm:px-2">
        <h1 className="font-poppins text-xl font-extrabold whitespace-nowrap sm:text-2xl md:text-3xl">
          🏘️ Balkassar Connect
        </h1>
        <p className="font-urdu text-right text-sm whitespace-nowrap opacity-90 sm:text-base md:text-xl">
          بلکسر کی تمام سروسز ایک جگہ
        </p>
      </div>
    </header>
  );
}
