"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Users, 
  AlignLeft, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  Camera,
  Globe,
  Lock,
  Palette,
  Settings2,
  Clock
} from "lucide-react";
import { useDashboard } from "@/app/dashboard/layout";
import { eventApi } from "@/lib/api";
import { LocationInput } from "@/components/ui/LocationInput";

export default function DashboardPage() {
  const { theme, setTheme } = useDashboard();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    description: "",
    capacity: "",
    requiresApproval: false,
    isPublic: true,
  });

  const isLight = theme === 'light';

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!formData.name || !formData.date || !formData.time || !formData.location) {
      alert("Por favor completa los campos obligatorios (Nombre, Fecha, Hora y Ubicación)");
      return;
    }

    setLoading(true);
    try {
      // Combinar fecha y hora para el backend
      const combinedDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      const payload = {
        name: formData.name,
        description: formData.description,
        date: combinedDateTime,
        location: formData.location
      };
      
      await eventApi.createEvent(payload);
      alert("¡Evento creado con éxito!");
      
      setFormData({
        name: "",
        date: "",
        time: "",
        location: "",
        description: "",
        capacity: "",
        requiresApproval: false,
        isPublic: true,
      });
    } catch (error) {
      console.error("Error creating event", error);
      alert(`Error al crear el evento: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full flex justify-center p-8 lg:p-12 transition-colors duration-700 overflow-hidden">
      <div className="w-full max-w-6xl h-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Columna Izquierda: Panel Visual (40%) - Fijo */}
        <div className="lg:col-span-5 space-y-8 h-full flex flex-col">
          <div className="space-y-4">
            <div className={`group relative aspect-video w-full rounded-3xl overflow-hidden transition-all duration-500 border ${
              isLight ? 'bg-black/5 border-black/5 hover:border-black/20' : 'bg-white/[0.03] border-white/5 hover:border-[#B9B4FF]/30'
            }`}>
              <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-all ${
                isLight ? 'text-black/10 group-hover:text-black/40' : 'text-white/10 group-hover:text-[#B9B4FF]/40'
              }`}>
                <Camera size={24} strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Imagen de Portada</span>
              </div>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="flex gap-2">
                <button 
                  onClick={() => setTheme('default')}
                  title="Plasma Theme"
                  className={`w-6 h-6 rounded-full border transition-all bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 ${theme === 'default' ? 'ring-2 ring-[#B9B4FF] scale-110' : 'border-white/10 opacity-50 hover:opacity-100'}`} 
                />
                <button 
                  onClick={() => setTheme('black')}
                  title="Pure Black"
                  className={`w-6 h-6 rounded-full border transition-all bg-black ${theme === 'black' ? 'ring-2 ring-white scale-110' : 'border-white/10 opacity-50 hover:opacity-100'}`} 
                />
                <button 
                  onClick={() => setTheme('light')}
                  title="Light Mode"
                  className={`w-6 h-6 rounded-full border transition-all bg-white ${theme === 'light' ? 'ring-2 ring-black scale-110' : 'border-black/10 opacity-50 hover:opacity-100'}`} 
                />
                <div className={`h-6 w-px mx-1 ${isLight ? 'bg-black/10' : 'bg-white/10'}`} />
                <button className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${
                  isLight ? 'bg-black/5 border-black/10 text-black/40 hover:text-black' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                }`}>
                  <Palette size={12} /> Temas
                </button>
              </div>
              <button className={`text-[10px] font-bold uppercase tracking-widest transition-all ${
                isLight ? 'text-black/20 hover:text-black' : 'text-white/20 hover:text-white'
              }`}>
                Vista Previa
              </button>
            </div>
          </div>

          <div className={`p-6 rounded-3xl border transition-all duration-500 ${
            isLight ? 'bg-black/[0.02] border-black/5' : 'bg-white/[0.02] border-white/5'
          }`}>
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-4 ${isLight ? 'text-black/20' : 'text-white/20'}`}>Estado Actual</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className={`text-[10px] ${isLight ? 'text-black/40' : 'text-white/40'}`}>Estado</p>
                <p className="text-xs font-medium text-[#B9B4FF]">Borrador</p>
              </div>
              <div className="space-y-1">
                <p className={`text-[10px] ${isLight ? 'text-black/40' : 'text-white/40'}`}>Visibilidad</p>
                <p className={`text-xs font-medium ${isLight ? 'text-black/60' : 'text-white/60'}`}>
                  {formData.isPublic ? 'Público' : 'Solo Invitados'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Configuración (60%) - Con Scroll */}
        <div className="lg:col-span-7 space-y-8 h-full overflow-y-auto pr-6 pb-20 no-scrollbar">
          <style jsx>{`
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .no-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          
          {/* Metadata Header - Badges Interactivos */}
          <div className={`flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] ${
            isLight ? 'text-black/30' : 'text-white/30'
          }`}>
            <button 
              type="button"
              onClick={() => setFormData({...formData, isPublic: true})}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all ${
                formData.isPublic 
                  ? (isLight ? 'bg-black text-white border-black' : 'bg-[#B9B4FF]/20 border-[#B9B4FF]/40 text-[#B9B4FF]') 
                  : (isLight ? 'bg-black/5 border-black/5 text-black/30 hover:text-black' : 'bg-white/5 border-white/5 text-white/30 hover:text-white')
              }`}
            >
              <Globe size={12} className={formData.isPublic ? 'text-[#B9B4FF]' : ''} /> Evento Público
            </button>
            <button 
              type="button"
              onClick={() => setFormData({...formData, isPublic: false})}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all ${
                !formData.isPublic 
                  ? (isLight ? 'bg-black text-white border-black' : 'bg-white/10 border-white/20 text-white') 
                  : (isLight ? 'bg-black/5 border-black/5 text-black/30 hover:text-black' : 'bg-white/5 border-white/5 text-white/30 hover:text-white')
              }`}
            >
              <Lock size={12} /> Solo Invitados
            </button>
          </div>

          {/* Nombre del Evento (Editable Heading) */}
          <div className="space-y-2">
            <input 
              type="text"
              placeholder="Nombre del evento..."
              className={`w-full bg-transparent border-none p-0 text-5xl font-bold focus:outline-none tracking-tight leading-tight transition-colors ${
                isLight ? 'placeholder:text-black/10 text-black' : 'placeholder:text-white/5 text-white'
              }`}
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Controles Integrados - Fecha y Hora */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1.5">
              <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
                isLight ? 'text-black/20' : 'text-white/20'
              }`}>
                <Calendar size={12} /> Fecha
              </label>
              <input 
                type="date"
                style={{ colorScheme: isLight ? 'light' : 'dark' }}
                className={`w-full bg-transparent border-none p-0 text-[15px] font-medium focus:outline-none transition-all ${
                  isLight ? 'text-black/80' : 'text-white/80'
                }`}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
                isLight ? 'text-black/20' : 'text-white/20'
              }`}>
                <Clock size={12} /> Hora
              </label>
              <input 
                type="time"
                style={{ colorScheme: isLight ? 'light' : 'dark' }}
                className={`w-full bg-transparent border-none p-0 text-[15px] font-medium focus:outline-none transition-all ${
                  isLight ? 'text-black/80' : 'text-white/80'
                }`}
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              />
            </div>
          </div>

          {/* Ubicación (Ancho Completo) */}
          <div className="pt-2">
            <LocationInput 
              value={formData.location}
              onChange={(val) => setFormData({...formData, location: val})}
              isLight={isLight}
            />
          </div>

          <div className="space-y-2">
            <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${
              isLight ? 'text-black/20' : 'text-white/20'
            }`}>
              <AlignLeft size={12} /> Descripción
            </label>
            <textarea 
              placeholder="¿De qué trata este evento?"
              rows={4}
              className={`w-full bg-transparent border-none p-0 text-[15px] leading-relaxed focus:outline-none transition-all resize-none ${
                isLight ? 'text-black/60 placeholder:text-black/5' : 'text-white/60 placeholder:text-white/5'
              }`}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Lista de Preferencias */}
          <div className={`pt-6 border-t space-y-1 ${isLight ? 'border-black/5' : 'border-white/5'}`}>
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${
              isLight ? 'text-black/20' : 'text-white/20'
            }`}>
              <Settings2 size={12} /> Preferencias
            </h4>
            
            <div className="space-y-1">
              <div className={`flex items-center justify-between py-3 px-3 -mx-3 rounded-xl transition-all hover:bg-black/5`}>
                <div className="flex items-center gap-3">
                  <Users size={16} className={isLight ? 'text-black/20' : 'text-white/20'} />
                  <span className={`text-sm ${isLight ? 'text-black/60' : 'text-white/60'}`}>Capacidad (Opcional en DB)</span>
                </div>
                <input 
                  type="number"
                  placeholder="Sin límite"
                  className={`border rounded-lg px-3 py-1 text-xs w-24 text-right focus:outline-none focus:border-[#B9B4FF]/50 ${
                    isLight ? 'bg-black/5 border-black/10 text-black' : 'bg-white/5 border-white/10 text-white'
                  }`}
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                />
              </div>

              <div className={`flex items-center justify-between py-3 px-3 -mx-3 rounded-xl transition-all hover:bg-black/5`}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className={formData.requiresApproval ? 'text-[#B9B4FF]' : (isLight ? 'text-black/20' : 'text-white/20')} />
                  <span className={`text-sm ${isLight ? 'text-black/60' : 'text-white/60'}`}>Aprobación Manual</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, requiresApproval: !formData.requiresApproval})}
                  className={`w-8 h-4 rounded-full relative transition-colors ${formData.requiresApproval ? 'bg-[#B9B4FF]' : (isLight ? 'bg-black/10' : 'bg-white/10')}`}
                >
                  <motion.div 
                    animate={{ x: formData.requiresApproval ? 18 : 2 }}
                    className="absolute top-1 w-2.5 h-2.5 rounded-full bg-white"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Botón de Acción */}
          <div className="pt-4">
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              disabled={loading}
              className={`group flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 ${
                isLight ? 'bg-black text-white hover:bg-[#B9B4FF] hover:text-black' : 'bg-white text-black hover:bg-[#B9B4FF]'
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : (
                <>
                  Crear Evento
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  );
}
