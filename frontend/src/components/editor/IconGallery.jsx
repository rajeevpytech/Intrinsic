import { useState } from "react";
import { Search } from "lucide-react";
import { ICON_GROUPS } from "../../lib/iconLibrary";

const label = (name) => name.replace(/([a-z])([A-Z0-9])/g, "$1 $2");

export default function IconGallery({ current, onPick }) {
  const [q, setQ] = useState("");
  const term = q.trim().toLowerCase();
  const groups = ICON_GROUPS.map((g) => ({ ...g, icons: g.icons.filter(([n]) => !term || label(n).toLowerCase().includes(term) || g.group.toLowerCase().includes(term)) }))
    .filter((g) => g.icons.length);
  return (
    <div data-testid="icon-gallery">
      <div className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded px-2 mb-2">
        <Search size={12} className="text-white/50" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search icons (e.g. cloud, lock, people)" data-testid="icon-gallery-search"
          className="flex-1 bg-transparent py-1.5 text-[12px] text-white placeholder:text-white/35 focus:outline-none" />
      </div>
      <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2">
        {groups.map(({ group, icons }) => (
          <div key={group}>
            <div className="text-[10px] text-white/45 mb-1">{group}</div>
            <div className="grid grid-cols-7 gap-1">
              {icons.map(([name, Icon]) => (
                <button key={name} onClick={() => onPick(name)} title={label(name)} data-testid={`icon-pick-${name}`}
                  className={`h-8 flex items-center justify-center rounded transition-colors ${current === name ? "bg-[#faaf6a] text-midnight" : "bg-white/5 hover:bg-white/20 text-white"}`}>
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>
        ))}
        {!groups.length && <div className="text-[11px] text-white/40" data-testid="icon-gallery-empty">No icons match “{q}”.</div>}
      </div>
    </div>
  );
}
