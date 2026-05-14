"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string; server?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = "El nombre es requerido.";
    }

    if (!email) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }

    if (!password) {
      newErrors.password = "La contraseña es requerida.";
    } else if (password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres.";
    }

    if (password !== confirmPassword) {
      newErrors.confirm = "Las contraseñas no coinciden.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Integrar la llamada real a tu AuthService aquí (Registro)
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      setErrors({
        server: error instanceof Error ? error.message : "Ocurrió un error inesperado al intentar crear tu cuenta.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // TODO: Integrar Google OAuth aquí
    console.log("Google Sign-Up clicked");
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* ── Panel izquierdo: Branding ── */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] relative flex-col items-center justify-center p-12 overflow-hidden shrink-0 bg-[#050508]">
        
        {/* Patrón de malla densa — esquina superior izquierda (púrpura claro) */}
        <div
          className="absolute top-0 left-0 w-[70%] h-[60%]"
          style={{
            backgroundImage: "radial-gradient(rgba(185,180,255,0.5) 1px, transparent 1px)",
            backgroundSize: "6px 6px",
            maskImage: "linear-gradient(135deg, black 0%, black 15%, transparent 50%)",
            WebkitMaskImage: "linear-gradient(135deg, black 0%, black 15%, transparent 50%)",
            opacity: 0.6,
          }}
        />
        {/* Glow sutil detrás del patrón superior */}
        <div
          className="absolute top-[-5%] left-[-5%] w-[50%] h-[40%] rounded-full blur-[80px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(156,140,255,0.15) 0%, transparent 70%)" }}
        />

        {/* Patrón de malla densa — esquina inferior derecha (violeta cálido) */}
        <div
          className="absolute bottom-0 right-0 w-[70%] h-[60%]"
          style={{
            backgroundImage: "radial-gradient(rgba(168,85,247,0.5) 1px, transparent 1px)",
            backgroundSize: "6px 6px",
            maskImage: "linear-gradient(315deg, black 0%, black 15%, transparent 50%)",
            WebkitMaskImage: "linear-gradient(315deg, black 0%, black 15%, transparent 50%)",
            opacity: 0.5,
          }}
        />
        {/* Glow sutil detrás del patrón inferior */}
        <div
          className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[40%] rounded-full blur-[80px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
        />

        {/* Contenido centrado */}
        <div className="relative z-10 text-center space-y-5">
          <Image src="/NETEG.svg" alt="NETEG" width={56} height={56} className="mx-auto rounded-xl" />
          <h2 className="text-2xl xl:text-3xl font-bold text-white leading-snug tracking-tight max-w-xs mx-auto">
            Automatiza tus eventos sin complicaciones.
          </h2>
        </div>
      </div>

      {/* ── Panel derecho: Formulario ── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="p-6 sm:p-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Inicio
          </Link>
        </div>

        {/* Contenido centrado */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 pb-12">
          <div className="w-full max-w-[400px] space-y-8">
            {/* Título */}
            <div>
              {/* Logo móvil */}
              <div className="lg:hidden mb-6">
                <Image src="/NETEG.svg" alt="NETEG" width={40} height={40} className="rounded-xl" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Crea tu cuenta gratuita
              </h1>
              <p className="mt-2 text-text-secondary text-sm">
                Conéctate a NETEG con:
              </p>
            </div>

            {/* Botón Google */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full h-11 flex items-center justify-center gap-3 bg-transparent border border-white/[0.12] hover:bg-white/[0.04] text-white text-sm font-medium rounded-lg transition-all active:scale-[0.98]"
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>

            {/* Separador */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-black px-4 text-zinc-500">O continúa con correo</span>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.server && (
                <div className="p-3 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/20">
                  {errors.server}
                </div>
              )}

              {/* Nombre */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-medium text-zinc-300">
                  Nombre completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className={`w-full h-11 px-3 rounded-lg text-sm text-white placeholder:text-zinc-600 bg-transparent border border-white/[0.12] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all disabled:opacity-50 ${
                    errors.name ? "border-red-500/50 focus:ring-red-500/20" : ""
                  }`}
                  disabled={isLoading}
                />
                {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className={`w-full h-11 px-3 rounded-lg text-sm text-white placeholder:text-zinc-600 bg-transparent border border-white/[0.12] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all disabled:opacity-50 ${
                    errors.email ? "border-red-500/50 focus:ring-red-500/20" : ""
                  }`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crea una contraseña única"
                    className={`w-full h-11 px-3 pr-10 rounded-lg text-sm text-white placeholder:text-zinc-600 bg-transparent border border-white/[0.12] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all disabled:opacity-50 ${
                      errors.password ? "border-red-500/50 focus:ring-red-500/20" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M21 21l-3.168-3.168" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-300">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className={`w-full h-11 px-3 pr-10 rounded-lg text-sm text-white placeholder:text-zinc-600 bg-transparent border border-white/[0.12] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all disabled:opacity-50 ${
                      errors.confirm ? "border-red-500/50 focus:ring-red-500/20" : ""
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showConfirm ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M21 21l-3.168-3.168" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                {errors.confirm && <p className="text-xs text-red-400">{errors.confirm}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full h-11 bg-white hover:bg-zinc-200 text-black text-sm font-medium rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creando cuenta...
                  </span>
                ) : (
                  "Continuar"
                )}
              </button>
            </form>

            {/* Términos */}
            <p className="text-xs text-zinc-600 leading-relaxed">
              Al crear una cuenta, aceptas nuestros{" "}
              <a href="#" className="text-zinc-400 underline underline-offset-2 hover:text-white transition-colors">
                Términos de Servicio
              </a>{" "}
              y nuestra{" "}
              <a href="#" className="text-zinc-400 underline underline-offset-2 hover:text-white transition-colors">
                Política de Privacidad
              </a>
              .
            </p>

            {/* Link inferior */}
            <p className="text-sm text-zinc-500">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-primary hover:text-primary-strong transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
