"use client";

import { useEffect, useState, useMemo } from "react";
import { eventApi } from "@/lib/api";
import { Event } from "@/types/event";
import { useDashboard } from "@/app/dashboard/layout";

type Tab = 'attending' | 'created';
type Filter = 'upcoming' | 'past';

export default function EventsPage() {
  const { theme } = useDashboard();
  const [activeTab, setActiveTab] = useState<Tab>('attending');
  const [activeFilter, setActiveFilter] = useState<Filter>('upcoming');
  const [events, setEvents] = useState<Event[]>([]);
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

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter(event => {
      const eventDate = new Date(event.date);
      if (activeFilter === 'upcoming') {
        return eventDate >= now;
      } else {
        return eventDate < now;
      }
    });
  }, [events, activeFilter]);

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className={`text-4xl font-bold tracking-tight mb-2 ${theme === 'light' ? 'text-black' : 'text-white'}`}>
            Mis Eventos
          </h1>
          <p className="text-white/40 text-sm">Gestiona tus participaciones y creaciones.</p>
        </div>

        <div className="flex bg-white/5 border border-white/10 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('attending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'attending' 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            Como Asistente
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'created' 
                ? 'bg-white/10 text-white shadow-lg' 
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            Mis Creaciones
          </button>
        </div>
      </div>

      {/* Sub-Filters (Upcoming / Past) */}
      <div className="flex gap-4 mb-6 border-b border-white/5">
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`pb-3 px-1 text-sm font-medium relative transition-all ${
            activeFilter === 'upcoming' ? 'text-white' : 'text-white/30 hover:text-white/50'
          }`}
        >
          Próximos
          {activeFilter === 'upcoming' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B9B4FF] shadow-[0_0_8px_rgba(185,180,255,0.8)]" />
          )}
        </button>
        <button
          onClick={() => setActiveFilter('past')}
          className={`pb-3 px-1 text-sm font-medium relative transition-all ${
            activeFilter === 'past' ? 'text-white' : 'text-white/30 hover:text-white/50'
          }`}
        >
          Pasados
          {activeFilter === 'past' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20" />
          )}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-8 h-8 border-2 border-[#B9B4FF] border-t-transparent rounded-full animate-spin" />
            <p className="text-white/40 text-sm animate-pulse">Cargando eventos...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 text-sm">
            Error: {error}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
            <p className="text-white/20 text-lg mb-2">No se encontraron eventos</p>
            <p className="text-white/10 text-sm">
              {activeFilter === 'upcoming' 
                ? "Parece que no tienes eventos próximos en esta sección." 
                : "No hay eventos pasados que mostrar."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <div 
                key={event.id}
                className="group bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/[0.08] transition-all"
              >
                <div className="aspect-video bg-white/5 rounded-xl mb-4 overflow-hidden relative">
                   {/* Placeholder for cover image */}
                   <div className="absolute inset-0 flex items-center justify-center text-white/10 italic text-sm">
                     {event.coverImageUrl ? "Cargando imagen..." : "Sin imagen"}
                   </div>
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-[#B9B4FF] transition-colors">{event.name}</h3>
                <div className="flex items-center gap-2 text-white/40 text-xs mb-3">
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{event.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    activeFilter === 'upcoming' ? 'bg-green-500/10 text-green-400' : 'bg-white/10 text-white/40'
                  }`}>
                    {activeFilter === 'upcoming' ? 'Confirmado' : 'Finalizado'}
                  </span>
                  <button className="text-white/40 hover:text-white text-xs transition-colors underline underline-offset-4">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
