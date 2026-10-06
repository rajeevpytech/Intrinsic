import React, { useRef, useState } from "react";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Link2, Image as ImageIcon, Eye, Pencil } from "lucide-react";
import Markdown from "../Markdown";
import { api, errMsg } from "../../lib/api";

// Lightweight markdown rich-text editor: formatting toolbar + live preview.
export default function MarkdownEditor({ value, onChange, testId }) {
  const ref = useRef(null);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  const surround = (before, after = before, placeholder = "text") => {
    const ta = ref.current;
    if (!ta) return;
    const s = ta.selectionStart, e = ta.selectionEnd;
    const val = value || "";
    const sel = val.slice(s, e) || placeholder;
    const next = val.slice(0, s) + before + sel + after + val.slice(e);
    onChange(next);
    requestAnimationFrame(() => { ta.focus(); ta.selectionStart = s + before.length; ta.selectionEnd = s + before.length + sel.length; });
  };

  const linePrefix = (prefix) => {
    const ta = ref.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const val = value || "";
    const lineStart = val.lastIndexOf("\n", s - 1) + 1;
    const next = val.slice(0, lineStart) + prefix + val.slice(lineStart);
    onChange(next);
    requestAnimationFrame(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = s + prefix.length; });
  };

  const insertImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      onChange((value || "") + `\n\n![image](${data.path})\n\n`);
    } catch (err) { alert(errMsg(err)); } finally { setUploading(false); }
  };

  const Btn = ({ icon: Icon, onClick, title, tid }) => (
    <button type="button" title={title} onClick={onClick} data-testid={tid}
      className="h-8 w-8 inline-flex items-center justify-center text-slatesage hover:text-navy hover:bg-ice transition-colors">
      <Icon size={16} />
    </button>
  );

  return (
    <div className="border border-powder" data-testid={`${testId}-editor`}>
      <div className="flex items-center gap-0.5 flex-wrap border-b border-powder bg-white px-1.5 py-1">
        <Btn icon={Bold} title="Bold" tid={`${testId}-bold`} onClick={() => surround("**")} />
        <Btn icon={Italic} title="Italic" tid={`${testId}-italic`} onClick={() => surround("_")} />
        <span className="w-px h-5 bg-powder mx-1" />
        <Btn icon={Heading2} title="Heading" tid={`${testId}-h2`} onClick={() => linePrefix("## ")} />
        <Btn icon={Heading3} title="Subheading" tid={`${testId}-h3`} onClick={() => linePrefix("### ")} />
        <Btn icon={List} title="Bulleted list" tid={`${testId}-ul`} onClick={() => linePrefix("- ")} />
        <Btn icon={ListOrdered} title="Numbered list" tid={`${testId}-ol`} onClick={() => linePrefix("1. ")} />
        <Btn icon={Quote} title="Quote" tid={`${testId}-quote`} onClick={() => linePrefix("> ")} />
        <span className="w-px h-5 bg-powder mx-1" />
        <Btn icon={Link2} title="Link" tid={`${testId}-link`} onClick={() => surround("[", "](https://)", "link text")} />
        <label className="h-8 w-8 inline-flex items-center justify-center text-slatesage hover:text-navy hover:bg-ice transition-colors cursor-pointer" title="Insert image" data-testid={`${testId}-image`}>
          <ImageIcon size={16} />
          <input type="file" accept="image/*" className="hidden" onChange={insertImage} />
        </label>
        {uploading && <span className="text-[11px] text-slatesage ml-1">Uploading…</span>}
        <div className="ml-auto">
          <button type="button" onClick={() => setPreview((p) => !p)} data-testid={`${testId}-toggle-preview`}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-navy px-2 py-1 hover:bg-ice transition-colors">
            {preview ? <><Pencil size={13} />Write</> : <><Eye size={13} />Preview</>}
          </button>
        </div>
      </div>
      {preview ? (
        <div className="px-4 py-3 min-h-[260px] bg-white max-w-none"><Markdown>{value || "_Nothing to preview yet._"}</Markdown></div>
      ) : (
        <textarea ref={ref} rows={16} value={value || ""} onChange={(e) => onChange(e.target.value)} data-testid={testId}
          placeholder={"Write your article using Markdown…\n\n## A section heading\n\nA paragraph of text. Make words **bold** or _italic_, add a [link](https://example.com), or a list:\n\n- First point\n- Second point"}
          className="w-full px-4 py-3 text-[14.5px] leading-[1.7] font-mono focus:outline-none resize-y" />
      )}
    </div>
  );
}
