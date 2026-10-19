import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import Login from "../admin/Login";
import Panel from "../admin/Panel";

export default function Admin() {
  const [user, setUser] = useState(undefined); // undefined = still checking

  useEffect(() => {
    document.body.style.background = "#f0f2f5";
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => {
      document.body.style.background = "";
      unsubscribe();
    };
  }, []);

  if (user === undefined) {
    return <p className="p-8 text-center text-[#888]">لوڈ ہو رہا ہے...</p>;
  }
  return user ? <Panel /> : <Login />;
}
