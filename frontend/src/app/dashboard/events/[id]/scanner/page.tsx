"use client";

import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { participantApi, eventApi } from "@/lib/api";
import { TicketQrPayload, ParticipantResponse } from "@/types/participant";
import { Event } from "@/types/event";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Scan, 
  Camera, 
  Info,
  Loader2,
  Users
} from "lucide-react";

interface ScannerPageProps {
  params: Promise<{ id: string }>;
}

type ScanStatus = "idle" | "scanning" | "processing" | "success" | "error" | "duplicate" | "wrong-event";

export default function ScannerPage({ params }: ScannerPageProps) {
  const router = useRouter();
  const { id: eventId } = use(params);
  
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [event, setEvent] = useState<Event | null>(null);
  const [lastParticipant, setLastParticipant] = useState<ParticipantResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScanTime = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Fetch event details
    eventApi.getPublicEvent(eventId).then(setEvent).catch(console.error);

    // Initialize Scanner
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    startScanner();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [eventId]);

  const startScanner = async () => {
    if (!scannerRef.current) return;
    
    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanFailure
      );
      setIsCameraReady(true);
      setStatus("scanning");
    } catch (err) {
      console.error("Camera error:", err);
      setErrorMessage("No se pudo acceder a la cámara. Revisa los permisos.");
      setStatus("error");
    }
  };

  const parseQrText = (text: string): TicketQrPayload | null => {
    try {
      // Formato: p:UUID|e:UUID|s:SIGNATURE
      const parts = text.split("|");
      if (parts.length !== 3) return null;

      const p = parts[0].split(":")[1];
      const e = parts[1].split(":")[1];
      const s = parts.slice(2).join(":").replace("s:", ""); // Handle signatures with colons if any

      if (!p || !e || !s) return null;

      return { p, e, s };
    } catch (e) {
      return null;
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    const now = Date.now();
    if (now - lastScanTime.current < 3000) return; // Throttle 3s
    if (status === "processing" || status === "success" || status === "error" || status === "duplicate") return;

    lastScanTime.current = now;
    setStatus("processing");

    const payload = parseQrText(decodedText);

    if (!payload) {
      handleResult("error", "Código QR no reconocido o formato inválido.");
      return;
    }

    // Pre-validación local de Evento
    if (payload.e !== eventId) {
      handleResult("wrong-event", "Este boleto pertenece a otro evento.");
      return;
    }

    try {
      const participant = await participantApi.verifyTicket(payload);
      setLastParticipant(participant);
      handleResult("success");
      
      // Feedback háptico si es compatible
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (err: any) {
      if (err.message.includes("409") || err.message.toLowerCase().includes("utilizado")) {
        handleResult("duplicate", "Este boleto ya fue validado anteriormente.");
      } else {
        handleResult("error", err.message || "Error al validar el boleto.");
      }
    }
  };

  const onScanFailure = (error: string) => {
    // Too noisy, usually just means no QR in frame
  };

  const handleResult = (newStatus: ScanStatus, message: string = "") => {
    setStatus(newStatus);
    setErrorMessage(message);

    // Auto-reset after 4 seconds
    setTimeout(() => {
      setStatus("scanning");
      setLastParticipant(null);
      setErrorMessage("");
    }, 4000);
  };

  return (
    <div className="fixed inset-0 bg-[#0B0B0E] flex flex-col z-[100] overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md z-10">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="text-center">
          <div className="text-[10px] font-bold text-[#B9B4FF] uppercase tracking-[0.2em] mb-1">Staff Scanner</div>
          <div className="text-sm font-bold text-white max-w-[200px] truncate">
            {event?.name || "Cargando evento..."}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
          <Scan className="w-5 h-5 text-[#B9B4FF]/40" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col">
        {/* Camera Container */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
           <div id="reader" className="w-full h-full object-cover" />
           
           {/* Scanning Overlay (Aesthetic) */}
           {status === "scanning" && (
             <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                <div className="w-64 h-64 border-2 border-white/20 rounded-[2rem] relative">
                   <div className="absolute inset-0 border-2 border-[#B9B4FF] rounded-[2rem] animate-pulse opacity-40" />
                   {/* Scanning line animation */}
                   <motion.div 
                     animate={{ top: ["10%", "90%", "10%"] }}
                     transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                     className="absolute left-4 right-4 h-0.5 bg-[#B9B4FF] shadow-[0_0_15px_#B9B4FF] z-10"
                   />
                </div>
                <div className="mt-8 px-6 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-[#B9B4FF] animate-pulse" />
                   <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Alinea el código QR</span>
                </div>
             </div>
           )}

           {/* Results Overlay */}
           <AnimatePresence>
             {status !== "scanning" && status !== "idle" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, backdropFilter: "blur(0px)" }}
                  animate={{ opacity: 1, scale: 1, backdropFilter: "blur(20px)" }}
                  exit={{ opacity: 0, scale: 1.1, backdropFilter: "blur(0px)" }}
                  className={`absolute inset-0 z-50 flex flex-col items-center justify-center p-8 text-center ${
                    status === "success" ? "bg-green-500/90" : 
                    status === "duplicate" ? "bg-orange-500/90" : 
                    status === "processing" ? "bg-blue-500/90" : "bg-red-600/90"
                  }`}
                >
                  {status === "processing" && (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-24 h-24 rounded-full border-4 border-white/20 border-t-white flex items-center justify-center mb-8"
                    />
                  )}

                  {status === "success" && (
                    <motion.div 
                      initial={{ scale: 0.5, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl"
                    >
                      <CheckCircle2 className="w-20 h-20 text-green-600" />
                    </motion.div>
                  )}

                  {(status === "error" || status === "wrong-event") && (
                    <motion.div 
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl"
                    >
                      <XCircle className="w-20 h-20 text-red-600" />
                    </motion.div>
                  )}

                  {status === "duplicate" && (
                    <motion.div 
                      initial={{ y: 20 }}
                      animate={{ y: 0 }}
                      className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl"
                    >
                      <AlertTriangle className="w-20 h-20 text-orange-500" />
                    </motion.div>
                  )}

                  <h2 className="text-4xl font-black text-white tracking-tighter mb-4 leading-none">
                    {status === "processing" ? "VALIDANDO..." : 
                     status === "success" ? "BIENVENIDO" : 
                     status === "duplicate" ? "YA INGRESÓ" : 
                     status === "wrong-event" ? "EVENTO INCORRECTO" : "INVÁLIDO"}
                  </h2>

                  {lastParticipant && (
                    <div className="bg-black/20 backdrop-blur-md p-6 rounded-[2rem] border border-white/20 mb-4 max-w-sm w-full">
                       <div className="text-2xl font-bold text-white mb-1">{lastParticipant.fullName}</div>
                       <div className="text-white/60 text-sm font-medium">{lastParticipant.email}</div>
                       {lastParticipant.checkInAt && (
                         <div className="mt-4 text-[10px] font-bold text-white/40 uppercase tracking-[0.1em]">
                           Registrado: {new Date(lastParticipant.checkInAt).toLocaleTimeString()}
                         </div>
                       )}
                    </div>
                  )}

                  {errorMessage && (
                    <p className="text-white/80 font-bold text-lg max-w-sm px-4">
                      {errorMessage}
                    </p>
                  )}

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 text-white/40 text-xs font-bold uppercase tracking-[0.3em]"
                  >
                    Próximo escaneo en breve...
                  </motion.div>
                </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Footer Info */}
        <div className="p-8 bg-black/60 backdrop-blur-2xl border-t border-white/5 flex flex-col gap-6">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#B9B4FF]" />
                 </div>
                 <div>
                    <div className="text-white font-bold">Escáner de Acceso</div>
                    <div className="text-white/30 text-xs font-medium">Validación criptográfica activa</div>
                 </div>
              </div>
              <div className="flex gap-2">
                <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest ${isCameraReady ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/20'}`}>
                  {isCameraReady ? 'Live' : 'Waiting'}
                </div>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                 <div className="text-white/20 text-[9px] font-bold uppercase tracking-widest mb-1">Firmas</div>
                 <div className="text-white font-bold text-xs">RSA-256 Valid</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                 <div className="text-white/20 text-[9px] font-bold uppercase tracking-widest mb-1">Modo</div>
                 <div className="text-white font-bold text-xs">Alta Velocidad</div>
              </div>
           </div>
        </div>
      </div>

      <style jsx global>{`
        #reader { border: none !important; }
        #reader video { 
          object-fit: cover !important; 
          width: 100% !important; 
          height: 100% !important;
          border-radius: 0 !important;
        }
        #reader__scan_region { background: black !important; }
        #reader__dashboard { display: none !important; }
      `}</style>
    </div>
  );
}
