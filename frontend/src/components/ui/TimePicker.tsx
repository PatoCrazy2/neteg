"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimePickerProps {
  value: string; // formato HH:mm
  onChange: (time: string) => void;
  isLight: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

export function TimePicker({ value, onChange, isLight }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [selectedHour, selectedMinute] = value ? value.split(":") : ["", ""];

  const handleHourSelect = (h: string) => {
    const m = selectedMinute || "00";
    onChange(`${h}:${m}`);
  };

  const handleMinuteSelect = (m: string) => {
    const h = selectedHour || "12";
    onChange(`${h}:${m}`);
    setOpen(false); // Cerramos al seleccionar el minuto (asumiendo que ya eligió la hora)
  };

  // Formato legible
  let displayValue = "";
  if (value) {
    const h = parseInt(selectedHour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayH = h % 12 || 12;
    displayValue = `${displayH}:${selectedMinute} ${ampm}`;
  }

  // ── Estilos ──
  const border = isLight ? "border-black/10" : "border-white/10";
  const muted = isLight ? "text-black/40" : "text-white/40";
  const text = isLight ? "text-black" : "text-white";

  return (
    <div className="relative" ref={ref}>
      {/* Campo clickeable */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-2 text-left text-[15px] font-medium transition-all py-1 ${
          value ? (isLight ? "text-black/80" : "text-white/80") : muted
        }`}
      >
        {displayValue || "Seleccionar hora"}
      </button>

      {/* Dropdown del selector de hora */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={`absolute left-0 top-full mt-3 z-50 w-[280px] rounded-2xl border shadow-2xl p-4 flex gap-4 ${border} ${
              isLight ? "bg-white shadow-black/10" : "bg-[#111114] shadow-black/50"
            }`}
          >
            {/* Columna Horas */}
            <div className="flex-1">
              <div className={`text-[10px] font-bold uppercase tracking-widest text-center mb-2 ${muted}`}>Hora</div>
              <div className="h-[200px] overflow-y-auto no-scrollbar space-y-1 pr-1">
                {HOURS.map((h) => {
                  const isSelected = h === selectedHour;
                  return (
                    <button
                      key={`h-${h}`}
                      type="button"
                      onClick={() => handleHourSelect(h)}
                      className={`w-full py-2 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-[#B9B4FF] text-black font-bold shadow-lg shadow-[#B9B4FF]/25"
                          : `${text} ${isLight ? "hover:bg-black/5" : "hover:bg-white/5"}`
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`w-px bg-gradient-to-b from-transparent via-${isLight ? 'black' : 'white'}/10 to-transparent`} />

            {/* Columna Minutos */}
            <div className="flex-1">
              <div className={`text-[10px] font-bold uppercase tracking-widest text-center mb-2 ${muted}`}>Minuto</div>
              <div className="h-[200px] overflow-y-auto no-scrollbar space-y-1 pl-1">
                {MINUTES.map((m) => {
                  const isSelected = m === selectedMinute;
                  return (
                    <button
                      key={`m-${m}`}
                      type="button"
                      onClick={() => handleMinuteSelect(m)}
                      className={`w-full py-2 rounded-xl text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-[#B9B4FF] text-black font-bold shadow-lg shadow-[#B9B4FF]/25"
                          : `${text} ${isLight ? "hover:bg-black/5" : "hover:bg-white/5"}`
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
