"use client";

import { Event } from "@/types/event";
import { motion, AnimatePresence } from "framer-motion";
import { Users, BarChart3, Settings, ShieldCheck, CheckCircle2, MoreHorizontal, ExternalLink, Mail, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { participantApi } from "@/lib/api";
import { ParticipantResponse } from "@/types/participant";

interface EventDashboardPreviewProps {
  event: Event;
}

export function EventDashboardPreview({ event }: EventDashboardPreviewProps) {
  const [participants, setParticipants] = useState<ParticipantResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const data = await participantApi.getByEventId(event.id);
        setParticipants(data);
      } catch (err) {
        console.error("Error fetching participants:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, [event.id]);

  const capacity = event.capacity || 100;
  const registered = participants.length;
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
            <div className="text-2xl font-bold text-white tracking-tight">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white/20" /> : registered}
            </div>
            <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Asistentes</div>
          </div>
        </div>

        <div className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-full bg-[#B9B4FF]/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[#B9B4FF]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-white/20" /> : `${percentage}%`}
            </div>
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

      {/* Recent Participants Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-sm font-bold text-white">Participantes Recientes</h4>
          <span className="text-[10px] font-bold text-[#B9B4FF] uppercase tracking-wider">{participants.length} total</span>
        </div>

        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#B9B4FF]/40" />
            </div>
          ) : participants.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.01] border border-dashed border-white/5 text-center">
              <p className="text-white/20 text-xs italic">Nadie se ha registrado aún.</p>
            </div>
          ) : (
            participants.slice(0, 5).map((p) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#B9B4FF]/10 flex items-center justify-center text-[10px] font-bold text-[#B9B4FF] flex-shrink-0">
                    {p.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate">{p.fullName}</div>
                    <div className="text-[10px] text-white/30 truncate">{p.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tight ${
                    p.status === 'Registered' ? 'bg-green-500/10 text-green-400/80' : 'bg-white/5 text-white/30'
                  }`}>
                    {p.status}
                  </span>
                </div>
              </motion.div>
            ))
          )}
          
          {participants.length > 5 && (
            <button className="w-full py-2 text-[10px] font-bold text-[#B9B4FF] uppercase tracking-widest hover:text-white transition-colors">
              Ver todos los asistentes ({participants.length})
            </button>
          )}
        </div>
      </div>

      {/* Link Compartible */}
      <div className="p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 flex flex-col gap-3">
        <h4 className="text-sm font-bold text-white px-1">Link de Invitación</h4>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-black/20 border border-white/10">
          <ExternalLink className="w-4 h-4 text-white/40" />
          <input 
            type="text" 
            readOnly 
            value={`${typeof window !== 'undefined' ? window.location.origin : ''}/e/${event.id}`} 
            className="flex-1 bg-transparent border-none text-xs text-white/80 outline-none truncate"
          />
          <button 
            onClick={() => {
              navigator.clipboard.writeText(`${typeof window !== 'undefined' ? window.location.origin : ''}/e/${event.id}`);
              alert("Enlace copiado al portapapeles");
            }}
            className="px-3 py-1.5 rounded-lg bg-[#B9B4FF]/20 hover:bg-[#B9B4FF]/40 text-[#B9B4FF] transition-colors"
            title="Copiar enlace"
          >
            <span className="text-[10px] font-bold uppercase">Copiar</span>
          </button>
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

        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#B9B4FF] text-black font-bold text-xs hover:bg-[#9C8CFF] transition-all">
          <Settings className="w-4 h-4" />
          Configuración Avanzada
        </button>

        <button 
          onClick={() => window.open(`/e/${event.id}`, '_blank')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          Ver Landing del Evento
        </button>
      </div>
    </div>
  );
}
