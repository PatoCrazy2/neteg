"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { authApi, setToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { GoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const router = useRouter();
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
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
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
      const response = await authApi.register({ 
        fullName: name, 
        email, 
        password 
      });
      
      setToken(response.token);
      localStorage.setItem("user", JSON.stringify({
        id: response.userId,
        fullName: response.fullName,
        email: response.email,
        role: response.role
      }));

      router.push("/dashboard");
    } catch (error) {
      setErrors({
        server: error instanceof Error ? error.message : "Ocurrió un error inesperado.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const response = await authApi.googleLogin({
        idToken: credentialResponse.credential
      });
      
      setToken(response.token);
      localStorage.setItem("user", JSON.stringify({
        id: response.userId,
        fullName: response.fullName,
        email: response.email,
        role: response.role
      }));

      router.push("/dashboard");
    } catch (error) {
      setErrors({ server: "Error al registrarse con Google." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* Panel izquierdo: Branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] relative flex-col items-center justify-center p-12 overflow-hidden shrink-0 bg-[#050508]">
        <div className="absolute inset-0 w-full h-full animate-gradient-move opacity-100" style={{ 
          background: "linear-gradient(135deg, #9C8CFF, #000000, #FF8CFF, #000000, #A0A0A0, #000000, #B9B4FF, #000000, #9C8CFF)", 
          backgroundSize: "300% 300%", 
          WebkitMaskImage: "radial-gradient(black 1.5px, transparent 1.5px), linear-gradient(135deg, black 0%, black 60%, transparent 100%)", 
          WebkitMaskSize: "8px 8px, 100% 100%", 
          WebkitMaskRepeat: "repeat, no-repeat", 
          WebkitMaskComposite: "source-in", 
          maskImage: "radial-gradient(black 1.5px, transparent 1.5px), linear-gradient(135deg, black 0%, black 60%, transparent 100%)", 
          maskSize: "8px 8px, 100% 100%", 
          maskRepeat: "repeat, no-repeat", 
          maskComposite: "intersect" 
        }} />
        <div className="relative z-10 text-center space-y-5">
          <Image src="/NETEG.svg" alt="NETEG" width={56} height={56} className="mx-auto rounded-xl" />
          <h2 className="text-2xl xl:text-3xl font-bold text-white leading-snug tracking-tight max-w-xs mx-auto">
            Automatiza tus eventos sin complicaciones.
          </h2>
        </div>
      </div>

      {/* Panel derecho: Formulario */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="p-6 sm:p-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Inicio
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 pb-12">
          <div className="w-full max-w-[400px] space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Crea tu cuenta</h1>
              <p className="mt-2 text-zinc-500 text-sm">Regístrate con Google para continuar:</p>
            </div>

            {/* Botón de Google Oficial */}
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setErrors({ server: "Error en el registro de Google" })}
                theme="filled_black"
                shape="rectangular"
                width="400"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.08]" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-black px-4 text-zinc-500">O continúa con correo</span></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.server && <div className="p-3 text-sm text-red-400 bg-red-500/10 rounded-lg border border-red-500/20">{errors.server}</div>}
              
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Nombre completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className={`w-full h-11 px-3 rounded-lg text-sm text-white bg-transparent border ${errors.name ? 'border-red-500' : 'border-white/[0.12]'} focus:ring-2 focus:ring-primary/40 focus:outline-none`}
                  disabled={isLoading}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className={`w-full h-11 px-3 rounded-lg text-sm text-white bg-transparent border ${errors.email ? 'border-red-500' : 'border-white/[0.12]'} focus:ring-2 focus:ring-primary/40 focus:outline-none`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  className={`w-full h-11 px-3 rounded-lg text-sm text-white bg-transparent border ${errors.password ? 'border-red-500' : 'border-white/[0.12]'} focus:ring-2 focus:ring-primary/40 focus:outline-none`}
                  disabled={isLoading}
                />
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-300">Confirmar contraseña</label>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className={`w-full h-11 px-3 rounded-lg text-sm text-white bg-transparent border ${errors.confirm ? 'border-red-500' : 'border-white/[0.12]'} focus:ring-2 focus:ring-primary/40 focus:outline-none`}
                  disabled={isLoading}
                />
                {errors.confirm && <p className="text-xs text-red-400 mt-1">{errors.confirm}</p>}
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-white hover:bg-zinc-200 text-black text-sm font-medium rounded-lg transition-all disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Creando cuenta..." : "Continuar"}
              </button>
            </form>

            <p className="text-sm text-zinc-500">
              ¿Ya tienes cuenta? <Link href="/login" className="text-white hover:underline">Inicia sesión</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
