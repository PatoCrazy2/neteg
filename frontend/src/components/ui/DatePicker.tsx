"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DatePickerProps {
  value: string; // formato YYYY-MM-DD
  onChange: (date: string) => void;
  isLight: boolean;
}

const DAYS_SHORT = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export function DatePicker({ value, onChange, isLight }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Mes visible en el calendario
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

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

  // Parsear fecha seleccionada
  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  // Generar días del mes
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    // Convertir domingo=0 a lunes=0
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(viewMonth, viewYear);
  const firstDay = getFirstDayOfMonth(viewMonth, viewYear);

  // Navegación de meses
  const prevMonth = () => {
    const prev = new Date(viewYear, viewMonth - 1, 1);
    // No retroceder antes del mes actual
    if (prev.getFullYear() > today.getFullYear() || 
        (prev.getFullYear() === today.getFullYear() && prev.getMonth() >= today.getMonth())) {
      setViewMonth(prev.getMonth());
      setViewYear(prev.getFullYear());
    }
  };

  const nextMonth = () => {
    const next = new Date(viewYear, viewMonth + 1, 1);
    setViewMonth(next.getMonth());
    setViewYear(next.getFullYear());
  };

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const selectDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    onChange(`${yyyy}-${mm}-${dd}`);
    setOpen(false);
  };

  const isPast = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    date.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isToday = (day: number) => {
    return (
      viewYear === today.getFullYear() &&
      viewMonth === today.getMonth() &&
      day === today.getDate()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      viewYear === selectedDate.getFullYear() &&
      viewMonth === selectedDate.getMonth() &&
      day === selectedDate.getDate()
    );
  };

  // Formato legible para el campo
  const displayValue = selectedDate
    ? `${selectedDate.getDate()} de ${MONTHS[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`
    : "";

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
        {displayValue || "Seleccionar fecha"}
      </button>

      {/* Dropdown del calendario */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className={`absolute left-0 top-full mt-3 z-50 w-[300px] rounded-2xl border shadow-2xl p-4 ${border} ${
              isLight ? "bg-white shadow-black/10" : "bg-[#111114] shadow-black/50"
            }`}
          >
            {/* Header: Mes y Año + Navegación */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                disabled={!canGoPrev}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-15 ${
                  isLight ? "hover:bg-black/5 text-black/60" : "hover:bg-white/5 text-white/60"
                }`}
              >
                <ChevronLeft size={16} />
              </button>

              <span className={`text-sm font-bold tracking-tight ${text}`}>
                {MONTHS[viewMonth]} {viewYear}
              </span>

              <button
                type="button"
                onClick={nextMonth}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isLight ? "hover:bg-black/5 text-black/60" : "hover:bg-white/5 text-white/60"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Nombres de los días */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_SHORT.map((d) => (
                <div
                  key={d}
                  className={`text-center text-[10px] font-bold uppercase tracking-wider ${muted}`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Grilla de días */}
            <div className="grid grid-cols-7 gap-1">
              {/* Espacios vacíos antes del primer día */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="w-9 h-9" />
              ))}

              {/* Días del mes */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const past = isPast(day);
                const todayDay = isToday(day);
                const selected = isSelected(day);

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={past}
                    onClick={() => selectDay(day)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all relative
                      ${past 
                        ? `${muted} opacity-30 cursor-not-allowed line-through` 
                        : selected
                          ? "bg-[#B9B4FF] text-black font-bold shadow-lg shadow-[#B9B4FF]/25"
                          : todayDay
                            ? `ring-1 ring-[#B9B4FF]/50 ${text} font-bold ${isLight ? "hover:bg-[#B9B4FF]/10" : "hover:bg-[#B9B4FF]/10"}`
                            : `${text} ${isLight ? "hover:bg-black/5" : "hover:bg-white/5"}`
                      }
                    `}
                  >
                    {day}
                    {todayDay && !selected && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B9B4FF]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer: Hoy */}
            <div className={`mt-3 pt-3 border-t ${border} flex items-center justify-between`}>
              <button
                type="button"
                onClick={() => {
                  setViewMonth(today.getMonth());
                  setViewYear(today.getFullYear());
                  selectDay(today.getDate());
                }}
                className="text-[11px] font-bold uppercase tracking-wider text-[#B9B4FF] hover:text-[#9C8CFF] transition-colors"
              >
                Hoy
              </button>
              {value && (
                <button
                  type="button"
                  onClick={() => { onChange(""); setOpen(false); }}
                  className={`text-[11px] font-bold uppercase tracking-wider ${muted} hover:text-red-400 transition-colors`}
                >
                  Limpiar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
