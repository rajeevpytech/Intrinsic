import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { imgUrl } from "../lib/api";

// Styled markdown renderer for article bodies.
export default function Markdown({ children, className = "" }) {
  return (
    <div className={`md-body ${className}`} data-testid="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h2 className="font-serif font-semibold text-[26px] sm:text-[30px] leading-snug text-royal mt-12 mb-4" {...p} />,
          h2: (p) => <h2 className="font-serif font-semibold text-[24px] sm:text-[27px] leading-snug text-royal mt-11 mb-4" {...p} />,
          h3: (p) => <h3 className="font-serif font-semibold text-[20px] sm:text-[22px] leading-snug text-midnight mt-9 mb-3" {...p} />,
          p: (p) => <p className="text-[#2e3745] text-[16.5px] leading-[1.85] my-5" {...p} />,
          a: ({ href, ...p }) => <a href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-navy underline underline-offset-4 hover:text-royal transition-colors" {...p} />,
          ul: (p) => <ul className="list-disc pl-6 my-5 space-y-2 text-[#2e3745] text-[16.5px] leading-[1.75]" {...p} />,
          ol: (p) => <ol className="list-decimal pl-6 my-5 space-y-2 text-[#2e3745] text-[16.5px] leading-[1.75]" {...p} />,
          li: (p) => <li className="pl-1" {...p} />,
          blockquote: (p) => <blockquote className="border-l-[3px] border-[#f2a91c] pl-6 my-7 font-serif italic text-royal text-[20px] sm:text-[22px] leading-[1.5]" {...p} />,
          strong: (p) => <strong className="font-semibold text-midnight" {...p} />,
          em: (p) => <em className="italic" {...p} />,
          hr: () => <hr className="my-10 border-powder/70" />,
          code: ({ inline, ...p }) => inline
            ? <code className="bg-ice px-1.5 py-0.5 text-[14px] font-mono text-navy border border-powder" {...p} />
            : <code className="block bg-[#0d2144] text-white p-4 my-6 text-[14px] font-mono overflow-x-auto" {...p} />,
          img: ({ src, alt }) => <img src={imgUrl(src)} alt={alt || ""} className="w-full h-auto my-7 border border-powder" />,
          table: (p) => <div className="overflow-x-auto my-6"><table className="w-full text-[15px] border-collapse" {...p} /></div>,
          th: (p) => <th className="border border-powder bg-ice px-3 py-2 text-left font-semibold text-midnight" {...p} />,
          td: (p) => <td className="border border-powder px-3 py-2 text-[#2e3745]" {...p} />,
        }}
      >
        {children || ""}
      </ReactMarkdown>
    </div>
  );
}
