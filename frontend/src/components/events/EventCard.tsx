"use client";

import { Event } from "@/types/event";
import { MapPin, Globe, User, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface EventCardProps {
  event: Event;
  isCreator?: boolean;
  onClick?: () => void;
  status?: 'invited' | 'going' | 'creator';
}

export function EventCard({ event, isCreator, onClick, status }: EventCardProps) {
  const date = new Date(event.date);
  const time = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className="group relative cursor-pointer w-full"
    >
      {/* Card Surface */}
      <div className="relative flex bg-[#0B0B0E]/40 hover:bg-white/[0.03] backdrop-blur-md border border-white/[0.05] hover:border-white/10 rounded-2xl p-3 sm:p-4 transition-all duration-300">
        
        {/* Content Section (Left) */}
        <div className="flex-1 flex flex-col min-w-0 pr-4">
          {/* Time & Meta */}
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center gap-1.5 text-[#B9B4FF] text-[11px] font-bold tracking-wider uppercase">
              <Clock className="w-3 h-3" />
              {time}
            </div>
            {status && (
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                status === 'creator' ? 'bg-[#B9B4FF]/10 text-[#B9B4FF] border border-[#B9B4FF]/20' :
                status === 'going' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                'bg-white/10 text-white/60 border border-white/10'
              }`}>
                {status}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-white leading-tight mb-2 group-hover:text-[#B9B4FF] transition-colors line-clamp-2">
            {event.name}
          </h3>

          {/* Organizer & Attendees */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <div className="w-5 h-5 rounded-full bg-white/10 border border-white/5 flex items-center justify-center overflow-hidden">
                <User className="w-3 h-3" />
              </div>
              <span className="truncate max-w-[120px]">{event.organizerName || 'Organizador'}</span>
            </div>

            {/* Fake Attendees Overlap */}
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-5 h-5 rounded-full bg-[#1A1A1F] border-2 border-[#0B0B0E] flex items-center justify-center overflow-hidden">
                   <div className={`w-full h-full bg-gradient-to-br ${i === 1 ? 'from-purple-500/20' : i === 2 ? 'from-blue-500/20' : 'from-indigo-500/20'} to-transparent`} />
                </div>
              ))}
              <div className="w-5 h-5 rounded-full bg-white/5 border-2 border-[#0B0B0E] flex items-center justify-center text-[8px] font-bold text-white/40">
                +12
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-white/30 text-[11px] font-medium truncate mt-auto">
            {event.location.toLowerCase().includes('http') ? <Globe className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Thumbnail Section (Right) */}
        <div className="flex-shrink-0 w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-white/[0.02] border border-white/[0.05] relative">
          {event.coverImageUrl ? (
            <img 
              src={event.coverImageUrl} 
              alt={event.name}
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#B9B4FF]/5 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#B9B4FF] animate-pulse" />
              </div>
            </div>
          )}
          
          {/* Subtle Overlay Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </motion.div>
  );
}
