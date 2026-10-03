import { useEffect, useRef, useState } from "react";
import { X, RotateCcw, ArrowUp, ArrowDown, Upload, Eye, EyeOff, Type, Palette, Image as ImageIcon, Square, Copy, Trash2, MoveVertical } from "lucide-react";
import { api, imgUrl } from "../../lib/api";
import IconGallery from "./IconGallery";
import { SWATCHES, GRADIENTS, FONTS, SHADOWS, SCOPES, canEditText, textNodesOf } from "../../lib/liveedit";

const PART_NAMES = { h1: "Main heading", h2: "Heading", h3: "Heading", h4: "Heading", a: "Link", button: "Button", li: "List item", label: "Label" };
const partName = (node) => {
  const p = node.parentElement;
  if (p?.closest(".eyebrow, [class*='eyebrow']")) return "Small label above heading";
  const tag = p?.closest("h1,h2,h3,h4,a,button,li,label")?.tagName.toLowerCase();
  return PART_NAMES[tag] || "Text";
};
const area = "w-full bg-white/10 border border-white/15 rounded px-2 py-1.5 text-[12px] text-white focus:outline-none focus:border-white/40";

const TextFields = ({ el, props, scope, onChange }) => {
  if (scope !== "all") return <div className="text-[11px] text-white/40 mb-3">Switch “Applies to” back to All screens to change the wording.</div>;
  if (canEditText(el) && (el.textContent.trim() || props.text !== undefined)) {
    return (
      <Row label="Words on the page" testid="editor-text-row">
        <textarea value={props.text !== undefined ? props.text : el.textContent} onChange={(e) => onChange({ text: e.target.value })} rows={3} className={area} data-testid="editor-text-input" />
      </Row>
    );
  }
  const nodes = textNodesOf(el);
  if (!nodes.length) return <div className="text-[11px] text-white/40 mb-3" data-testid="editor-no-text">There are no words here. Click “Bigger area” or pick another spot to change wording.</div>;
  const current = Array.isArray(props.textParts) && props.textParts.length === nodes.length ? props.textParts : nodes.map((n) => n.nodeValue.trim().replace(/\u200B/g, ""));
  return (
    <Row label={nodes.length > 1 ? `Words on the page (${nodes.length} pieces)` : "Words on the page"} testid="editor-text-row">
      <div className="space-y-2">
        {nodes.map((n, i) => (
          <div key={i}>
            <div className="text-[10px] text-white/45 mb-0.5">{partName(n)}</div>
            <textarea value={current[i]} rows={current[i].length > 60 ? 3 : 1} className={area} data-testid={i === 0 ? "editor-text-input" : `editor-text-input-${i}`}
              onChange={(e) => onChange({ textParts: current.map((v, j) => (j === i ? e.target.value : v)) })} />
          </div>
        ))}
      </div>
    </Row>
  );
};

const Row = ({ label, children, testid }) => (
  <div className="mb-3" data-testid={testid}>
    <div className="text-[10px] uppercase tracking-[0.12em] text-white/45 mb-1.5 font-medium">{label}</div>
    {children}
  </div>
);

const Group = ({ icon, title, children }) => (
  <div className="border-t border-white/10 pt-3 mt-3 first:border-0 first:mt-0 first:pt-0">
    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-white/80 mb-2.5">{icon}{title}</div>
    {children}
  </div>
);

const ColorField = ({ value, onChange, onClear, testid }) => (
  <div data-testid={testid}>
    <div className="flex items-center gap-2">
      <input type="color" value={/^#[0-9a-f]{6}$/i.test(value || "") ? value : "#ffffff"} onInput={(e) => onChange(e.currentTarget.value)} onChange={(e) => onChange(e.target.value)}
        className="w-9 h-8 rounded bg-transparent border border-white/20 cursor-pointer p-0.5" data-testid={`${testid}-picker`} />
      <input type="text" value={value || ""} placeholder="inherit / #rrggbb" onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 bg-white/10 border border-white/15 rounded px-2 py-1.5 text-[12px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/40" data-testid={`${testid}-hex`} />
      <button onClick={onClear} title="Clear" className="text-white/50 hover:text-white p-1" data-testid={`${testid}-clear`}><X size={13} /></button>
    </div>
    <div className="flex flex-wrap gap-1 mt-1.5">
      {SWATCHES.map((c) => (
        <button key={c} onClick={() => onChange(c)} title={c} style={{ background: c }}
          className="w-[18px] h-[18px] rounded-sm border border-white/25 hover:scale-110 transition-transform" data-testid={`${testid}-sw-${c.replace("#", "")}`} />
      ))}
    </div>
  </div>
);

const Slider = ({ value, onChange, min, max, step = 1, unit = "px", fallback, testid }) => (
  <div className="flex items-center gap-2">
    <input data-testid={testid && `${testid}-slider`} aria-label={testid} type="range" min={min} max={max} step={step} value={value === undefined || value === "" ? fallback : value}
      onChange={(e) => onChange(e.target.value)} className="flex-1 accent-[#faaf6a]" />
    <input data-testid={testid && `${testid}-input`} aria-label={testid} type="number" min={min} max={max} step={step} value={value ?? ""} placeholder={String(Math.round(fallback))} onChange={(e) => onChange(e.target.value)}
      className="w-[62px] bg-white/10 border border-white/15 rounded px-2 py-1 text-[12px] text-white focus:outline-none focus:border-white/40" />
    <span className="text-[10px] text-white/40">{unit}</span>
  </div>
);

const Select = ({ value, onChange, options, testid }) => (
  <select value={value || ""} onChange={(e) => onChange(e.target.value)} data-testid={testid}
    className="w-full bg-white/10 border border-white/15 rounded px-2 py-1.5 text-[12px] text-white focus:outline-none focus:border-white/40">
    {options.map((o) => <option key={o.value} value={o.value} className="text-midnight">{o.label}</option>)}
  </select>
);

export default function EditorPanel({ el, selector, label, props, scope = "all", onScope, side = "right", onChange, onSave, saving, unsaved, saveMessage, onReset, onClose, onParent, onChild, onDuplicate, onMoveBlock, onRemoveBlock }) {
  const [tab, setTab] = useState("text");
  const [more, setMore] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const computed = el ? window.getComputedStyle(el) : null;
  const isImg = el?.tagName === "IMG";
  const isIcon = el?.tagName?.toLowerCase() === "svg";

  useEffect(() => { setTab(isImg || (isIcon && !textNodesOf(el).length) ? "image" : "text"); }, [selector, isImg, isIcon, el]);

  const set = (k) => (v) => onChange({ [k]: v === "" ? null : v });

  const upload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = imgUrl(data.path);
      if (isImg) onChange({ src: url });
      else if (isIcon) onChange({ iconSrc: url, iconName: null });
      else onChange({ backgroundImage: `url("${url}")` });
    } catch (e) {
      alert("Upload failed. Try a smaller image.");
    } finally {
      setUploading(false);
    }
  };

  const TABS = [
    { id: "text", label: "Text", icon: <Type size={13} /> },
    { id: "colors", label: "Colours", icon: <Palette size={13} /> },
    { id: "box", label: "Box", icon: <Square size={13} /> },
    { id: "image", label: isIcon ? "Icon" : "Image", icon: <ImageIcon size={13} /> },
    { id: "section", label: "Section", icon: <Copy size={13} /> },
  ];
  const blockId = el?.closest?.("le-block[data-le-block]")?.dataset?.leBlock || "";
  const sectionEl = el?.closest?.("section") || el;

  return (
    <div data-le-ui data-testid="editor-panel"
      className={`fixed ${side === "left" ? "left-3" : "right-3"} top-20 z-[10050] w-[330px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-230px)] overflow-y-auto rounded-xl bg-[#12121f] border border-white/12 shadow-2xl text-white p-4`}>
      <div className="flex items-start gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.14em] text-[#faaf6a] font-semibold">Editing</div>
          <div className="text-[13px] font-medium leading-snug break-words" data-testid="editor-selected-label">{label || "Element"}</div>
          <div className="text-[10px] text-white/35 mt-0.5 truncate">{el?.tagName?.toLowerCase()}{el?.className && typeof el.className === "string" ? `.${el.className.split(" ").slice(0, 2).join(".")}` : ""}</div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white" data-testid="editor-close"><X size={16} /></button>
      </div>

      <div className="flex items-center gap-1.5 mb-3">
        <button onClick={onParent} title="Select the larger area around this (e.g. the whole card or section)" className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white/10 hover:bg-white/20" data-testid="editor-select-parent"><ArrowUp size={11} /> Bigger area</button>
        <button onClick={onChild} title="Select a smaller piece inside this" className="flex items-center gap-1 text-[11px] px-2 py-1 rounded bg-white/10 hover:bg-white/20" data-testid="editor-select-child"><ArrowDown size={11} /> Smaller part</button>
        <button onClick={() => onChange({ hidden: props.hidden ? null : true })} data-testid="editor-toggle-hidden"
          title={props.hidden ? "Show this again to visitors" : "Hide this from visitors"}
          className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded ml-auto ${props.hidden ? "bg-red-500 text-white hover:bg-red-400" : "bg-white/10 hover:bg-white/20"}`}>
          {props.hidden ? <><Eye size={11} /> Unhide</> : <><EyeOff size={11} /> Hide</>}
        </button>
      </div>
      {props.hidden && (
        <div className="mb-3 rounded bg-red-500/15 border border-red-400/30 text-[11px] text-red-100 px-2.5 py-2" data-testid="editor-hidden-note">
          Hidden from visitors. While editing it stays faded with a red dashed outline so you can find it and click <b>Unhide</b>. Press <b>Save</b> to publish.
        </div>
      )}

      <div className="mb-3">
        <div className="text-[10px] uppercase tracking-[0.12em] text-white/45 mb-1.5 font-medium">Applies to</div>
        <div className="flex gap-1">
          {SCOPES.map((s) => (
            <button key={s.id} onClick={() => onScope?.(s.id)} data-testid={`editor-scope-${s.id}`}
              className={`flex-1 text-[11px] py-1.5 rounded ${scope === s.id ? "bg-white text-midnight" : "bg-white/10 hover:bg-white/20"}`}>{s.label}</button>
          ))}
        </div>
        {scope !== "all" && <div className="text-[10px] text-[#faaf6a] mt-1.5">Styling only — applies to {scope === "phone" ? "screens under 768px" : "screens under 1024px"}. Wording and images are shared across all screens.</div>}
      </div>

      <div className="grid grid-cols-5 gap-1 mb-3 bg-white/5 p-1 rounded-lg">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} data-testid={`editor-tab-${t.id}`}
            className={`flex flex-col items-center gap-0.5 py-1.5 rounded text-[10px] font-medium transition-colors ${tab === t.id ? "bg-white text-midnight" : "text-white/60 hover:text-white"}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {tab === "text" && (
        <Group icon={<Type size={13} />} title="Words & text style">
          <TextFields el={el} props={props} scope={scope} onChange={onChange} />
          <Row label="Quick styles">
            <div className="flex gap-1">
              <button onClick={() => onChange({ fontWeight: props.fontWeight === "700" ? null : "700" })} data-testid="editor-bold"
                className={`flex-1 text-[12px] font-bold py-1.5 rounded ${props.fontWeight === "700" ? "bg-white text-midnight" : "bg-white/10 hover:bg-white/20"}`}>B</button>
              <button onClick={() => onChange({ fontStyle: props.fontStyle === "italic" ? null : "italic" })} data-testid="editor-italic"
                className={`flex-1 text-[12px] italic py-1.5 rounded ${props.fontStyle === "italic" ? "bg-white text-midnight" : "bg-white/10 hover:bg-white/20"}`}>I</button>
              <button onClick={() => onChange({ textDecoration: props.textDecoration === "underline" ? null : "underline" })} data-testid="editor-underline"
                className={`flex-1 text-[12px] underline py-1.5 rounded ${props.textDecoration === "underline" ? "bg-white text-midnight" : "bg-white/10 hover:bg-white/20"}`}>U</button>
            </div>
          </Row>
          {el?.tagName === "A" && scope === "all" && (
            <Row label="Link destination" testid="editor-link-row">
              <input type="text" placeholder="/about or https://…" defaultValue={props.href || el.getAttribute("href") || ""} data-testid="editor-link-input"
                onBlur={(e) => onChange({ href: e.target.value.trim() || null })}
                className="w-full bg-white/10 border border-white/15 rounded px-2 py-1.5 text-[12px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/40" />
              <button onClick={() => onChange({ target: props.target === "_blank" ? null : "_blank" })} data-testid="editor-link-newtab"
                className={`mt-1.5 text-[11px] px-2 py-1 rounded ${props.target === "_blank" ? "bg-white text-midnight" : "bg-white/10 hover:bg-white/20"}`}>Open in new tab</button>
            </Row>
          )}
          <Row label="Font size" testid="editor-fontsize-row">
            <Slider testid="editor-fontsize" value={props.fontSize} onChange={set("fontSize")} min={8} max={96} fallback={parseFloat(computed?.fontSize || 16)} />
          </Row>
          <Row label="Font weight">
            <Select value={props.fontWeight} onChange={set("fontWeight")} testid="editor-fontweight"
              options={[{ label: "Default", value: "" }, ...[300, 400, 500, 600, 700, 800, 900].map((w) => ({ label: String(w), value: String(w) }))]} />
          </Row>
          <button onClick={() => setMore((v) => !v)} data-testid="editor-more-text-options" className="text-[11px] text-[#faaf6a] hover:underline mb-3">
            {more ? "− Fewer text options" : "+ More text options (font, alignment, spacing)"}
          </button>
          {more && <>
          <Row label="Font family">
            <Select value={props.fontFamily} onChange={set("fontFamily")} options={FONTS} testid="editor-fontfamily" />
          </Row>
          <Row label="Alignment">
            <div className="flex gap-1">
              {["left", "center", "right", "justify"].map((a) => (
                <button key={a} onClick={() => onChange({ textAlign: props.textAlign === a ? null : a })} data-testid={`editor-align-${a}`}
                  className={`flex-1 text-[11px] py-1.5 rounded capitalize ${props.textAlign === a ? "bg-white text-midnight" : "bg-white/10 hover:bg-white/20"}`}>{a}</button>
              ))}
            </div>
          </Row>
          <Row label="Line height">
            <Slider testid="editor-line-height" value={props.lineHeight} onChange={set("lineHeight")} min={0.8} max={3} step={0.05} unit="×" fallback={1.4} />
          </Row>
          <Row label="Letter spacing">
            <Slider testid="editor-letter-spacing" value={props.letterSpacing} onChange={set("letterSpacing")} min={-3} max={12} step={0.1} fallback={0} />
          </Row>
          <Row label="Capitalisation">
            <Select value={props.textTransform} onChange={set("textTransform")} testid="editor-transform"
              options={[{ label: "Default", value: "" }, { label: "UPPERCASE", value: "uppercase" }, { label: "lowercase", value: "lowercase" }, { label: "Capitalize", value: "capitalize" }, { label: "Normal", value: "none" }]} />
          </Row>
          </>}
        </Group>
      )}

      {tab === "colors" && (
        <Group icon={<Palette size={13} />} title="Colours">
          <Row label="Text colour"><ColorField value={props.color} onChange={set("color")} onClear={() => onChange({ color: null })} testid="editor-color" /></Row>
          <Row label="Background colour"><ColorField value={props.backgroundColor} onChange={(value) => onChange({ backgroundColor: value || null, ...(value ? { backgroundImage: null } : {}) })} onClear={() => onChange({ backgroundColor: null })} testid="editor-bg" /></Row>
          <Row label="Border colour"><ColorField value={props.borderColor} onChange={set("borderColor")} onClear={() => onChange({ borderColor: null })} testid="editor-border" /></Row>
          <Row label="Background gradient">
            <div className="grid grid-cols-3 gap-1.5">
              {GRADIENTS.map((g) => (
                <button key={g.label} title={g.label} onClick={() => onChange({ backgroundImage: g.value })} style={{ backgroundImage: g.value }}
                  className="h-8 rounded border border-white/20 hover:scale-105 transition-transform" data-testid={`editor-grad-${g.label.replace(/\s/g, "-").toLowerCase()}`} />
              ))}
            </div>
            <button onClick={() => onChange({ backgroundImage: null })} className="mt-1.5 text-[11px] text-white/50 hover:text-white" data-testid="editor-grad-clear">Remove gradient / image</button>
          </Row>
          <Row label="Hover: background"><ColorField value={props.hoverBackgroundColor} onChange={set("hoverBackgroundColor")} onClear={() => onChange({ hoverBackgroundColor: null })} testid="editor-hoverbg" /></Row>
          <Row label="Hover: text colour"><ColorField value={props.hoverColor} onChange={set("hoverColor")} onClear={() => onChange({ hoverColor: null })} testid="editor-hovercolor" /></Row>
        </Group>
      )}

      {tab === "box" && (
        <Group icon={<Square size={13} />} title="Shape & spacing">
          <Row label="Corner radius"><Slider value={props.borderRadius} onChange={set("borderRadius")} min={0} max={60} fallback={parseFloat(computed?.borderTopLeftRadius || 0)} /></Row>
          <Row label="Inner padding"><Slider value={props.padding} onChange={set("padding")} min={0} max={120} fallback={parseFloat(computed?.paddingTop || 0)} /></Row>
          <Row label="Outer spacing (margin)"><Slider value={props.margin} onChange={set("margin")} min={0} max={120} fallback={parseFloat(computed?.marginTop || 0)} /></Row>
          <Row label="Border thickness"><Slider value={props.borderWidth} onChange={set("borderWidth")} min={0} max={12} fallback={parseFloat(computed?.borderTopWidth || 0)} /></Row>
          <Row label="Transparency"><Slider value={props.opacity} onChange={set("opacity")} min={0.1} max={1} step={0.05} unit="×" fallback={1} /></Row>
          <Row label="Shadow">
            <div className="flex flex-wrap gap-1">
              {SHADOWS.map((s) => (
                <button key={s.label} onClick={() => onChange({ boxShadow: props.boxShadow === s.value ? null : s.value })} data-testid={`editor-shadow-${s.label.replace(/\s/g, "-").toLowerCase()}`}
                  className={`text-[11px] px-2 py-1 rounded ${props.boxShadow === s.value ? "bg-white text-midnight" : "bg-white/10 hover:bg-white/20"}`}>{s.label}</button>
              ))}
            </div>
          </Row>
          <div className="text-[11px] text-white/40">Tip: use “Parent” to select the whole section, then change its background or padding.</div>
        </Group>
      )}

      {tab === "image" && (
        <Group icon={<ImageIcon size={13} />} title={isImg ? "Replace image" : isIcon ? "Icon" : "Background image"}>
          {isIcon && (
            <>
              <Row label="Icon colour"><ColorField value={props.color} onChange={set("color")} onClear={() => onChange({ color: null })} testid="editor-icon-color" /></Row>
              <Row label="Icon size"><Slider testid="editor-icon-size" value={props.iconSize} onChange={set("iconSize")} min={8} max={240} fallback={Math.round(el.getBoundingClientRect().width || 24)} /></Row>
              {props.iconSrc && (
                <Row label="Your replacement image">
                  <img src={props.iconSrc} alt="" className="h-14 w-auto rounded border border-white/15 bg-white/5 p-1" data-testid="editor-icon-preview" />
                  <button onClick={() => onChange({ iconSrc: null })} className="mt-1.5 text-[11px] text-white/60 hover:text-white underline" data-testid="editor-icon-restore">Go back to the original icon</button>
                </Row>
              )}
              <Row label="Choose a different icon" testid="editor-icon-library">
                <IconGallery current={props.iconName} onPick={(name) => onChange({ iconName: name, iconStroke: el.getAttribute("stroke-width") || null, iconSrc: null })} />
                {props.iconName && <button onClick={() => onChange({ iconName: null, iconStroke: null })} className="mt-1.5 text-[11px] text-white/60 hover:text-white underline" data-testid="editor-icon-library-restore">Go back to the original icon</button>}
              </Row>
              <div className="text-[11px] text-white/45 mb-2">Or upload your own picture (PNG or SVG) below to replace this icon.</div>
            </>
          )}
          {isImg && (
            <Row label="Current">
              <img src={props.src || el?.getAttribute("src")} alt="" className="w-full h-24 object-cover rounded border border-white/15" />
            </Row>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files?.[0])} data-testid="editor-image-file" />
          {scope === "all" && (
            <>
              <button onClick={() => fileRef.current?.click()} disabled={uploading} data-testid="editor-image-upload"
                className="w-full flex items-center justify-center gap-2 bg-[#faaf6a] text-midnight text-[12px] font-semibold py-2 rounded hover:brightness-105 disabled:opacity-60">
                <Upload size={13} />{uploading ? "Uploading…" : "Upload from my computer"}
              </button>
              <Row label="Or paste an image URL">
                <input type="text" placeholder="https://…" data-testid="editor-image-url"
                  defaultValue={isImg ? (props.src || "") : isIcon ? (props.iconSrc || "") : (props.backgroundImage || "").replace(/^url\(["']?|["']?\)$/g, "")}
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (!v) return;
                    if (isImg) onChange({ src: v }); else if (isIcon) onChange({ iconSrc: v, iconName: null }); else onChange({ backgroundImage: `url("${v}")` });
                  }}
                  className="w-full mt-1.5 bg-white/10 border border-white/15 rounded px-2 py-1.5 text-[12px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/40" />
              </Row>
            </>
          )}
          {!isImg && !isIcon && <div className="text-[11px] text-white/40">This sets a background image on the selected section.</div>}
          {isImg && (
            <>
              <Row label="Alt text (accessibility / SEO)">
                <input type="text" defaultValue={props.alt !== undefined ? props.alt : (el?.getAttribute("alt") || "")} data-testid="editor-image-alt"
                  onBlur={(e) => onChange({ alt: e.target.value })} disabled={scope !== "all"}
                  className="w-full bg-white/10 border border-white/15 rounded px-2 py-1.5 text-[12px] text-white focus:outline-none focus:border-white/40 disabled:opacity-40" />
              </Row>
              <Row label="Fit">
                <Select value={props.objectFit} onChange={set("objectFit")} testid="editor-image-fit"
                  options={[{ label: "Default", value: "" }, { label: "Cover (fill, crop)", value: "cover" }, { label: "Contain (show all)", value: "contain" }, { label: "Fill (stretch)", value: "fill" }]} />
              </Row>
              <Row label="Max height"><Slider value={props.maxHeight} onChange={set("maxHeight")} min={60} max={900} step={10} fallback={parseFloat(computed?.height || 300)} /></Row>
            </>
          )}
        </Group>
      )}

      {tab === "section" && (
        <Group icon={<Copy size={13} />} title="Duplicate & arrange sections">
          {!blockId && (
            <>
              <div className="text-[11px] text-white/50 mb-2.5">Makes a copy of <b className="text-white/80">{sectionEl === el ? "this element" : "the section around this element"}</b> and drops it in just below. Then click inside the copy to rewrite its text.</div>
              <button onClick={() => onDuplicate?.(sectionEl)} data-testid="editor-duplicate-section"
                className="w-full flex items-center justify-center gap-2 bg-[#faaf6a] text-midnight text-[12px] font-semibold py-2 rounded hover:brightness-105">
                <Copy size={13} /> Duplicate this section
              </button>
            </>
          )}
          {blockId && (
            <>
              <div className="text-[11px] text-white/50 mb-2.5">You’re inside a duplicated section. Move it up or down the page, or delete the copy. The original is untouched.</div>
              <div className="flex gap-1.5">
                <button onClick={() => onMoveBlock?.(blockId, "up")} data-testid="editor-block-up"
                  className="flex-1 flex items-center justify-center gap-1 text-[11px] py-2 rounded bg-white/10 hover:bg-white/20"><ArrowUp size={12} /> Move up</button>
                <button onClick={() => onMoveBlock?.(blockId, "down")} data-testid="editor-block-down"
                  className="flex-1 flex items-center justify-center gap-1 text-[11px] py-2 rounded bg-white/10 hover:bg-white/20"><ArrowDown size={12} /> Move down</button>
              </div>
              <button onClick={() => onDuplicate?.(sectionEl)} data-testid="editor-duplicate-again"
                className="mt-2 w-full flex items-center justify-center gap-2 text-[11px] py-2 rounded bg-white/10 hover:bg-white/20"><Copy size={12} /> Make another copy</button>
              <button onClick={() => { if (window.confirm("Delete this duplicated section?")) onRemoveBlock?.(blockId); }} data-testid="editor-block-delete"
                className="mt-2 w-full flex items-center justify-center gap-2 text-[11px] py-2 rounded bg-white/10 hover:bg-red-500/30 text-white/85"><Trash2 size={12} /> Delete this copy</button>
            </>
          )}
          <div className="flex items-start gap-1.5 text-[10px] text-white/35 mt-3"><MoveVertical size={11} className="mt-0.5 shrink-0" /> Copies are static — sliders, carousels and form buttons inside a copy won’t be interactive.</div>
        </Group>
      )}

      <div className="border-t border-white/10 mt-4 pt-3 space-y-3">
        <p className="text-[11px] text-white/70" data-testid="editor-draft-state">{unsaved ? 'Preview only — Save to publish your changes.' : 'All changes saved.'}</p>
        <p className="text-[11px] leading-relaxed text-white/60" data-testid="editor-storage-note">Save stores your edits in the site database, separately from page code. Keep existing element IDs when updating page layouts.</p>
        {saveMessage && <p role={saveMessage.ok ? 'status' : 'alert'} data-testid="editor-save-message" className={`text-xs ${saveMessage.ok ? 'text-green-200' : 'text-red-200'}`}>{saveMessage.text}</p>}
        <div className="flex items-center justify-between gap-3">
          <button onClick={onSave} disabled={saving || !unsaved} className="bg-[#faaf6a] text-midnight rounded px-4 py-2 text-xs font-semibold disabled:opacity-40" data-testid="editor-save">{saving ? 'Saving…' : 'Save changes'}</button>
          <button onClick={onReset} className="flex items-center gap-1 text-[11px] text-white/80 hover:text-white" data-testid="editor-reset-element"><RotateCcw size={12} /> Reset</button>
        </div>
      </div>
    </div>
  );
}
