"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Clock,
  Plus,
  Minus,
  Copy,
  Link as LinkIcon,
  Ticket
} from "lucide-react";
import { useDashboard } from "@/app/dashboard/layout";
import { eventApi } from "@/lib/api";
import { LocationInput } from "@/components/ui/LocationInput";
import { FormBuilder, FormQuestion } from "@/components/events/FormBuilder";
import { DatePicker } from "@/components/ui/DatePicker";
import { TimePicker } from "@/components/ui/TimePicker";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

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
    generateTickets: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const [showFormModal, setShowFormModal] = useState(false);
  const [formSchema, setFormSchema] = useState<FormQuestion[]>([]);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);

  const isLight = theme === 'light';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleNext = (e: React.FormEvent) => {
    if (e) e.preventDefault();

    const errors: Record<string, string> = {};
    if (!formData.name) errors.name = "Requerido";
    if (!formData.date) errors.date = "Requerido";
    if (!formData.time) errors.time = "Requerido";
    if (!formData.location) errors.location = "Requerido";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setShowFormModal(true);
  };

  const handleCreateEvent = async () => {
    setLoading(true);
    try {
      const combinedDateTime = new Date(`${formData.date}T${formData.time}`).toISOString();

      const payload = {
        name: formData.name,
        description: formData.description,
        date: combinedDateTime,
        location: formData.location,
        isPublic: formData.isPublic,
        requiresApproval: formData.requiresApproval,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
        formSchema: JSON.stringify(formSchema),
        generateTickets: formData.generateTickets
      };

      const createdEvent = await eventApi.createEvent(payload);

      if (selectedFile) {
        await eventApi.uploadCoverImage(createdEvent.id, selectedFile);
      }

      setCreatedEventId(createdEvent.id);
      setShowFormModal(false);
      setShowSuccess(true);

      setFormData({
        name: "",
        date: "",
        time: "",
        location: "",
        description: "",
        capacity: "",
        requiresApproval: false,
        isPublic: true,
        generateTickets: true,
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setFormSchema([]);
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
            <div className={`group relative aspect-video w-full rounded-3xl overflow-hidden transition-all duration-500 border ${isLight ? 'bg-black/5 border-black/10 hover:border-black/20' : 'bg-white/[0.04] border-white/10 hover:border-[#B9B4FF]/40'
              }`}>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className={`absolute inset-0 flex flex-col items-center justify-center gap-3 transition-all ${isLight ? 'text-black/20 group-hover:text-black/50' : 'text-white/30 group-hover:text-[#B9B4FF]/60'
                  }`}>
                  <Camera size={24} strokeWidth={1.5} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Imagen de Portada</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
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
                <div className={`h-6 w-px mx-1 ${isLight ? 'bg-black/10' : 'bg-white/15'}`} />
                <button className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold transition-all ${isLight ? 'bg-black/5 border-black/10 text-black/50 hover:text-black' : 'bg-white/5 border-white/15 text-white/60 hover:text-white'
                  }`}>
                  <Palette size={12} /> Temas
                </button>
              </div>
              <button className={`text-[10px] font-bold uppercase tracking-widest transition-all ${isLight ? 'text-black/40 hover:text-black' : 'text-white/40 hover:text-white'
                }`}>
                Vista Previa
              </button>
            </div>
          </div>

          <div className={`p-6 rounded-3xl border transition-all duration-500 ${isLight ? 'bg-black/[0.03] border-black/10' : 'bg-white/[0.04] border-white/10'
            }`}>
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-4 ${isLight ? 'text-black/40' : 'text-white/50'}`}>Estado Actual</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className={`text-[10px] ${isLight ? 'text-black/50' : 'text-white/60'}`}>Estado</p>
                <p className="text-xs font-medium text-[#B9B4FF]">Borrador</p>
              </div>
              <div className="space-y-1">
                <p className={`text-[10px] ${isLight ? 'text-black/50' : 'text-white/60'}`}>Visibilidad</p>
                <p className={`text-xs font-medium ${isLight ? 'text-black/70' : 'text-white/80'}`}>
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
          <div className={`flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] ${isLight ? 'text-black/50' : 'text-white/50'
            }`}>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isPublic: true })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all ${formData.isPublic
                ? (isLight ? 'bg-black text-white border-black' : 'bg-[#B9B4FF]/20 border-[#B9B4FF]/40 text-[#B9B4FF]')
                : (isLight ? 'bg-black/5 border-black/10 text-black/40 hover:text-black' : 'bg-white/5 border-white/10 text-white/40 hover:text-white')
                }`}
            >
              <Globe size={12} className={formData.isPublic ? 'text-[#B9B4FF]' : ''} /> Evento Público
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isPublic: false })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all ${!formData.isPublic
                ? (isLight ? 'bg-black text-white border-black' : 'bg-white/10 border-white/20 text-white')
                : (isLight ? 'bg-black/5 border-black/10 text-black/40 hover:text-black' : 'bg-white/5 border-white/10 text-white/40 hover:text-white')
                }`}
            >
              <Lock size={12} /> Solo Invitados
            </button>
          </div>

          {/* Nombre del Evento (Editable Heading) */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Nombre del evento"
              className={`w-full bg-transparent border-none p-0 text-5xl font-bold focus:outline-none tracking-tight leading-tight transition-colors ${isLight ? 'placeholder:text-black/20 text-black' : 'placeholder:text-white/25 text-white'
                } ${formErrors.name ? 'placeholder:text-red-400/50 text-red-400' : ''}`}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
              }}
            />
            {formErrors.name && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs font-bold uppercase tracking-widest">
                El nombre del evento es obligatorio
              </motion.p>
            )}
          </div>

          {/* Controles Integrados - Fecha y Hora */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-1.5">
              <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${formErrors.date ? 'text-red-400' : (isLight ? 'text-black/50' : 'text-white/50')
                }`}>
                <Calendar size={12} /> Fecha
              </label>
              <div className={formErrors.date ? 'ring-1 ring-red-400/50 rounded-lg p-1 -mx-1' : ''}>
                <DatePicker
                  value={formData.date}
                  onChange={(val) => {
                    setFormData({ ...formData, date: val });
                    if (formErrors.date) setFormErrors({ ...formErrors, date: '' });
                  }}
                  isLight={isLight}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${formErrors.time ? 'text-red-400' : (isLight ? 'text-black/50' : 'text-white/50')
                }`}>
                <Clock size={12} /> Hora
              </label>
              <div className={formErrors.time ? 'ring-1 ring-red-400/50 rounded-lg p-1 -mx-1' : ''}>
                <TimePicker
                  value={formData.time}
                  selectedDate={formData.date}
                  onChange={(val) => {
                    setFormData({ ...formData, time: val });
                    if (formErrors.time) setFormErrors({ ...formErrors, time: '' });
                  }}
                  isLight={isLight}
                />
              </div>
            </div>
          </div>

          {/* Ubicación (Ancho Completo) */}
          <div className="pt-2">
            <div className={formErrors.location ? 'ring-1 ring-red-400/50 rounded-lg p-1 -mx-1' : ''}>
              <LocationInput
                value={formData.location}
                onChange={(val) => {
                  setFormData({ ...formData, location: val });
                  if (formErrors.location) setFormErrors({ ...formErrors, location: '' });
                }}
                isLight={isLight}
              />
            </div>
            {formErrors.location && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs font-bold uppercase tracking-widest mt-2">
                Requerido
              </motion.p>
            )}
          </div>

          <div className="space-y-2 pt-2">
            <label className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-black/50' : 'text-white/50'
              }`}>
              <AlignLeft size={12} /> Descripción
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(val) => setFormData({ ...formData, description: val })}
              placeholder="Describe de qué trata este evento. Usa el menú superior para aplicar formato..."
              isLight={isLight}
            />
          </div>

          {/* Lista de Preferencias */}
          <div className={`pt-6 border-t space-y-1 ${isLight ? 'border-black/10' : 'border-white/10'}`}>
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-2 ${isLight ? 'text-black/50' : 'text-white/50'
              }`}>
              <Settings2 size={12} /> Preferencias
            </h4>

            <div className="space-y-1">
              <div className={`flex items-center justify-between py-3 px-3 -mx-3 rounded-xl transition-all hover:bg-white/5`}>
                <div className="flex items-center gap-3">
                  <Users size={16} className={isLight ? 'text-black/40' : 'text-white/40'} />
                  <span className={`text-sm ${isLight ? 'text-black/70' : 'text-white/70'}`}>Capacidad</span>
                </div>
                <div className={`flex items-center gap-1 border rounded-xl overflow-hidden p-1 ${isLight ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'
                  }`}>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      capacity: prev.capacity && parseInt(prev.capacity) > 1 ? String(parseInt(prev.capacity) - 1) : ""
                    }))}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${isLight ? 'text-black/60 hover:bg-black/5' : 'text-white/60 hover:bg-white/5'
                      }`}
                  >
                    <Minus size={14} />
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="∞"
                    className={`w-12 h-7 bg-transparent border-none text-center text-xs font-bold focus:outline-none focus:ring-0 ${isLight ? 'text-black placeholder:text-black/30' : 'text-white placeholder:text-white/30'
                      }`}
                    value={formData.capacity}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, ''); // Solo números
                      setFormData({ ...formData, capacity: val });
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      capacity: prev.capacity ? String(parseInt(prev.capacity) + 1) : "1"
                    }))}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all ${isLight ? 'text-black/60 hover:bg-black/5' : 'text-white/60 hover:bg-white/5'
                      }`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className={`flex items-center justify-between py-3 px-3 -mx-3 rounded-xl transition-all hover:bg-white/5`}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className={formData.requiresApproval ? 'text-[#B9B4FF]' : (isLight ? 'text-black/40' : 'text-white/40')} />
                  <span className={`text-sm ${isLight ? 'text-black/70' : 'text-white/70'}`}>Aprobación Manual</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, requiresApproval: !formData.requiresApproval })}
                  className={`w-8 h-4 rounded-full relative transition-colors ${formData.requiresApproval ? 'bg-[#B9B4FF]' : (isLight ? 'bg-black/10' : 'bg-white/10')}`}
                >
                  <motion.div
                    animate={{ x: formData.requiresApproval ? 18 : 2 }}
                    className="absolute top-1 w-2.5 h-2.5 rounded-full bg-white"
                  />
                </button>
              </div>

              <div className={`flex flex-col py-3 px-3 -mx-3 rounded-xl transition-all hover:bg-white/5`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Ticket size={16} className={formData.generateTickets ? 'text-[#B9B4FF]' : (isLight ? 'text-black/40' : 'text-white/40')} />
                    <span className={`text-sm ${isLight ? 'text-black/70' : 'text-white/70'}`}>Generar Boletos QR</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, generateTickets: !formData.generateTickets })}
                    className={`w-8 h-4 rounded-full relative transition-colors ${formData.generateTickets ? 'bg-[#B9B4FF]' : (isLight ? 'bg-black/10' : 'bg-white/10')}`}
                  >
                    <motion.div
                      animate={{ x: formData.generateTickets ? 18 : 2 }}
                      className="absolute top-1 w-2.5 h-2.5 rounded-full bg-white"
                    />
                  </button>
                </div>
                <p className={`text-[10px] mt-2 leading-relaxed ${isLight ? 'text-black/40' : 'text-white/40'}`}>
                  Activa esta opción para eventos presenciales donde necesites escarnecer accesos en puerta. Desactívala para eventos virtuales o reuniones casuales.
                </p>
              </div>
            </div>
          </div>

          {/* Botón de Acción */}
          <div className="pt-4 flex items-center justify-between">
            {Object.keys(formErrors).length > 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs font-bold uppercase tracking-widest">
                Faltan campos obligatorios
              </motion.p>
            )}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleNext}
              disabled={loading}
              className={`group flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 ml-auto ${isLight ? 'bg-black text-white hover:bg-[#B9B4FF] hover:text-black' : 'bg-white text-black hover:bg-[#B9B4FF]'
                }`}
            >
              Siguiente
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>

        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showFormModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`flex flex-col w-full max-w-2xl max-h-[90vh] rounded-[2rem] border overflow-hidden shadow-2xl ${isLight ? 'bg-white border-black/10' : 'bg-[#111114] border-white/10'
                }`}
            >
              <div className="p-6 overflow-y-auto flex-1 no-scrollbar">
                <h3 className={`text-xl font-bold mb-6 ${isLight ? 'text-black' : 'text-white'}`}>
                  Configura el Formulario de Registro
                </h3>
                <FormBuilder value={formSchema} onChange={setFormSchema} isLight={isLight} />
              </div>
              <div className={`p-4 border-t flex justify-end gap-3 ${isLight ? 'border-black/10 bg-black/5' : 'border-white/10 bg-white/5'}`}>
                <button
                  onClick={() => setShowFormModal(false)}
                  className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all ${isLight ? 'text-black/60 hover:text-black hover:bg-black/5' : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                >
                  Volver
                </button>
                <button
                  onClick={handleCreateEvent}
                  disabled={loading}
                  className={`flex items-center gap-2 px-8 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 ${isLight ? 'bg-black text-white hover:bg-[#B9B4FF] hover:text-black' : 'bg-white text-black hover:bg-[#B9B4FF]'
                    }`}
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : 'Finalizar Evento'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de Éxito Animado */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`border p-8 rounded-[2rem] flex flex-col items-center text-center max-w-sm w-full shadow-2xl ${isLight ? 'bg-white border-black/10' : 'bg-[#111114] border-white/10'
                }`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring" }}
                className="w-20 h-20 bg-[#B9B4FF]/20 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 size={40} className="text-[#B9B4FF]" />
              </motion.div>
              <h2 className={`text-2xl font-bold mb-2 tracking-tight ${isLight ? 'text-black' : 'text-white'}`}>
                ¡Evento Creado!
              </h2>
              <p className={`mb-6 text-sm leading-relaxed ${isLight ? 'text-black/60' : 'text-white/60'}`}>
                Tu evento ha sido guardado exitosamente. Comparte el siguiente enlace con tus invitados:
              </p>

              <div className={`w-full flex items-center gap-2 p-3 mb-8 rounded-xl border ${isLight ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'
                }`}>
                <LinkIcon size={16} className={isLight ? 'text-black/40' : 'text-white/40'} />
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/e/${createdEventId}`}
                  className={`flex-1 bg-transparent border-none text-xs outline-none ${isLight ? 'text-black' : 'text-white'}`}
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/e/${createdEventId}`);
                    alert("Enlace copiado al portapapeles");
                  }}
                  className={`p-1.5 rounded-md transition-colors ${isLight ? 'hover:bg-black/10 text-black/60 hover:text-black' : 'hover:bg-white/10 text-white/60 hover:text-white'
                    }`}
                  title="Copiar enlace"
                >
                  <Copy size={14} />
                </button>
              </div>

              <button
                onClick={() => {
                  setShowSuccess(false);
                  setCreatedEventId(null);
                }}
                className={`w-full py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all hover:scale-[1.02] active:scale-[0.98] ${isLight ? 'bg-black text-white hover:bg-[#B9B4FF] hover:text-black' : 'bg-white text-black hover:bg-[#B9B4FF]'
                  }`}
              >
                Continuar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
