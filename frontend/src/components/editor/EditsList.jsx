import { X, Trash2, Crosshair, Globe2, Eye } from "lucide-react";
import { splitKey } from "../../lib/liveedit";

const SCOPE_BADGE = { phone: "Phone", tablet: "Tablet" };
const FRIENDLY = { text: "wording", textParts: "wording", iconSrc: "icon image", iconSize: "icon size", iconName: "icon", iconStroke: "icon", hidden: "hidden", color: "text colour", backgroundColor: "background", backgroundImage: "background image", fontSize: "text size", fontWeight: "boldness", src: "image", href: "link" };

export default function EditsList({ edits, onJump, onDelete, onUnhide, onResetAll, onClose }) {
  return (
    <div data-le-ui data-testid="edits-list-panel"
      className="fixed left-4 bottom-24 z-[10050] w-[320px] max-h-[calc(100vh-180px)] overflow-y-auto rounded-xl bg-[#12121f] border border-white/12 shadow-2xl text-white p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-[#faaf6a] font-semibold">Edits on this page</div>
          <div className="text-[13px] font-medium">{edits.length} element{edits.length === 1 ? "" : "s"} changed</div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white" data-testid="edits-list-close"><X size={16} /></button>
      </div>

      {edits.length === 0 && <div className="text-[12px] text-white/40">No edits yet on this page. Click any text, button, image or section to start.</div>}

      <div className="space-y-1.5">
        {edits.map((e) => {
          const { selector, scope } = splitKey(e.selector);
          return (
          <div key={e.selector} className="flex items-start gap-2 bg-white/5 rounded px-2 py-1.5" data-testid={`edits-list-item`}>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] leading-snug break-words">
                {e.label || selector}
                {SCOPE_BADGE[scope] && <span className="ml-1.5 text-[9px] uppercase tracking-wide bg-[#faaf6a] text-midnight px-1.5 py-0.5 rounded">{SCOPE_BADGE[scope]}</span>}
                {e.props?.hidden && <span className="ml-1.5 text-[9px] uppercase tracking-wide bg-red-500 text-white px-1.5 py-0.5 rounded">Hidden</span>}
              </div>
              <div className="text-[10px] text-white/40 mt-0.5">{Object.keys(e.props || {}).map((k) => FRIENDLY[k] || k).join(", ")}</div>
            </div>
            {e.props?.hidden && <button onClick={() => onUnhide(e)} title="Unhide" className="p-1 text-red-300 hover:text-white" data-testid="edits-list-unhide"><Eye size={13} /></button>}
            <button onClick={() => onJump(selector)} title="Show on page" className="p-1 text-white/55 hover:text-white" data-testid="edits-list-jump"><Crosshair size={13} /></button>
            <button onClick={() => onDelete(e.selector)} title="Undo this edit" className="p-1 text-white/55 hover:text-red-300" data-testid="edits-list-delete"><Trash2 size={13} /></button>
          </div>
          );
        })}
      </div>

      <button onClick={onResetAll} data-testid="edits-reset-all"
        className="mt-4 w-full flex items-center justify-center gap-2 text-[11px] font-semibold py-2 rounded bg-white/10 hover:bg-red-500/25 text-white/80">
        <Globe2 size={12} /> Reset every edit on the whole site
      </button>
    </div>
  );
}
