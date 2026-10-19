import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const input =
  "mb-4 w-full rounded-lg border-2 border-[#e0e0e0] px-4 py-3 text-left text-base focus:border-[#4caf50] focus:outline-none";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      console.error(err);
      setError(true);
    }
    setBusy(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1a1a2e] p-4 [font-family:'Segoe_UI',sans-serif]">
      <form onSubmit={submit} dir="rtl" className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
        <h2 className="mb-2 text-2xl font-bold text-[#1a1a2e]">🔐 Admin Panel</h2>
        <p className="mb-6 text-sm text-[#666]">Balkassar Connect</p>
        <input type="email" dir="ltr" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        <input type="password" dir="ltr" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={input} />
        <button disabled={busy} className="w-full cursor-pointer rounded-lg bg-[#4caf50] py-3.5 font-semibold text-white hover:bg-[#43a047] disabled:bg-[#aaa]">
          {busy ? "..." : "داخل ہوں"}
        </button>
        {error && <p className="mt-3 text-sm text-red-600">ای میل یا پاس ورڈ غلط ہے</p>}
      </form>
    </div>
  );
}
