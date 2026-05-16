"use client";

import { Event } from "@/types/event";
import { ParticipantResponse } from "@/types/participant";
import { motion } from "framer-motion";
import { QrCode, MapPin, Calendar, Clock, User, Share2, Download, Loader2, CheckCircle2 } from "lucide-react";

interface DigitalTicketProps {
  event: Event;
  participant?: ParticipantResponse;
}

export function DigitalTicket({ event, participant }: DigitalTicketProps) {
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

  const isGenerating = participant?.ticketStatus === 'Pending' || participant?.ticketStatus === 'Processing';
  const isFailed = participant?.ticketStatus === 'Failed';
  const isCompleted = participant?.ticketStatus === 'Completed' && participant?.ticketUrl;
  const notRequired = !event.generateTickets || participant?.ticketStatus === 'NotRequired';

  return (
    <div className="flex flex-col gap-6">
      {/* Ticket Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-[#1A1A1F] rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl"
      >
        {/* Top Header */}
        <div className="p-8 pb-4 relative">
          <div className="flex justify-between items-start mb-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#B9B4FF] uppercase tracking-[0.2em] mb-1">Boarding Pass</span>
              <h2 className="text-2xl font-bold text-white tracking-tight leading-none">{event.name}</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <User className="w-5 h-5 text-white/40" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-6">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Fecha</span>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Calendar className="w-3.5 h-3.5 text-[#B9B4FF]" />
                {formattedDate}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Hora</span>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Clock className="w-3.5 h-3.5 text-[#B9B4FF]" />
                {time}
              </div>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest mb-1">Ubicación</span>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <MapPin className="w-3.5 h-3.5 text-[#B9B4FF]" />
                <span className="truncate">{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Perforated Line */}
        <div className="flex items-center gap-2 px-1 relative">
          <div className="w-4 h-8 rounded-r-full bg-[#0B0B0E] border-y border-r border-white/10 -ml-1" />
          <div className="flex-1 border-t-2 border-dashed border-white/10" />
          <div className="w-4 h-8 rounded-l-full bg-[#0B0B0E] border-y border-l border-white/10 -mr-1" />
        </div>

        {/* Bottom Section (Content depending on status) */}
        <div className="p-8 pt-6 bg-white/[0.02] flex flex-col items-center">
          {notRequired ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Registro Confirmado</h3>
              <p className="text-white/40 text-xs">Este evento no requiere boleto digital.</p>
            </div>
          ) : isGenerating ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-[#B9B4FF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-[#B9B4FF] animate-spin" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Generando tu boleto...</h3>
              <p className="text-white/40 text-xs">Esto tomará solo unos segundos.</p>
            </div>
          ) : isFailed ? (
            <div className="text-center py-10">
              <p className="text-red-400 text-xs">Error al generar el boleto. Por favor contacta al organizador.</p>
            </div>
          ) : isCompleted ? (
            <>
              <div className="p-4 bg-white rounded-3xl mb-4 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <img src={participant.ticketUrl} alt="QR Code" className="w-32 h-32" />
              </div>
              <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.3em] mb-6">
                #{participant.id.slice(0, 8).toUpperCase()}
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => window.open(participant.ticketUrl, '_blank')}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Descargar
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs hover:bg-white/10 transition-all">
                  <Share2 className="w-4 h-4" />
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
        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
          <h4 className="text-white font-bold text-sm mb-3">Información para el ingreso</h4>
          <ul className="space-y-2">
            <li className="text-xs text-white/40 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B9B4FF] mt-1.5" />
              Llega al menos 15 minutos antes de la hora programada.
            </li>
            <li className="text-xs text-white/40 flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#B9B4FF] mt-1.5" />
              Muestra este código QR en la entrada para validar tu asistencia.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

