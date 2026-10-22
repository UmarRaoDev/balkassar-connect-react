// Search helpers for the home page search bar.
// Extra Roman Urdu / English words per category id, so "doodh", "milk" and "دودھ" all find the same people.
// To add more words later, just edit this list - no database change needed.
const KEYWORDS: Record<string, string> = {
  "food-delivery": "restaurant resturant food delivery khana khaana burger pizza hotel",
  "tent-service": "tent shamiana shamyana tent house deg chairs kursi shadi",
  shops: "dukan dukaan shop store bachat mall kiryana general store",
  milk: "doodh dood milk dairy dahi lassi gwala",
  mechanic: "motor winding rewinding machine aalat repair",
  driver: "driver car booking gaari gari taxi cab",
  "rickshaw-service": "rickshaw riksha loader sawari load loading",
  "whatsapp-group": "whatsapp group news khabar",
  medical: "medical doctor dr clinic lab laboratory hospital dawai dawa pharmacy test",
  electrician: "electrician bijli wiring light",
  plumber: "plumber nalka pipe pani tanki",
  carpenter: "carpenter wood woodwork lakri lakdi furniture darwaza",
  painter: "painter paint rang colour color",
  labour: "mistri mason labour labor construction tameer imarat",
  "Auto-repair": "mechanic auto car bike motorcycle repair gaari workshop",
  "mobile-repair": "mobile phone repair screen cellphone",
  "multi-service": "multi service multiple kaam handyman",
  "other-services": "other services",
};

// Lowercase, remove Urdu marks (zer/zabar) and unify look-alike letters, so spelling differences still match.
export function normalize(text: any): string {
  return String(text ?? "")
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u200c\u200d]/g, "")
    .replace(/\u064A/g, "\u06CC") // ي -> ی
    .replace(/\u0643/g, "\u06A9") // ك -> ک
    .replace(/[\u06C2\u06C3]/g, "\u06C1") // ۂ ۃ -> ہ
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// A worker matches when EVERY word typed is found somewhere in the worker's details.
export function matchesWorker(worker: any, query: string, cats: any[]): boolean {
  const words = normalize(query).split(" ").filter(Boolean);
  if (words.length === 0) return true;

  const cat = cats.find((c) => c.id === worker.category);
  const haystack = normalize(
    [
      worker.name,
      worker.type,
      worker.subtype,
      worker.location,
      cat?.label,
      KEYWORDS[worker.category],
    ].join(" ")
  );

  return words.every((w) => haystack.includes(w));
}