"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, CheckCircle2, Loader2, User, Mail, ChevronRight, Globe } from "lucide-react";
import { TopNavbar } from "@/components/layouts/TopNavbar";

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
import { eventApi, participantApi, getToken } from "@/lib/api";
import { Event } from "@/types/event";
import { RegisterParticipantRequest } from "@/types/participant";

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

    try {
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      const user = storedUser ? JSON.parse(storedUser) : null;

      const payload: RegisterParticipantRequest = {
        eventId: id,
        userId: user?.id,
        fullName: answers["q_name"] as string,
        email: answers["q_email"] as string,
        formAnswers: {}
      };

      // Bundle dynamic answers (excluding core fields)
      Object.keys(answers).forEach(key => {
        if (key !== "q_name" && key !== "q_email") {
          const val = answers[key];
          payload.formAnswers[key] = Array.isArray(val) ? val.join(", ") : (val as string);
        }
      });

      await participantApi.register(payload);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Error al procesar el registro. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("es-MX", {
      weekday: "short", day: "numeric", month: "short"
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
    <div className="min-h-screen bg-[#080810] relative overflow-hidden selection:bg-[#B9B4FF]/30">
      <TopNavbar />
      
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#B9B4FF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-28 pb-12 lg:pb-24">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Columna Izquierda: Imagen y Perfil */}
          <div className="w-full lg:col-span-5 space-y-10 lg:sticky lg:top-24">
            {/* Cover image */}
            {event?.coverImageUrl && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full aspect-[4/5] rounded-2xl overflow-hidden border border-white/5 shadow-2xl"
              >
                <img 
                  src={event.coverImageUrl} 
                  alt={event?.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" 
                />
              </motion.div>
            )}

            {/* Presented By Card - COMPACT & INLINE */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {event?.organizerAvatarUrl ? (
                      <img src={event.organizerAvatarUrl} alt={event.organizerName} className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} className="text-white/20" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white tracking-tight truncate">{event?.organizerName}</p>
                    <p className="text-[11px] text-white/30 font-medium truncate">Organizador del evento</p>
                  </div>
                </div>

                {/* Socials Inline */}
                {hasSocials && (
                  <div className="flex items-center gap-1">
                    {socialLinks.instagram && (
                      <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-white/20 hover:text-[#B9B4FF] hover:bg-[#B9B4FF]/10 transition-all">
                        <Instagram size={14} />
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-white/20 hover:text-[#B9B4FF] hover:bg-[#B9B4FF]/10 transition-all">
                        <Twitter size={14} />
                      </a>
                    )}
                    {socialLinks.website && (
                      <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg text-white/20 hover:text-[#B9B4FF] hover:bg-[#B9B4FF]/10 transition-all">
                        <Globe size={14} />
                      </a>
                    )}
                  </div>
                )}
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
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B9B4FF]/10 text-[#B9B4FF] text-[10px] font-bold uppercase tracking-widest border border-[#B9B4FF]/20">
                    {event?.isPublic ? "Público" : "Privado"}
                  </span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.1] max-w-[18ch]">
                  {event?.name}
                </h1>
              </div>

              {/* Metadata Info Pills */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-[13px] text-white/50 font-medium">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5">
                  <Calendar size={14} className="text-[#B9B4FF]/60" />
                  <span>{event?.date ? formatDate(event.date) : ""}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5">
                  <Clock size={14} className="text-[#B9B4FF]/60" />
                  <span>{event?.date ? formatTime(event.date) : ""}</span>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.location || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:text-white transition-all group"
                >
                  <MapPin size={14} className="text-[#B9B4FF]/60 group-hover:text-[#B9B4FF]" />
                  <span>{event?.location}</span>
                </a>
              </div>
            </motion.div>

            {/* Registration Form */}
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-2xl relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-white tracking-tight">Registro</h2>
                      <p className="text-white/30 text-[12px] font-medium mt-1">Completa tus datos para confirmar asistencia.</p>
                    </div>

                    <div className="space-y-5">
                      {questions.map((q) => (
                        <div key={q.id} className="space-y-1.5">
                          <label className="text-[11px] font-semibold uppercase tracking-wider text-white/30 ml-1">
                            {q.question}
                            {q.required && <span className="text-[#B9B4FF] ml-1">*</span>}
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
                                  className={`w-full bg-white/[0.03] border rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-white/10 outline-none focus:ring-1 focus:ring-[#B9B4FF]/20 transition-all resize-none ${errors[q.id] ? "border-red-400/30" : "border-white/5 hover:border-white/10"}`}
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
                                  className={`w-full bg-white/[0.03] border rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-white/10 outline-none focus:ring-1 focus:ring-[#B9B4FF]/20 transition-all ${errors[q.id] ? "border-red-400/30" : "border-white/5 hover:border-white/10"}`}
                                />
                              )}
                              {errors[q.id] && (
                                <p className="text-red-400 text-[10px] font-medium mt-1.5 ml-1">{errors[q.id]}</p>
                              )}
                            </div>
                          )}

                          {(q.type === "multiple_choice" || q.type === "checkbox") && q.options && (
                            <div className="flex flex-wrap gap-2 pt-1">
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
                                    className={`px-4 py-2 rounded-full border text-[12px] font-medium transition-all ${
                                      isChecked
                                        ? "bg-[#B9B4FF]/10 border-[#B9B4FF]/40 text-[#B9B4FF]"
                                        : "bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="mt-10 h-11 w-full flex items-center justify-center gap-2 rounded-xl bg-[#B9B4FF] text-black font-semibold text-[13px] transition-all hover:bg-[#A8A2FF] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="bg-white/[0.02] border border-[#B9B4FF]/30 rounded-3xl p-12 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#B9B4FF]/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={32} className="text-[#B9B4FF]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">¡Todo listo!</h2>
                  <p className="text-white/40 text-sm max-w-xs mx-auto">Tu registro ha sido procesado correctamente. Nos vemos en el evento.</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Description */}
            {event?.description && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-0.5 h-3 bg-[#B9B4FF]/60 rounded-full" />
                  <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/30">Información</h3>
                </div>
                <div
                  className="text-white/50 text-[14px] leading-[1.7] prose prose-invert prose-p:mb-4 max-w-none font-medium"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-32 pt-8 border-t border-white/5 flex flex-col items-center">
          <p className="text-white/10 text-[10px] uppercase tracking-[0.4em] font-bold">
            Powered by NETEG
          </p>
        </div>
      </div>
    </div>
  );
}
