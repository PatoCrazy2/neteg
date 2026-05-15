"use client";

import { useEffect, useState, useMemo } from "react";
import { eventApi } from "@/lib/api";
import { Event } from "@/types/event";
import { useDashboard } from "@/app/dashboard/layout";
import { EventCard } from "@/components/events/EventCard";
import { DigitalTicket } from "@/components/events/DigitalTicket";
import { EventDashboardPreview } from "@/components/events/EventDashboardPreview";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Calendar, Filter as FilterIcon, X, MapPin, Clock } from "lucide-react";

type Tab = 'attending' | 'created';
type Filter = 'upcoming' | 'past';

export default function EventsPage() {
  const { theme } = useDashboard();
  const [activeTab, setActiveTab] = useState<Tab>('attending');
  const [activeFilter, setActiveFilter] = useState<Filter>('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = activeTab === 'attending' 
          ? await eventApi.getParticipatingEvents() 
          : await eventApi.getMyEvents();
        setEvents(data);
      } catch (err: any) {
        setError(err.message || "Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [activeTab]);

  const groupedEvents = useMemo(() => {
    const now = new Date();
    const filtered = events.filter(event => {
      const eventDate = new Date(event.date);
      return activeFilter === 'upcoming' ? eventDate >= now : eventDate < now;
    });

    // Sort by date
    filtered.sort((a, b) => {
       const dateA = new Date(a.date).getTime();
       const dateB = new Date(b.date).getTime();
       return activeFilter === 'upcoming' ? dateA - dateB : dateB - dateA;
    });

    // Group by day
    const groups: { [key: string]: Event[] } = {};
    filtered.forEach(event => {
      const dateKey = new Date(event.date).toDateString();
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(event);
    });

    return Object.entries(groups).map(([date, events]) => ({
      date: new Date(date),
      events
    }));
  }, [events, activeFilter]);

  const formatDateLabel = (date: Date) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    if (date.toDateString() === now.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDayLabel = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="h-full flex flex-col px-4 sm:px-8 pt-8 overflow-hidden bg-black/20 backdrop-blur-3xl relative">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white/90">Your Schedule</h1>
           <p className="text-white/30 text-xs sm:text-sm font-medium">Keep track of your events and participations.</p>
        </div>
        
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#B9B4FF] text-black font-bold text-[11px] uppercase tracking-wider hover:bg-[#9C8CFF] transition-all shadow-[0_0_20px_rgba(185,180,255,0.3)]">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Create Event</span>
          <span className="sm:hidden">Create</span>
        </button>
      </div>

      {/* Segmented Controls & Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-white/[0.05]">
        <div className="flex bg-white/[0.03] border border-white/[0.08] p-1 rounded-2xl backdrop-blur-xl w-full sm:w-auto overflow-hidden">
          {(['attending', 'created'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all relative ${
                activeTab === tab ? 'text-black' : 'text-white/40 hover:text-white/60'
              }`}
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-[#B9B4FF] rounded-xl z-[-1]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab === 'attending' ? 'Attending' : 'My Events'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
           {/* Segmented Upcoming/Past */}
           <div className="flex bg-white/[0.03] border border-white/[0.08] p-1 rounded-xl">
              {(['upcoming', 'past'] as Filter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeFilter === f ? 'bg-white/10 text-white shadow-lg' : 'text-white/20 hover:text-white/40'
                  }`}
                >
                  {f}
                </button>
              ))}
           </div>

           <div className="h-8 w-px bg-white/5 mx-1" />

           <div className="flex items-center gap-2">
             <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <Search className="w-4 h-4" />
             </button>
             <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <FilterIcon className="w-4 h-4" />
             </button>
           </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar pb-10">
         <AnimatePresence mode="wait">
            {isLoading ? (
               <div className="flex flex-col items-center justify-center h-80 gap-5">
                  <div className="relative">
                    <div className="w-10 h-10 border-2 border-[#B9B4FF]/10 rounded-full" />
                    <div className="absolute inset-0 w-10 h-10 border-t-2 border-[#B9B4FF] rounded-full animate-spin" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B9B4FF]/40 animate-pulse">Syncing Calendar</span>
               </div>
            ) : groupedEvents.length === 0 ? (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="flex flex-col items-center justify-center py-32 text-center"
               >
                  <div className="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-center mb-6">
                    <Calendar className="w-7 h-7 text-white/10" />
                  </div>
                  <h3 className="text-white/60 font-bold tracking-tight text-lg mb-2">No events scheduled</h3>
                  <p className="text-white/20 text-sm max-w-xs mx-auto leading-relaxed">
                    Your {activeFilter} list is currently empty. Time to discover new experiences!
                  </p>
               </motion.div>
            ) : (
               <div className="max-w-4xl mx-auto space-y-12 pb-20">
                  {groupedEvents.map((group, groupIdx) => (
                    <div key={group.date.toDateString()} className="flex gap-4 sm:gap-10 relative">
                      {/* Timeline Left Column */}
                      <div className="w-16 sm:w-24 flex-shrink-0 pt-2 text-right">
                         <div className="text-sm sm:text-lg font-bold text-white/90 tracking-tighter leading-none mb-1">{formatDateLabel(group.date)}</div>
                         <div className="text-[9px] sm:text-[10px] text-white/20 font-bold uppercase tracking-[0.1em]">{formatDayLabel(group.date)}</div>
                      </div>

                      {/* Timeline Connector */}
                      <div className="absolute left-[76px] sm:left-[108px] top-4 bottom-[-48px] w-px bg-gradient-to-b from-white/10 via-white/[0.05] to-transparent">
                         <div className="absolute top-0 -left-[3px] w-1.5 h-1.5 rounded-full bg-white/20 border border-black" />
                      </div>

                      {/* Events for this day */}
                      <div className="flex-1 space-y-4">
                         {group.events.map((event) => (
                           <EventCard 
                             key={event.id}
                             event={event}
                             isCreator={activeTab === 'created'}
                             status={activeTab === 'created' ? 'creator' : 'going'}
                             onClick={() => setSelectedEvent(event)}
                           />
                         ))}
                      </div>
                    </div>
                  ))}
               </div>
            )}
         </AnimatePresence>
      </div>

      {/* Side Detail Panel (Sheet) */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 h-full w-full max-w-md bg-[#0B0B0E] border-l border-white/10 z-50 shadow-2xl flex flex-col"
            >
              {/* Panel Header */}
              <div className="p-6 flex items-center justify-between border-b border-white/5">
                 <button 
                   onClick={() => setSelectedEvent(null)}
                   className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
                 >
                   <X className="w-5 h-5" />
                 </button>
                 <div className="text-center">
                    <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Detalles del Evento</div>
                    <div className="text-xs font-bold text-white max-w-[200px] truncate">{selectedEvent.name}</div>
                 </div>
                 <div className="w-10 h-10" /> {/* Spacer */}
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                 <div className="mb-8">
                   <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 mb-6">
                      {selectedEvent.coverImageUrl ? (
                        <img src={selectedEvent.coverImageUrl} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/10 italic text-sm">Sin imagen</div>
                      )}
                   </div>
                   
                   <h3 className="text-2xl font-bold text-white tracking-tight mb-4">{selectedEvent.name}</h3>
                   
                   <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-white/60 text-sm">
                        <MapPin className="w-4 h-4 text-[#B9B4FF]" />
                        {selectedEvent.location}
                      </div>
                      <div className="flex items-center gap-3 text-white/60 text-sm">
                        <Clock className="w-4 h-4 text-[#B9B4FF]" />
                        {new Date(selectedEvent.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                      </div>
                   </div>
                 </div>

                 <div className="h-px w-full bg-white/5 mb-8" />

                 {/* Conditional Component View */}
                 {activeTab === 'created' ? (
                   <EventDashboardPreview event={selectedEvent} />
                 ) : (
                   <DigitalTicket event={selectedEvent} />
                 )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(185, 180, 255, 0.2); }
      `}</style>
    </div>
  );
}
