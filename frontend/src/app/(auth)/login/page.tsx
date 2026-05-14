"use client";

import { useState } from "react";
// Se han removido las importaciones de Card, Input y LoadingSpinner temporalmente 
// para evitar errores de compilación hasta que los instales.
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; server?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validación visual elegante (implementada con estado nativo ya que RHF/Zod no están instalados por defecto)
    const newErrors: typeof errors = {};
    if (!email) {
      newErrors.email = "El correo electrónico es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }
    
    if (!password) {
      newErrors.password = "La contraseña es requerida.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    try {
      // TODO: Integrar la llamada real a tu AuthService aquí
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Simulación de error de servidor (descomentar para probar)
      // throw new Error("Credenciales inválidas. Por favor, verifica tu información.");
      
      // Redirección en caso de éxito
    } catch (error) {
      setErrors({ 
        server: error instanceof Error ? error.message : "Ocurrió un error inesperado al intentar iniciar sesión." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden font-inter selection:bg-zinc-200 dark:selection:bg-zinc-800">
      
      {/* Glow de fondo sutil inspirado en Linear / Vercel */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-40 dark:opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-300 dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="w-full max-w-[420px] relative z-10 flex flex-col gap-8">
        
        {/* Encabezado */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-zinc-900 dark:bg-white rounded-xl mx-auto flex items-center justify-center shadow-md">
            <span className="text-white dark:text-zinc-900 font-outfit font-bold text-xl">N</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-outfit">
            Bienvenido de nuevo
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">
            Ingresa a tu cuenta de NETEG para continuar.
          </p>
        </div>

        {/* Contenedor principal con Glassmorphism */}
        <div className="p-6 sm:p-8 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl dark:shadow-2xl rounded-2xl">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Mensaje de error del servidor */}
            {errors.server && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-500/20 animate-in fade-in zoom-in duration-300">
                {errors.server}
              </div>
            )}

            {/* Input Correo */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className={`flex w-full rounded-md text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 h-11 px-3 bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 transition-all ${
                  errors.email ? 'border-red-500 focus:ring-red-500/20' : ''
                }`}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 animate-in fade-in duration-200">{errors.email}</p>
              )}
            </div>

            {/* Input Contraseña */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Contraseña
                </label>
                <a 
                  href="#" 
                  className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`flex w-full rounded-md text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 h-11 px-3 bg-white/50 dark:bg-black/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 transition-all ${
                  errors.password ? 'border-red-500 focus:ring-red-500/20' : ''
                }`}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1 animate-in fade-in duration-200">{errors.password}</p>
              )}
            </div>

            {/* Botón de envío */}
            <Button 
              type="submit" 
              className="w-full h-11 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 font-medium transition-all shadow-md active:scale-[0.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4 animate-spin text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Iniciando sesión...</span>
                </span>
              ) : (
                "Entrar"
              )}
            </Button>

          </form>
        </div>

        {/* Enlace inferior */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          ¿No tienes una cuenta?{" "}
          <a 
            href="#" 
            className="text-zinc-900 dark:text-zinc-100 font-medium hover:underline underline-offset-4"
          >
            Solicita acceso
          </a>
        </p>

      </div>
    </main>
  );
}
