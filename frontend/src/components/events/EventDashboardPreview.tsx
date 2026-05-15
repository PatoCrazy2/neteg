"use client";

import { Event } from "@/types/event";
import { motion } from "framer-motion";
import { Users, BarChart3, Settings, ShieldCheck, CheckCircle2, MoreHorizontal, ExternalLink } from "lucide-react";

interface EventDashboardPreviewProps {
  event: Event;
}

export function EventDashboardPreview({ event }: EventDashboardPreviewProps) {
  const capacity = event.capacity || 100;
  const registered = 45; // Mock data
  const percentage = Math.round((registered / capacity) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">{registered}</div>
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Asistentes</div>
          </div>
        </div>

        <div className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-[#B9B4FF]/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#B9B4FF]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">{percentage}%</div>
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Capacidad</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-white/60">Progreso de Registro</span>
          <span className="text-[10px] font-mono text-white/20">{registered} / {capacity}</span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[#B9B4FF] to-[#9C8CFF] shadow-[0_0_10px_rgba(185,180,255,0.5)]"
          />
        </div>
      </div>

      {/* Configuration Status */}
      <div className="flex flex-col gap-3">
        <h4 className="text-sm font-bold text-white px-1">Configuración</h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Evento Público</div>
                <div className="text-[10px] text-white/20">Visible en la plataforma</div>
              </div>
            </div>
            <Settings className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Aprobación Manual</div>
                <div className="text-[10px] text-white/20">Requerida para nuevos asistentes</div>
              </div>
            </div>
            <Settings className="w-4 h-4 text-white/10 group-hover:text-white/40 transition-colors" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <button 
            disabled
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-bold text-xs cursor-not-allowed opacity-50"
          >
            <BarChart3 className="w-4 h-4" />
            Analíticas
          </button>
          <button 
            disabled
            className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-bold text-xs cursor-not-allowed opacity-50"
          >
            <Users className="w-4 h-4" />
            Asistentes
          </button>
        </div>

        {/* TODO: Link to collaborator's forms/management page below */}
        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#B9B4FF] text-black font-bold text-xs hover:bg-[#9C8CFF] transition-all">
          <Settings className="w-4 h-4" />
          Configuración Avanzada
        </button>

        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all">
          <ExternalLink className="w-4 h-4" />
          Ver Landing del Evento
        </button>
      </div>
    </div>
  );
}
