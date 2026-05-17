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
  Info,
  ChevronLeft
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
  const [showFullTicket, setShowFullTicket] = useState(false);

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

  // Render a compact access trigger card by default if completed
  if (!showFullTicket && isCompleted) {
    return (
      <motion.div
        layoutId="digital-ticket-container"
        whileHover={{ y: -4, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="w-full bg-[#111115] rounded-[2rem] border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(185,180,255,0.06),rgba(255,255,255,0))] cursor-pointer group"
        onClick={() => setShowFullTicket(true)}
      >
        {/* Subtle Noise */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/></svg>')]" />
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-[#B9B4FF]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex items-center gap-4 w-full mb-5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#B9B4FF]/10 border border-[#B9B4FF]/20 flex items-center justify-center relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
            <QrCode className="w-6 h-6 text-[#B9B4FF]" />
            {!participant?.attended && (
              <>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#B9B4FF] border-2 border-[#111115] animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#B9B4FF] border-2 border-[#111115]" />
              </>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[9px] font-black text-[#B9B4FF] uppercase tracking-[0.2em] mb-1">Acceso Registrado</div>
            <h4 className="text-white font-bold text-base leading-tight truncate">Mi Acceso</h4>
            <p className="text-white/30 text-xs truncate">Toca para abrir tu pase digital</p>
          </div>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowFullTicket(true);
          }}
          className="w-full py-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white font-bold text-xs tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer z-10"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B9B4FF]" />
          Ver Mi Acceso
        </button>
      </motion.div>
    );
  }

  // Fallback views (Not required / Generating / Failed)
  if (notRequired || isGenerating || isFailed) {
    return (
      <div className="w-full max-w-md mx-auto bg-[#111115] rounded-[2rem] border border-white/10 p-8 flex flex-col items-center justify-center min-h-[220px]">
        {notRequired ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
              <CheckCircle2 className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Registro Confirmado</h3>
            <p className="text-white/40 text-xs">Este evento no requiere boleto digital.</p>
          </div>
        ) : isGenerating ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#B9B4FF]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#B9B4FF]/20">
              <Loader2 className="w-8 h-8 text-[#B9B4FF] animate-spin" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">Preparando...</h3>
            <p className="text-white/40 text-xs">Generando tu boleto digital.</p>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-red-400 text-xs">Error al generar el boleto. Por favor contacta al organizador.</p>
          </div>
        )}
      </div>
    );
  }

  if (!participant) return null;

  // DEDICATED FULLSCREEN PAGE OVERLAY (Perfectly sized, Mobile-First, Scrollable Container)
  return (
    <AnimatePresence>
      {showFullTicket && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0B0B0E] z-[999] overflow-y-auto select-none bg-[radial-gradient(circle_at_center,rgba(185,180,255,0.03),transparent)]"
        >
          {/* Scroll wrapper container to enable natural scrolling on any height */}
          <div className="w-full min-h-full flex flex-col items-center justify-start p-4 sm:p-6 md:p-8 pb-16">
            
            {/* Top Bar / Navigation Control */}
            <div className="w-full max-w-sm flex items-center justify-between mb-5 flex-shrink-0">
              <button 
                onClick={() => setShowFullTicket(false)}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer focus:outline-none"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.25em]">Mi Boleto</span>
              <div className="w-10 h-10" /> {/* Spacer */}
            </div>

            {/* Premium Boarding Pass Card */}
            <motion.div 
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="w-full max-w-sm bg-[#111115] rounded-[2.2rem] border border-white/10 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative flex flex-col h-auto"
            >
              {/* Subtle Noise Texture Overlay (Premium) */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.015] bg-[url('data:image/svg+xml;utf8,<svg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/></svg>')]" />

              {/* 1️⃣ Hero Visual Pequeño (Luma/Spotify Vibe) - Super Compact */}
              <div className="relative h-24 w-full bg-black overflow-hidden border-b border-white/5 flex-shrink-0">
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
                    <div className="absolute -left-16 -top-16 w-40 h-40 rounded-full bg-[#B9B4FF]/10 blur-3xl" />
                    <div className="absolute -right-16 -bottom-16 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl" />
                    <Sparkles className="w-6 h-6 text-[#B9B4FF]/15" />
                  </div>
                )}

                {/* Elegant Dark Gradients on Cover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-[#111115]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#111115] to-transparent" />

                {/* 9️⃣ Dynamic Status Badge (Premium Live State) */}
                <div className="absolute top-4 right-4 z-20">
                  {participant.attended ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[8px] font-bold text-emerald-400 uppercase tracking-widest backdrop-blur-md shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      CHECKED IN
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B9B4FF]/10 border border-[#B9B4FF]/25 text-[8px] font-bold text-[#B9B4FF] uppercase tracking-widest backdrop-blur-md shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B9B4FF] animate-pulse" />
                      VALID ACCESS
                    </span>
                  )}
                </div>
              </div>

              {/* Top Details Block - Fluid and Compact */}
              <div className="p-6 pb-2 relative flex-shrink-0">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-[#B9B4FF]/60 uppercase tracking-[0.25em] mb-1">Boarding Pass</span>
                  {/* 2️⃣ Jerarquía del Nombre (Dominant Event Name) */}
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight bg-clip-text bg-gradient-to-r from-white via-white to-white/80 truncate">
                    {event.name}
                  </h2>
                </div>

                {/* Minimal Layout Details */}
                <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-4 text-[10px] text-white/60">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B9B4FF]" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B9B4FF]" />
                    <span>{time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-white/50">
                  <MapPin className="w-3.5 h-3.5 text-[#B9B4FF]/60 flex-shrink-0" />
                  <span className="truncate max-w-[280px]">{event.location}</span>
                </div>
              </div>

              {/* 4️⃣ Perforaciones del Ticket Premium (Real separation feel) */}
              <div className="flex items-center gap-3 px-1 relative z-10 my-1 flex-shrink-0">
                <div className="w-4 h-8 rounded-r-full bg-[#0B0B0E] border-r border-y border-white/10 -ml-1 shadow-[inset_-3px_0_5px_rgba(0,0,0,0.6)]" />
                <div className="flex-1 border-t border-dashed border-white/10 h-0" />
                <div className="w-4 h-8 rounded-l-full bg-[#0B0B0E] border-l border-y border-white/10 -mr-1 shadow-[inset_3px_0_5px_rgba(0,0,0,0.6)]" />
              </div>

              {/* Bottom Section (QR and Pin area - naturally sized) */}
              <div className="p-6 pt-3 bg-white/[0.01] flex flex-col items-center gap-5 pb-6">
                {/* 3️⃣ QR con Glow, Profundidad y Contenedor Glass (PROMINENT QR) */}
                <div className="relative group my-1 flex-shrink-0">
                  {/* Vibrant Radial soft glow behind QR */}
                  <div className="absolute inset-0 bg-[#B9B4FF]/10 rounded-[1.8rem] opacity-35 blur-2xl pointer-events-none" />
                  
                  {/* QR Border Gradient Wrapper (Large & prominent) */}
                  <div className="relative p-4 bg-white rounded-[1.8rem] shadow-[0_12px_35px_rgba(0,0,0,0.6)] border border-white/20 transition-all duration-300">
                    <img src={participant.ticketUrl} alt="QR Code" className="w-48 h-48 object-contain relative z-10" />
                    {/* Subtle inner card border */}
                    <div className="absolute inset-0 border border-black/5 rounded-[1.8rem] pointer-events-none" />
                  </div>
                </div>

                {/* 8️⃣ PIN copiable de Alta Importancia (Tap to Copy) */}
                {participant.accessPin && (
                  <div className="text-center w-full px-2 flex-shrink-0">
                    <div className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1.5">
                      PIN de Acceso Manual (Fallback)
                    </div>
                    <button 
                      onClick={handleCopyPin}
                      className="relative group w-full py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                    >
                      <span className="font-mono text-xs sm:text-sm font-black text-[#B9B4FF] tracking-[0.4em] pl-[0.4em]">
                        {participant.accessPin}
                      </span>
                      
                      <div className="absolute right-3 flex items-center gap-1.5 text-[8px] font-bold text-white/30 group-hover:text-white/60 transition-colors uppercase tracking-widest">
                        <AnimatePresence mode="wait">
                          {copied ? (
                            <motion.div 
                              key="copied"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1 text-emerald-400 font-bold"
                            >
                              <Check className="w-3 h-3 text-emerald-400" />
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
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </div>
                )}
                
                {/* 6️⃣ Botones Compactos e Integrados - Fully Accessible */}
                <div className="flex gap-3 w-full border-t border-white/5 pt-4 flex-shrink-0">
                  <button 
                    onClick={() => window.open(participant.ticketUrl, '_blank')}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white font-bold text-[10px] sm:text-xs transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descargar
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white font-bold text-[10px] sm:text-xs transition-all cursor-pointer">
                    <Share2 className="w-3.5 h-3.5" />
                    Compartir
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Footer Safety instructions / Hint outside ticket */}
            <div className="text-[9px] text-white/20 text-center uppercase tracking-[0.2em] mt-6 flex-shrink-0">
              Presenta este pase en el control de acceso
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
