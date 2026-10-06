import { useState } from "react";
import { MousePointerClick, Palette, Type, Smartphone, ArrowRight, X } from "lucide-react";

const KEY = "intr_le_intro_seen";
export const introSeen = () => localStorage.getItem(KEY) === "1";
export const markIntroSeen = () => localStorage.setItem(KEY, "1");

const STEPS = [
  {
    icon: <MousePointerClick size={18} />,
    title: "1 · Pick what you want to change",
    body: "While “Stop editing” is showing (edit mode is on), move your mouse over the page — each part lights up with a label. Click it to open the editor panel. Use “Bigger area” to pick the whole card or section, or “Smaller part” to go deeper. Use “Hide” to remove something from the page and “Unhide” to bring it back.",
  },
  {
    icon: <Palette size={18} />,
    title: "2 · Change the colour",
    body: "Open the Colours tab. “Background colour” paints the selected section, “Text colour” recolours its words, and the six gradient tiles apply a ready-made brand gradient. Click a swatch, type a hex code, or use the colour wheel. The × next to a field clears it.",
  },
  {
    icon: <Type size={18} />,
    title: "3 · Edit text, size & images",
    body: "The Text tab shows every piece of wording in what you clicked — small labels, headings and paragraphs — each in its own box. Type to change it. The Image tab replaces a photo. Changes preview in your browser first; click Save to publish them for visitors.",
  },
  {
    icon: <Smartphone size={18} />,
    title: "4 · Check phone & tablet",
    body: "Use the phone/tablet buttons in the toolbar to preview the real mobile layout. Switch the panel’s “Applies to” from All screens to Phone to change a size or colour on mobile only. Undo, the edits list and “Reset page” are always in the toolbar.",
  },
];

export default function EditorIntro({ onDone }) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  return (
    <div data-le-ui data-testid="editor-intro" className="fixed inset-0 z-[10070] flex items-center justify-center bg-midnight/55 px-5">
      <div className="w-full max-w-[460px] rounded-xl bg-white shadow-2xl p-7 relative">
        <button onClick={onDone} className="absolute top-3 right-3 p-1 text-slatesage hover:text-midnight" data-testid="editor-intro-close"><X size={17} /></button>
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-navy text-white mb-4">{step.icon}</div>
        <h3 className="font-serif text-midnight text-[22px] font-semibold leading-snug" data-testid="editor-intro-title">{step.title}</h3>
        <p className="text-slatesage text-[14px] leading-relaxed mt-3">{step.body}</p>
        <div className="flex items-center justify-between mt-7">
          <div className="flex gap-1.5">
            {STEPS.map((_, n) => (
              <span key={n} className={`w-6 h-1 rounded-full ${n === i ? "bg-navy" : "bg-powder"}`} />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {i > 0 && <button onClick={() => setI(i - 1)} className="text-[13px] text-slatesage hover:text-midnight" data-testid="editor-intro-back">Back</button>}
            <button onClick={() => (last ? onDone() : setI(i + 1))} data-testid="editor-intro-next"
              className="inline-flex items-center gap-2 bg-navy text-white text-[13px] font-semibold px-4 py-2 rounded hover:brightness-110">
              {last ? "Start editing" : "Next"} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
