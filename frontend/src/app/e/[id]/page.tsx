"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, CheckCircle2, Loader2, User, Mail, ChevronRight, Globe } from "lucide-react";

const Instagram = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Twitter = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
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
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]"
              >
                <img src={event.coverImageUrl} alt={event?.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
              </motion.div>
            )}

            {/* Event Socials (Desktop) */}
            {hasSocials && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="hidden lg:flex items-center gap-3 px-1"
              >
                {socialLinks.website && (
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/30 hover:text-[#B9B4FF] hover:bg-[#B9B4FF]/10 transition-all group">
                    <Globe size={16} />
                  </a>
                )}
                {socialLinks.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/30 hover:text-[#B9B4FF] hover:bg-[#B9B4FF]/10 transition-all group">
                    <Instagram size={16} />
                  </a>
                )}
                {socialLinks.twitter && (
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-white/30 hover:text-[#B9B4FF] hover:bg-[#B9B4FF]/10 transition-all group">
                    <Twitter size={16} />
                  </a>
                )}
              </motion.div>
            )}

            {/* Presented By (Desktop Only) - SMALLLER & ALIGNED */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="hidden lg:block p-6 rounded-[1.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-md relative overflow-hidden group"
            >
              <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B9B4FF]/40 mb-4">Hosted by</h4>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg">
                  {event?.organizerAvatarUrl ? (
                    <img src={event.organizerAvatarUrl} alt={event.organizerName} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-white/10" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white tracking-tight truncate">{event?.organizerName}</p>
                  {event?.organizerBio && (
                    <p className="text-[11px] text-white/30 leading-tight font-medium truncate">{event.organizerBio}</p>
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
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#B9B4FF]/10 text-[#B9B4FF] text-[9px] font-bold uppercase tracking-[0.2em] border border-[#B9B4FF]/20">
                    {event?.isPublic ? "Evento Público" : "Evento Privado"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1] max-w-[20ch]">
                  {event?.name}
                </h1>
              </div>

              {/* Compact Meta */}
              <div className="flex flex-wrap gap-x-10 gap-y-6 py-6 border-y border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/10">
                    <Calendar size={18} className="text-[#B9B4FF]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Fecha</p>
                    <p className="text-xs text-white/80 font-medium">{event?.date ? formatDate(event.date) : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/10">
                    <Clock size={18} className="text-[#B9B4FF]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Hora</p>
                    <p className="text-xs text-white/80 font-medium">{event?.date ? formatTime(event.date) : ""}</p>
                  </div>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.location || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/10 group-hover:border-[#B9B4FF]/40 group-hover:bg-[#B9B4FF]/5">
                    <MapPin size={18} className="text-[#B9B4FF]" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Ubicación</p>
                    <p className="text-xs text-white/80 font-medium group-hover:text-[#B9B4FF] transition-colors">{event?.location}</p>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Registration Form - SMALLER */}
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-2xl relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Registro</h2>
                        <p className="text-white/40 text-[11px] font-medium">Confirma tu asistencia ahora.</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {questions.map((q, idx) => (
                        <motion.div
                          key={q.id}
                          className="space-y-3"
                        >
                          <label className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white/30">
                            {q.question}
                            {q.required && <span className="text-[#B9B4FF]">*</span>}
                          </label>

                          {(q.type === "text" || q.type === "email" || q.type === "paragraph") && (
                            <div className="relative">
                              {q.type === "paragraph" ? (
                                <textarea
                                  rows={3}
                                  placeholder={`Tu ${q.question.toLowerCase()}...`}
                                  value={answers[q.id] as string}
                                  onChange={e => {
                                    setAnswers({ ...answers, [q.id]: e.target.value });
                                    if (errors[q.id]) setErrors({ ...errors, [q.id]: "" });
                                  }}
                                  className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/10 outline-none focus:ring-1 focus:ring-[#B9B4FF]/30 transition-all resize-none ${errors[q.id] ? "border-red-400/30" : "border-white/10"}`}
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
                                  className={`w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/10 outline-none focus:ring-1 focus:ring-[#B9B4FF]/30 transition-all ${errors[q.id] ? "border-red-400/30" : "border-white/10"}`}
                                />
                              )}
                              {errors[q.id] && (
                                <p className="text-red-400 text-[9px] font-bold uppercase tracking-widest mt-1.5 ml-1">{errors[q.id]}</p>
                              )}
                            </div>
                          )}

                          {(q.type === "multiple_choice" || q.type === "checkbox") && q.options && (
                            <div className="grid grid-cols-1 gap-2">
                              {q.options.map(opt => {
                                const selected = (answers[q.id] as string[]) || [];
                                const isChecked = q.type === "checkbox" ? selected.includes(opt) : answers[q.id] === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      if (q.type === "checkbox") {
                                        const current = [...((answers[q.id] as string[]) || [])];
                                        const idx = current.indexOf(opt);
                                        if (idx === -1) current.push(opt);
                                        else current.splice(idx, 1);
                                        setAnswers({ ...answers, [q.id]: current });
                                      } else {
                                        setAnswers({ ...answers, [q.id]: opt });
                                      }
                                      if (errors[q.id]) setErrors({ ...errors, [q.id]: "" });
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-[11px] text-left transition-all ${
                                      isChecked
                                        ? "bg-[#B9B4FF]/10 border-[#B9B4FF]/40 text-[#B9B4FF]"
                                        : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20"
                                    }`}
                                  >
                                    <div className={`w-3.5 h-3.5 rounded-${q.type === "checkbox" ? "sm" : "full"} border flex-shrink-0 flex items-center justify-center ${
                                      isChecked ? "bg-[#B9B4FF] border-[#B9B4FF]" : "border-white/20"
                                    }`}>
                                      {isChecked && (
                                        q.type === "checkbox" ? 
                                        <span className="text-black font-bold text-[8px]">✓</span> : 
                                        <div className="w-1 h-1 bg-black rounded-full" />
                                      )}
                                    </div>
                                    <span className="truncate">{opt}</span>
                                  </button>
                                );
                              })}
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
                      className="mt-8 w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[#B9B4FF] text-black font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg"
                    >
                      {submitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <>
                          Confirmar Registro
                          <ChevronRight size={14} />
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
                  className="bg-white/[0.02] border border-[#B9B4FF]/30 rounded-[2rem] p-12 text-center shadow-xl"
                >
                  <CheckCircle2 size={48} className="text-[#B9B4FF] mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-3">¡Confirmado!</h2>
                  <p className="text-white/40 text-xs max-w-xs mx-auto">Te has registrado exitosamente.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Description */}
            {event?.description && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 pt-10 border-t border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-0.5 h-4 bg-[#B9B4FF]/40 rounded-full" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B9B4FF]/60">Información</h3>
                </div>
                <div
                  className="text-white/50 text-base leading-[1.6] prose prose-invert prose-p:mb-4 max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </motion.div>
            )}

            {/* Presented By (Mobile Only) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden p-8 rounded-[1.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-md mt-12"
            >
              <h4 className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#B9B4FF]/60 mb-6">Hosted by</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {event?.organizerAvatarUrl ? (
                    <img src={event.organizerAvatarUrl} alt={event.organizerName} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-white/20" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-tight">{event?.organizerName}</p>
                  {event?.organizerBio && (
                    <p className="text-xs text-white/30 leading-tight mt-0.5">{event.organizerBio}</p>
                  )}
                  
                  {/* Mobile Socials */}
                  {hasSocials && (
                    <div className="flex items-center gap-2 mt-3">
                      {socialLinks.website && (
                        <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-[#B9B4FF]">
                          <Globe size={14} />
                        </a>
                      )}
                      {socialLinks.instagram && (
                        <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-[#B9B4FF]">
                          <Instagram size={14} />
                        </a>
                      )}
                      {socialLinks.twitter && (
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-white/5 text-white/30 hover:text-[#B9B4FF]">
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
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-bold">
            Powered by NETEG
          </p>
        </div>
      </div>
    </div>
  );
}
