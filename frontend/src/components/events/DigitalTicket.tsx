"use client";

import { Event } from "@/types/event";
import { ParticipantResponse } from "@/types/participant";
import { motion, AnimatePresence } from "framer-motion";
import { 
  QrCode, 
  MapPin, 
  Calendar, 
  Clock, 
  Share2, 
  Download, 
  Loader2, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Info
} from "lucide-react";
import { useEffect, useState } from "react";
import { participantApi } from "@/lib/api";

interface DigitalTicketProps {
  event: Event;
  participant?: ParticipantResponse;
}

export function DigitalTicket({ event, participant: initialParticipant }: DigitalTicketProps) {
  const [participant, setParticipant] = useState<ParticipantResponse | undefined>(initialParticipant);
  const [loading, setLoading] = useState(!initialParticipant && event.generateTickets);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // If we have an initial participant, sync it
    if (initialParticipant) {
      setParticipant(initialParticipant);
      setLoading(false);
    }

    // If no participant provided but event requires tickets, fetch it
    if (event.generateTickets) {
      const fetchParticipant = async () => {
        try {
          // Obtener la participación exacta del usuario logueado para este evento
          const data = await participantApi.getMyParticipation(event.id);
          if (data) {
            setParticipant(data);
          }
        } catch (err) {
          console.error("Error fetching participant for ticket", err);
        } finally {
          setLoading(false);
        }
      };

      fetchParticipant();
    }
  }, [event.id, initialParticipant, event.generateTickets]);

  // Polling logic if status is pending
  useEffect(() => {
    if (!participant || participant.ticketStatus === 'Completed' || participant.ticketStatus === 'Failed' || participant.ticketStatus === 'NotRequired') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const updated = await participantApi.getById(participant.id);
        setParticipant(updated);
        if (updated.ticketStatus === 'Completed' || updated.ticketStatus === 'Failed') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [participant?.id, participant?.ticketStatus]);

  const handleCopyPin = () => {
    if (!participant?.accessPin) return;
    navigator.clipboard.writeText(participant.accessPin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const date = new Date(event.date);
  const formattedDate = date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const time = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const isGenerating = loading || participant?.ticketStatus === 'Pending' || participant?.ticketStatus === 'Processing';
  const isFailed = participant?.ticketStatus === 'Failed';
  const isCompleted = participant?.ticketStatus === 'Completed' && participant?.ticketUrl;
  const notRequired = !event.generateTickets || participant?.ticketStatus === 'NotRequired';

  return (
    <div className="flex flex-col gap-6 w-full max-w-md mx-auto">
      {/* Ticket Container */}
      <motion.div 
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="relative bg-[#111115] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(185,180,255,0.07),rgba(255,255,255,0))]"
      >
        {/* Subtle Noise Texture Overlay (Premium) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/></svg>')]" />

        {/* 1️⃣ Hero Visual Pequeño (Luma/Spotify Vibe) */}
        <div className="relative h-44 w-full bg-black overflow-hidden border-b border-white/5">
          {/* Blurred overlay background */}
          {event.coverImageUrl ? (
            <img 
              src={event.coverImageUrl} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-125"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#6366f1]/20 via-[#b9b4ff]/10 to-transparent blur-2xl" />
          )}

          {/* Crisp Cover Image */}
          {event.coverImageUrl ? (
            <img 
              src={event.coverImageUrl} 
              alt={event.name} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1E1E24] to-[#121216] flex items-center justify-center relative overflow-hidden">
              <div className="absolute -left-16 -top-16 w-40 h-40 rounded-full bg-[#B9B4FF]/10 blur-3xl animate-pulse" />
              <div className="absolute -right-16 -bottom-16 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl" />
              <Sparkles className="w-10 h-10 text-[#B9B4FF]/15 animate-bounce" />
            </div>
          )}

          {/* Elegant Dark Gradients on Cover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-[#111115]/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#111115] to-transparent" />

          {/* 9️⃣ Dynamic Status Badge (Premium Live State) */}
          <div className="absolute top-5 right-5 z-20">
            {!notRequired && isCompleted && (
              participant?.attended ? (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[9px] font-bold text-emerald-400 uppercase tracking-widest backdrop-blur-md shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CHECKED IN
                </span>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B9B4FF]/10 border border-[#B9B4FF]/25 text-[9px] font-bold text-[#B9B4FF] uppercase tracking-widest backdrop-blur-md shadow-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B9B4FF] animate-pulse" />
                  VALID TICKET
                </span>
              )
            )}
          </div>
        </div>

        {/* Top Header */}
        <div className="p-8 pb-4 relative">
          <div className="flex justify-between items-start mb-5">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-[#B9B4FF]/60 uppercase tracking-[0.25em] mb-1.5">Boarding Pass</span>
              {/* 2️⃣ Jerarquía del Nombre (Dominant Event Name) */}
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
                {event.name}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-5 mt-6 border-t border-white/5 pt-5">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Fecha</span>
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <Calendar className="w-3.5 h-3.5 text-[#B9B4FF]" />
                {formattedDate}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Hora</span>
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <Clock className="w-3.5 h-3.5 text-[#B9B4FF]" />
                {time}
              </div>
            </div>
            <div className="flex flex-col col-span-2 mt-1">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Ubicación</span>
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#B9B4FF]" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4️⃣ Perforaciones del Ticket Premium (Real separation feel) */}
        <div className="flex items-center gap-3 px-1 relative z-10 my-1">
          <div className="w-5 h-9 rounded-r-full bg-[#0B0B0E] border-r border-y border-white/10 -ml-1.5 shadow-[inset_-4px_0_6px_rgba(0,0,0,0.6)]" />
          <div className="flex-1 border-t border-dashed border-white/10 h-0" />
          <div className="w-5 h-9 rounded-l-full bg-[#0B0B0E] border-l border-y border-white/10 -mr-1.5 shadow-[inset_4px_0_6px_rgba(0,0,0,0.6)]" />
        </div>

        {/* Bottom Section (Content depending on status) */}
        <div className="p-8 pt-5 bg-white/[0.01] flex flex-col items-center min-h-[220px] justify-center relative">
          {notRequired ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Registro Confirmado</h3>
              <p className="text-white/40 text-xs">Este evento no requiere boleto digital.</p>
            </div>
          ) : isGenerating ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-[#B9B4FF]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#B9B4FF]/20">
                <Loader2 className="w-8 h-8 text-[#B9B4FF] animate-spin" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Preparando...</h3>
              <p className="text-white/40 text-xs">Generando tu boleto digital.</p>
            </div>
          ) : isFailed ? (
            <div className="text-center py-10">
              <p className="text-red-400 text-xs">Error al generar el boleto. Por favor contacta al organizador.</p>
            </div>
          ) : isCompleted ? (
            <>
              {/* 3️⃣ QR con Glow, Profundidad y Contenedor Glass */}
              <div className="relative group mb-6">
                {/* Vibrant Radial soft glow behind QR */}
                <div className="absolute inset-0 bg-[#B9B4FF]/20 rounded-[2rem] opacity-30 blur-2xl group-hover:opacity-40 group-hover:blur-3xl transition-all duration-500 pointer-events-none" />
                
                {/* QR Border Gradient Wrapper */}
                <div className="relative p-5 bg-white rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.02)] border border-white/20 transition-all duration-500 group-hover:scale-[1.03] group-hover:shadow-[0_20px_50px_rgba(185,180,255,0.15)]">
                  <img src={participant.ticketUrl} alt="QR Code" className="w-36 h-36 relative z-10" />
                  {/* Subtle inner card border */}
                  <div className="absolute inset-0 border border-black/5 rounded-[2rem] pointer-events-none" />
                </div>
              </div>

              {/* 8️⃣ PIN copiable de Alta Importancia (Tap to Copy) */}
              {participant.accessPin ? (
                <div className="text-center mb-6 w-full px-2">
                  <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-2">
                    PIN de Acceso Manual (Fallback)
                  </div>
                  <button 
                    onClick={handleCopyPin}
                    className="relative group w-full py-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-2.5 cursor-pointer focus:outline-none"
                  >
                    <span className="font-mono text-sm font-black text-[#B9B4FF] tracking-[0.4em] pl-[0.4em]">
                      {participant.accessPin}
                    </span>
                    
                    <div className="absolute right-4 flex items-center gap-1.5 text-[9px] font-bold text-white/30 group-hover:text-white/60 transition-colors uppercase tracking-widest">
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.div 
                            key="copied"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1 text-emerald-400 font-bold"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copiado</span>
                          </motion.div>
                        ) : (
                          <motion.div 
                            key="copy"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                </div>
              ) : (
                <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mb-6">
                  #{participant.id.slice(0, 8).toUpperCase()}
                </p>
              )}
              
              {/* 6️⃣ Botones Compactos e Integrados */}
              <div className="flex gap-3 w-full border-t border-white/5 pt-5 mt-1">
                <button 
                  onClick={() => window.open(participant.ticketUrl, '_blank')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white font-bold text-xs transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Descargar
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white font-bold text-xs transition-all cursor-pointer">
                  <Share2 className="w-3.5 h-3.5" />
                  Compartir
                </button>
              </div>
            </>
          ) : (
             <div className="text-center py-10">
              <QrCode className="w-20 h-20 text-white/10 mx-auto" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Additional Info */}
      {!notRequired && (
        <div className="p-6 rounded-3xl bg-[#111115]/80 border border-white/5 backdrop-blur-md shadow-lg">
          <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#B9B4FF]" />
            Información para el ingreso
          </h4>
          <ul className="space-y-2.5">
            <li className="text-xs text-white/40 flex items-start gap-2 leading-relaxed">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B9B4FF] mt-1.5 flex-shrink-0" />
              Llega al menos 15 minutos antes de la hora programada.
            </li>
            <li className="text-xs text-white/40 flex items-start gap-2 leading-relaxed">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B9B4FF] mt-1.5 flex-shrink-0" />
              Muestra este código QR en la entrada para validar tu asistencia.
            </li>
            {participant?.accessPin && (
              <li className="text-xs text-white/40 flex items-start gap-2 leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-[#B9B4FF] mt-1.5 flex-shrink-0" />
                Si tu QR tiene problemas para escanear, dicta el PIN al staff.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
