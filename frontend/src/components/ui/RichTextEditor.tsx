"use client";

import { useRef } from "react";
import { Bold, Italic, List, Link as LinkIcon, Heading2 } from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  isLight: boolean;
  error?: boolean;
}

export function RichTextEditor({ value, onChange, placeholder, isLight, error }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertFormat = (prefix: string, suffix: string = "") => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
    onChange(newText);

    // Reposicionar cursor para que el usuario pueda seguir escribiendo dentro del formato
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const toolbarClasses = `flex items-center gap-1 p-2 border-b ${
    isLight ? 'border-black/10 bg-black/5' : 'border-white/10 bg-white/5'
  }`;

  const btnClasses = `p-1.5 rounded-lg transition-colors ${
    isLight ? 'text-black/60 hover:bg-black/10 hover:text-black' : 'text-white/60 hover:bg-white/10 hover:text-white'
  }`;

  return (
    <div className={`border rounded-xl overflow-hidden focus-within:ring-1 focus-within:border-transparent transition-all ${
      error 
        ? 'border-red-400/50 focus-within:ring-[#B9B4FF]/50' 
        : isLight 
          ? 'border-black/10 focus-within:ring-black/20' 
          : 'border-white/10 focus-within:ring-white/20'
    }`}>
      {/* Toolbar */}
      <div className={toolbarClasses}>
        <button type="button" onClick={() => insertFormat("**", "**")} className={btnClasses} title="Negrita">
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => insertFormat("*", "*")} className={btnClasses} title="Cursiva">
          <Italic size={16} />
        </button>
        <div className={`w-px h-4 mx-1 ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />
        <button type="button" onClick={() => insertFormat("### ", "")} className={btnClasses} title="Subtítulo">
          <Heading2 size={16} />
        </button>
        <button type="button" onClick={() => insertFormat("- ", "")} className={btnClasses} title="Lista">
          <List size={16} />
        </button>
        <div className={`w-px h-4 mx-1 ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />
        <button type="button" onClick={() => insertFormat("[", "](https://)")} className={btnClasses} title="Enlace">
          <LinkIcon size={16} />
        </button>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        className={`w-full min-h-[140px] bg-transparent border-none p-4 text-[15px] resize-none focus:outline-none focus:ring-0 leading-relaxed ${
          isLight ? 'text-black/80 placeholder:text-black/30' : 'text-white/80 placeholder:text-white/30'
        }`}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />
    </div>
  );
}
