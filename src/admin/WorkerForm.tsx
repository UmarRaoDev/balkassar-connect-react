const input =
  "rounded-lg border-2 border-[#e0e0e0] px-3.5 py-2.5 text-[0.95rem] transition-colors focus:border-[#4caf50] focus:outline-none";

function Field({ label, full, children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <label className="text-[0.85rem] font-semibold text-[#555]">{label}</label>
      {children}
    </div>
  );
}

export default function WorkerForm({ values, onChange, categories }) {
  const set = (key) => (e) => onChange(key, e.target.value);
  const options = categories.filter((c) => c.id !== "whatsapp-group");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="نام">
        <input className={input} value={values.name} onChange={set("name")} placeholder="مثال: Rana Ahmed" />
      </Field>
      <Field label="فون نمبر">
        <input className={`${input} text-left`} dir="ltr" type="tel" value={values.phone} onChange={set("phone")} placeholder="+923001234567" />
      </Field>
      <Field label="کیٹیگری">
        <select className={input} value={values.category} onChange={set("category")}>
          <option value="">-- کیٹیگری منتخب کریں --</option>
          {options.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="مقام">
        <input className={input} value={values.location} onChange={set("location")} placeholder="مثال: بلکسر چوک" />
      </Field>
      <Field label="سروس کا نام (type)" full>
        <input className={input} value={values.type} onChange={set("type")} placeholder="مثال: پلمبر / الیکٹریشن + پلمبر" />
      </Field>
      <Field label="سروس کا مختصر نام (subtype)" full>
        <input className={input} value={values.subtype} onChange={set("subtype")} placeholder="مثال: پلمبر" />
      </Field>
    </div>
  );
}
