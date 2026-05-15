"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical, Settings } from "lucide-react";
import { motion } from "framer-motion";

export type QuestionType = "text" | "email" | "paragraph" | "multiple_choice" | "checkbox";

export interface FormQuestion {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  options?: string[];
  isLocked?: boolean;
}

interface FormBuilderProps {
  value: FormQuestion[];
  onChange: (questions: FormQuestion[]) => void;
  isLight?: boolean;
}

const DEFAULT_QUESTIONS: FormQuestion[] = [
  { id: "q_name", type: "text", question: "Nombre completo", required: true, isLocked: true },
  { id: "q_email", type: "email", question: "Correo electrónico", required: true, isLocked: true },
];

export function FormBuilder({ value, onChange, isLight }: FormBuilderProps) {
  // Inicializamos con los campos obligatorios si está vacío
  if (value.length === 0) {
    onChange(DEFAULT_QUESTIONS);
    return null;
  }

  const addQuestion = (type: QuestionType) => {
    const newQuestion: FormQuestion = {
      id: `q_${Date.now()}`,
      type,
      question: "",
      required: false,
      ...(type === "multiple_choice" || type === "checkbox" ? { options: ["Opción 1"] } : {})
    };
    onChange([...value, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<FormQuestion>) => {
    onChange(value.map(q => q.id === id && !q.isLocked ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    const q = value.find(v => v.id === id);
    if (q?.isLocked) return;
    onChange(value.filter(q => q.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 ${
          isLight ? 'text-black/50' : 'text-white/50'
        }`}>
          <Settings size={12} /> Preguntas del Registro
        </h4>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => addQuestion("text")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isLight ? 'bg-black/5 hover:bg-black/10 text-black/70' : 'bg-white/5 hover:bg-white/10 text-white/70'
            }`}
          >
            <Plus size={14} /> Texto Corto
          </button>
          <button 
            type="button"
            onClick={() => addQuestion("multiple_choice")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isLight ? 'bg-black/5 hover:bg-black/10 text-black/70' : 'bg-white/5 hover:bg-white/10 text-white/70'
            }`}
          >
            <Plus size={14} /> Opción Múltiple
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {value.map((q, index) => (
          <motion.div 
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border relative flex gap-4 ${
              isLight ? 'bg-white border-black/10' : 'bg-white/[0.02] border-white/10'
            }`}
          >
            <div className={`mt-2 cursor-grab active:cursor-grabbing ${isLight ? 'text-black/20' : 'text-white/20'}`}>
              <GripVertical size={16} />
            </div>
            
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <input 
                  type="text"
                  placeholder="Escribe tu pregunta..."
                  disabled={q.isLocked}
                  className={`flex-1 bg-transparent border-none text-sm font-medium focus:outline-none ${
                    isLight ? 'text-black placeholder:text-black/30' : 'text-white placeholder:text-white/30'
                  } ${q.isLocked ? 'opacity-70' : ''}`}
                  value={q.question}
                  onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                />
                
                <div className="flex items-center gap-3">
                  <label className={`flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold ${
                    isLight ? 'text-black/50' : 'text-white/50'
                  }`}>
                    Obligatorio
                    <input 
                      type="checkbox"
                      disabled={q.isLocked}
                      checked={q.required}
                      onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                      className="rounded border-white/20 bg-transparent"
                    />
                  </label>
                  
                  {!q.isLocked && (
                    <button 
                      type="button"
                      onClick={() => removeQuestion(q.id)}
                      className="text-red-400/50 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                  {q.isLocked && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-[#B9B4FF]/80">Fijo</span>
                  )}
                </div>
              </div>

              {/* Opciones múltiples */}
              {(q.type === "multiple_choice" || q.type === "checkbox") && q.options && (
                <div className="space-y-2 pl-4 border-l-2 border-white/10">
                  {q.options.map((opt, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full border ${q.type === 'checkbox' ? 'rounded-sm' : ''} ${isLight ? 'border-black/30' : 'border-white/30'}`} />
                      <input 
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...q.options!];
                          newOpts[optIdx] = e.target.value;
                          updateQuestion(q.id, { options: newOpts });
                        }}
                        className={`bg-transparent border-b border-transparent focus:border-white/20 text-xs focus:outline-none w-full ${
                          isLight ? 'text-black/70' : 'text-white/70'
                        }`}
                      />
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => {
                      const newOpts = [...q.options!, `Opción ${q.options!.length + 1}`];
                      updateQuestion(q.id, { options: newOpts });
                    }}
                    className={`text-[10px] uppercase tracking-wider font-bold mt-2 ${isLight ? 'text-black/40 hover:text-black' : 'text-white/40 hover:text-white'}`}
                  >
                    + Añadir Opción
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
