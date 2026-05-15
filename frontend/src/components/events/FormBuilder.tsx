"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  GripVertical,
  Type,
  ListChecks,
  ChevronDown,
  ChevronUp,
  FileText,
  ToggleLeft,
  X,
} from "lucide-react";

// ── Tipos ──────────────────────────────────────────────
export type QuestionType = "text" | "select" | "checkbox" | "textarea";

export interface FormQuestion {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
  options?: string[]; // solo para select / checkbox
}

interface FormBuilderProps {
  value: FormQuestion[];
  onChange: (schema: FormQuestion[]) => void;
  isLight: boolean;
}

// ── Helpers ────────────────────────────────────────────
const uid = () => `q_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const QUESTION_TYPES: { type: QuestionType; label: string; icon: typeof Type }[] = [
  { type: "text", label: "Texto corto", icon: Type },
  { type: "textarea", label: "Texto largo", icon: FileText },
  { type: "select", label: "Opción múltiple", icon: ListChecks },
  { type: "checkbox", label: "Casilla de verificación", icon: ToggleLeft },
];

// ── Componente ─────────────────────────────────────────
export function FormBuilder({ value, onChange, isLight }: FormBuilderProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Acciones CRUD ──
  const addQuestion = (type: QuestionType) => {
    const newQ: FormQuestion = {
      id: uid(),
      type,
      label: "",
      required: false,
      ...(type === "select" || type === "checkbox" ? { options: [""] } : {}),
    };
    onChange([...value, newQ]);
    setExpandedId(newQ.id);
    setShowMenu(false);
  };

  const updateQuestion = (id: string, patch: Partial<FormQuestion>) => {
    onChange(value.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const removeQuestion = (id: string) => {
    onChange(value.filter((q) => q.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const addOption = (qId: string) => {
    const q = value.find((q) => q.id === qId);
    if (!q) return;
    updateQuestion(qId, { options: [...(q.options || []), ""] });
  };

  const updateOption = (qId: string, idx: number, text: string) => {
    const q = value.find((q) => q.id === qId);
    if (!q || !q.options) return;
    const opts = [...q.options];
    opts[idx] = text;
    updateQuestion(qId, { options: opts });
  };

  const removeOption = (qId: string, idx: number) => {
    const q = value.find((q) => q.id === qId);
    if (!q || !q.options) return;
    updateQuestion(qId, { options: q.options.filter((_, i) => i !== idx) });
  };

  const moveQuestion = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= value.length) return;
    const copy = [...value];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    onChange(copy);
  };

  // ── Estilos helpers ──
  const border = isLight ? "border-black/[0.06]" : "border-white/[0.06]";
  const cardBg = isLight ? "bg-black/[0.02]" : "bg-white/[0.02]";
  const muted = isLight ? "text-black/40" : "text-white/40";
  const text = isLight ? "text-black" : "text-white";
  const textSoft = isLight ? "text-black/60" : "text-white/60";
  const inputBg = isLight ? "bg-black/[0.04]" : "bg-white/[0.04]";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4
          className={`text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${
            isLight ? "text-black/20" : "text-white/20"
          }`}
        >
          <FileText size={12} /> Formulario de Registro
        </h4>

        {value.length > 0 && (
          <span className={`text-[10px] font-medium ${muted}`}>
            {value.length} pregunta{value.length !== 1 && "s"}
          </span>
        )}
      </div>

      {/* Lista de preguntas */}
      <AnimatePresence initial={false}>
        {value.map((q, idx) => {
          const TypeIcon =
            QUESTION_TYPES.find((t) => t.type === q.type)?.icon || Type;
          const isExpanded = expandedId === q.id;

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className={`rounded-2xl border ${border} ${cardBg} overflow-hidden`}
            >
              {/* Cabecera colapsable */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  isLight ? "hover:bg-black/[0.03]" : "hover:bg-white/[0.03]"
                }`}
              >
                <GripVertical size={14} className={muted} />
                <TypeIcon size={14} className="text-[#B9B4FF]" />
                <span className={`flex-1 text-left text-sm font-medium truncate ${q.label ? text : muted}`}>
                  {q.label || "Pregunta sin título"}
                </span>
                {q.required && (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#B9B4FF] bg-[#B9B4FF]/10 px-2 py-0.5 rounded-full">
                    Requerida
                  </span>
                )}
                {isExpanded ? (
                  <ChevronUp size={14} className={muted} />
                ) : (
                  <ChevronDown size={14} className={muted} />
                )}
              </button>

              {/* Panel expandido */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`px-4 pb-4 pt-1 border-t ${border} space-y-4`}
                  >
                    {/* Título de la pregunta */}
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>
                        Título de la pregunta
                      </label>
                      <input
                        type="text"
                        placeholder="Ej: ¿Empresa donde laboras?"
                        value={q.label}
                        onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                        className={`w-full h-10 px-3 rounded-xl text-sm border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-[#B9B4FF]/30 focus:outline-none transition-all placeholder:${muted}`}
                      />
                    </div>

                    {/* Opciones (solo para select / checkbox) */}
                    {(q.type === "select" || q.type === "checkbox") && (
                      <div className="space-y-2">
                        <label className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>
                          Opciones
                        </label>
                        <div className="space-y-2">
                          {q.options?.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-${q.type === "select" ? "full" : "md"} border ${border} flex-shrink-0`}
                              />
                              <input
                                type="text"
                                placeholder={`Opción ${optIdx + 1}`}
                                value={opt}
                                onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                                className={`flex-1 h-9 px-3 rounded-lg text-sm border ${border} ${inputBg} ${text} focus:ring-2 focus:ring-[#B9B4FF]/30 focus:outline-none transition-all`}
                              />
                              {(q.options?.length || 0) > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeOption(q.id, optIdx)}
                                  className={`p-1.5 rounded-lg ${muted} hover:text-red-400 hover:bg-red-500/10 transition-all`}
                                >
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => addOption(q.id)}
                          className={`flex items-center gap-1.5 text-[11px] font-semibold ${muted} hover:text-[#B9B4FF] transition-colors pt-1`}
                        >
                          <Plus size={12} /> Agregar opción
                        </button>
                      </div>
                    )}

                    {/* Barra de acciones inferior */}
                    <div className={`flex items-center justify-between pt-3 border-t ${border}`}>
                      <div className="flex items-center gap-2">
                        {/* Toggle requerido */}
                        <button
                          type="button"
                          onClick={() => updateQuestion(q.id, { required: !q.required })}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                            q.required
                              ? "bg-[#B9B4FF]/15 border-[#B9B4FF]/30 text-[#B9B4FF]"
                              : `${inputBg} ${border} ${muted} hover:text-[#B9B4FF]`
                          }`}
                        >
                          <ToggleLeft size={12} />
                          {q.required ? "Requerida" : "Opcional"}
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveQuestion(idx, -1)}
                          disabled={idx === 0}
                          className={`p-1.5 rounded-lg transition-all disabled:opacity-20 ${muted} hover:text-white hover:bg-white/5`}
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveQuestion(idx, 1)}
                          disabled={idx === value.length - 1}
                          className={`p-1.5 rounded-lg transition-all disabled:opacity-20 ${muted} hover:text-white hover:bg-white/5`}
                        >
                          <ChevronDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeQuestion(q.id)}
                          className={`p-1.5 rounded-lg ${muted} hover:text-red-400 hover:bg-red-500/10 transition-all ml-1`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Botón para agregar pregunta + menú desplegable */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowMenu(!showMenu)}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed transition-all text-[11px] font-bold uppercase tracking-widest ${
            showMenu
              ? "border-[#B9B4FF]/40 text-[#B9B4FF] bg-[#B9B4FF]/5"
              : `${border} ${muted} hover:border-[#B9B4FF]/30 hover:text-[#B9B4FF] hover:bg-[#B9B4FF]/5`
          }`}
        >
          <Plus size={14} />
          Agregar Pregunta
        </button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={`absolute left-0 right-0 mt-2 rounded-2xl border ${border} ${
                isLight ? "bg-white" : "bg-[#111114]"
              } shadow-2xl z-20 overflow-hidden`}
            >
              {QUESTION_TYPES.map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addQuestion(type)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${textSoft} ${
                    isLight ? "hover:bg-black/[0.04]" : "hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon size={16} className="text-[#B9B4FF]" />
                  {label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
