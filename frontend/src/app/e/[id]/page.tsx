"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, CheckCircle2, Loader2, User, Mail, ChevronRight, Globe, Instagram, Twitter } from "lucide-react";
import { eventApi } from "@/lib/api";
import { Event } from "@/types/event";

interface FormQuestion {
  id: string;
  type: "text" | "email" | "paragraph" | "multiple_choice" | "checkbox";
  question: string;
  required: boolean;
  options?: string[];
  isLocked?: boolean;
}

const DEFAULT_QUESTIONS: FormQuestion[] = [
  { id: "q_name", type: "text", question: "Nombre completo", required: true, isLocked: true },
  { id: "q_email", type: "email", question: "Correo electrónico", required: true, isLocked: true },
];

export default function PublicEventPage() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [questions, setQuestions] = useState<FormQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventApi.getPublicEvent(id);
        setEvent(data);

        // Parse formSchema if it exists, else use defaults
        let qs: FormQuestion[] = DEFAULT_QUESTIONS;
        if (data.formSchema) {
          try {
            const parsed = JSON.parse(data.formSchema) as FormQuestion[];
            if (Array.isArray(parsed) && parsed.length > 0) {
              qs = parsed;
            }
          } catch {
            qs = DEFAULT_QUESTIONS;
          }
        }
        setQuestions(qs);

        // Init answers
        const initAnswers: Record<string, string | string[]> = {};
        qs.forEach(q => {
          initAnswers[q.id] = q.type === "checkbox" ? [] : "";
        });
        setAnswers(initAnswers);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    questions.forEach(q => {
      const val = answers[q.id];
      if (q.required) {
        if (!val || (Array.isArray(val) && val.length === 0) || val === "") {
          newErrors[q.id] = "Este campo es obligatorio";
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    // Simulate submission (future: POST to backend)
    await new Promise(res => setTimeout(res, 1500));
    setSubmitted(true);
    setSubmitting(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("es-MX", {
      hour: "2-digit", minute: "2-digit"
    });
  };

  const socialLinks = event?.socialLinks ? JSON.parse(event.socialLinks) : {};
  const hasSocials = Object.keys(socialLinks).length > 0;

  if (loading) return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#B9B4FF]/20 rounded-full relative">
          <div className="absolute inset-0 border-t-2 border-[#B9B4FF] rounded-full animate-spin" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B9B4FF]/40">Cargando evento...</span>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-[#080810] flex items-center justify-center text-center px-4">
      <div>
        <div className="text-6xl mb-6">🔍</div>
        <h1 className="text-2xl font-bold text-white mb-2">Evento no encontrado</h1>
        <p className="text-white/40 text-sm">Este enlace no corresponde a ningún evento activo.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#080810] relative overflow-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#B9B4FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-12 lg:py-20">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Columna Izquierda: Imagen y Perfil (Desktop) */}
          <div className="w-full lg:col-span-5 space-y-8 lg:sticky lg:top-12">
            {/* Cover image */}
            {event?.coverImageUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
              >
                <img src={event.coverImageUrl} alt={event?.name} className="w-full h-full object-cover" />
              </motion.div>
            )}

            {/* Event Socials (Desktop) */}
            {hasSocials && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hidden lg:flex items-center gap-3"
              >
                {socialLinks.website && (
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#B9B4FF] hover:bg-[#B9B4FF]/10 transition-all">
                    <Globe size={18} />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#B9B4FF] hover:bg-[#B9B4FF]/10 transition-all">
                    <Instagram size={18} />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-[#B9B4FF] hover:bg-[#B9B4FF]/10 transition-all">
                    <Twitter size={18} />
                  </a>
                )}
              </motion.div>
            )}

            {/* Presented By (Desktop Only) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-md"
            >
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B9B4FF] mb-6">Presented by</h4>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {event?.organizerAvatarUrl ? (
                    <img src={event.organizerAvatarUrl} alt={event.organizerName} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-white/20" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">{event?.organizerName}</p>
                  {event?.organizerBio && (
                    <p className="text-xs text-white/40 leading-relaxed">{event.organizerBio}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Columna Derecha: Información y Registro */}
          <div className="w-full lg:col-span-7 space-y-12">
            {/* Event Header */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#B9B4FF]/10 text-[#B9B4FF] text-[10px] font-bold uppercase tracking-widest border border-[#B9B4FF]/20">
                    {event?.isPublic ? "Evento Público" : "Evento Privado"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">{event?.name}</h1>
              </div>

              {/* Compact Meta */}
              <div className="flex flex-wrap gap-6 py-6 border-y border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Calendar size={18} className="text-[#B9B4FF]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Fecha</p>
                    <p className="text-sm text-white/80">{event?.date ? formatDate(event.date) : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <Clock size={18} className="text-[#B9B4FF]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Hora</p>
                    <p className="text-sm text-white/80">{event?.date ? formatTime(event.date) : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                    <MapPin size={18} className="text-[#B9B4FF]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Ubicación</p>
                    <p className="text-sm text-white/80">{event?.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Registration Form */}
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#B9B4FF]/5 rounded-full blur-3xl -mr-16 -mt-16" />
                  
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white mb-2">Reserva tu lugar</h2>
                    <p className="text-white/40 text-sm mb-10">Completa tus datos para confirmar tu asistencia.</p>

                    <div className="space-y-8">
                      {questions.map((q, idx) => (
                        <motion.div
                          key={q.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className="space-y-3"
                        >
                          <label className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/40">
                            {q.id === "q_name" && <User size={12} className="text-[#B9B4FF]" />}
                            {q.id === "q_email" && <Mail size={12} className="text-[#B9B4FF]" />}
                            {q.question}
                            {q.required && <span className="text-[#B9B4FF]">*</span>}
                          </label>

                          {/* Text / Email */}
                          {(q.type === "text" || q.type === "email" || q.type === "paragraph") && (
                            <div className="relative group">
                              {q.type === "paragraph" ? (
                                <textarea
                                  rows={4}
                                  placeholder={`Tu ${q.question.toLowerCase()}...`}
                                  value={answers[q.id] as string}
                                  onChange={e => {
                                    setAnswers({ ...answers, [q.id]: e.target.value });
                                    if (errors[q.id]) setErrors({ ...errors, [q.id]: "" });
                                  }}
                                  className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/10 outline-none focus:ring-1 focus:ring-[#B9B4FF]/30 transition-all resize-none group-hover:bg-white/[0.08] ${errors[q.id] ? "border-red-400/50" : "border-white/10"}`}
                                />
                              ) : (
                                <input
                                  type={q.type}
                                  placeholder={`Tu ${q.question.toLowerCase()}...`}
                                  value={answers[q.id] as string}
                                  onChange={e => {
                                    setAnswers({ ...answers, [q.id]: e.target.value });
                                    if (errors[q.id]) setErrors({ ...errors, [q.id]: "" });
                                  }}
                                  className={`w-full bg-white/5 border rounded-2xl px-5 py-4 text-sm text-white placeholder:text-white/10 outline-none focus:ring-1 focus:ring-[#B9B4FF]/30 transition-all group-hover:bg-white/[0.08] ${errors[q.id] ? "border-red-400/50" : "border-white/10"}`}
                                />
                              )}
                              {errors[q.id] && (
                                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">{errors[q.id]}</p>
                              )}
                            </div>
                          )}

                          {/* Multiple choice */}
                          {q.type === "multiple_choice" && q.options && (
                            <div className="grid grid-cols-1 gap-3">
                              {q.options.map(opt => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => {
                                    setAnswers({ ...answers, [q.id]: opt });
                                    if (errors[q.id]) setErrors({ ...errors, [q.id]: "" });
                                  }}
                                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl border text-sm text-left transition-all ${
                                    answers[q.id] === opt
                                      ? "bg-[#B9B4FF]/10 border-[#B9B4FF]/40 text-[#B9B4FF] shadow-[0_0_20px_rgba(185,180,255,0.1)]"
                                      : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:bg-white/[0.08]"
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded-full border flex-shrink-0 flex items-center justify-center ${
                                    answers[q.id] === opt ? "bg-[#B9B4FF] border-[#B9B4FF]" : "border-white/20"
                                  }`}>
                                    {answers[q.id] === opt && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                                  </div>
                                  {opt}
                                </button>
                              ))}
                              {errors[q.id] && (
                                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1">{errors[q.id]}</p>
                              )}
                            </div>
                          )}

                          {/* Checkbox */}
                          {q.type === "checkbox" && q.options && (
                            <div className="grid grid-cols-1 gap-3">
                              {q.options.map(opt => {
                                const selected = (answers[q.id] as string[]) || [];
                                const isChecked = selected.includes(opt);
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      const current = [...((answers[q.id] as string[]) || [])];
                                      const idx = current.indexOf(opt);
                                      if (idx === -1) current.push(opt);
                                      else current.splice(idx, 1);
                                      setAnswers({ ...answers, [q.id]: current });
                                      if (errors[q.id]) setErrors({ ...errors, [q.id]: "" });
                                    }}
                                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl border text-sm text-left transition-all ${
                                      isChecked
                                        ? "bg-[#B9B4FF]/10 border-[#B9B4FF]/40 text-[#B9B4FF] shadow-[0_0_20px_rgba(185,180,255,0.1)]"
                                        : "bg-white/5 border-white/10 text-white/50 hover:border-white/20 hover:bg-white/[0.08]"
                                    }`}
                                  >
                                    <div className={`w-4 h-4 rounded-md border flex-shrink-0 flex items-center justify-center ${
                                      isChecked ? "bg-[#B9B4FF] border-[#B9B4FF]" : "border-white/20"
                                    }`}>
                                      {isChecked && <span className="text-black font-bold text-[10px]">✓</span>}
                                    </div>
                                    {opt}
                                  </button>
                                );
                              })}
                              {errors[q.id] && (
                                <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest mt-1 ml-1">{errors[q.id]}</p>
                              )}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="mt-12 w-full flex items-center justify-center gap-3 py-5 rounded-[1.5rem] bg-[#B9B4FF] text-black font-bold text-xs uppercase tracking-[0.2em] disabled:opacity-50 hover:bg-[#9C8CFF] transition-all shadow-[0_20px_40px_rgba(185,180,255,0.15)]"
                    >
                      {submitting ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <>
                          Confirmar Asistencia
                          <ChevronRight size={16} />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-12 backdrop-blur-xl flex flex-col items-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-24 h-24 rounded-full bg-[#B9B4FF]/20 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(185,180,255,0.3)]"
                  >
                    <CheckCircle2 size={48} className="text-[#B9B4FF]" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">¡Registro Confirmado!</h2>
                  <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                    Te has registrado exitosamente a <span className="text-white font-semibold">{event?.name}</span>. Revisa tu correo para más información.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Description */}
            {event?.description && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-6 pt-12 border-t border-white/5"
              >
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Acerca de este evento</h3>
                <div
                  className="text-white/60 text-base leading-[1.8] prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </motion.div>
            )}

            {/* Presented By (Mobile Only) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 backdrop-blur-md mt-12"
            >
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B9B4FF] mb-6">Presented by</h4>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {event?.organizerAvatarUrl ? (
                    <img src={event.organizerAvatarUrl} alt={event.organizerName} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-white/20" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">{event?.organizerName}</p>
                  {event?.organizerBio && (
                    <p className="text-xs text-white/40 leading-relaxed">{event.organizerBio}</p>
                  )}
                  
                  {/* Mobile Socials */}
                  {hasSocials && (
                    <div className="flex items-center gap-2 mt-4">
                      {socialLinks.website && (
                        <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-[#B9B4FF]">
                          <Globe size={14} />
                        </a>
                      )}
                      {socialLinks.instagram && (
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-[#B9B4FF]">
                          <Instagram size={14} />
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-[#B9B4FF]">
                          <Twitter size={14} />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-white/20 text-[10px] uppercase tracking-widest font-bold mt-20 pt-10 border-t border-white/5">
          Powered by NETEG
        </p>
      </div>
    </div>
  );
}
