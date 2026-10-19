export default function GroupCard({ group }) {
  return (
    <div className="rounded-2xl border-2 border-[#1da851] bg-white p-4 font-urdu shadow-[0_6px_20px_rgba(0,0,0,0.06)]">
      <div className="mb-2.5 border-l-[5px] border-whatsapp pl-2.5 text-[19px] font-bold text-[#111]">
        {group.groupName}
      </div>
      <div className="mb-2.5 inline-block rounded-lg bg-[#e9f9ef] px-2.5 py-1.5 text-[15px] font-medium text-[#14532d]">
        Admin: {group.adminName}
      </div>
      <div className="mb-3.5 text-[15px] leading-relaxed text-[#444]">{group.description}</div>
      <a
        href={group.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-[10px] bg-[#128c7e] p-3 text-center text-sm font-semibold text-white no-underline hover:bg-[#0f6e5f]"
      >
        گروپ میں شامل ہونے کے لیے یہاں کلک کریں
      </a>
    </div>
  );
}
