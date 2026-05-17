"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Calendar,
  QrCode,
  Award,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { useDashboard, DashboardContext } from "@/app/dashboard/layout";
import { getToken } from "@/lib/api";

const NAV_ITEMS = [
  { label: "Mis Eventos", href: "/dashboard/events", icon: Calendar },
  { label: "Check-in", href: "/dashboard/check-in", icon: QrCode },
  { label: "Certificados", href: "/dashboard/certificates", icon: Award },
];

export function TopNavbar() {
  const pathname = usePathname();
  const context = useContext(DashboardContext);
  const theme = context?.theme || 'default';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [timeString, setTimeString] = useState("");

  const isLight = theme === 'light';

  useEffect(() => {
    setIsLoggedIn(!!getToken());

    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZoneName: 'short'
      };
      setTimeString(now.toLocaleTimeString('en-US', options));
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  // Auto-close mobile menu on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`fixed top-0 left-0 w-full h-16 border-b z-50 transition-colors duration-700 ${isLight ? 'border-black/5 bg-white/40' : 'border-white/5 bg-black/40'
      } backdrop-blur-xl`}>
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-10">
          <Link href={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="relative w-7 h-7 flex items-center justify-center">
              <Image
                src="/NETEG.svg"
                alt="Neteg Logo"
                width={28}
                height={28}
                className="group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <span className={`text-lg font-bold tracking-tighter ${isLight ? 'text-black' : 'text-white'}`}>NETEG</span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-4 py-1.5 text-[13px] font-medium transition-all duration-300 rounded-full
                    ${isActive
                      ? 'text-[#B9B4FF] bg-[#B9B4FF]/10'
                      : `${isLight ? 'text-black/40 hover:text-black hover:bg-black/5' : 'text-white/40 hover:text-white hover:bg-white/5'}`
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 sm:gap-6">
          {/* Real-time Clock */}
          <span className={`hidden sm:block text-lg font-extralight tracking-tighter transition-colors duration-700 tabular-nums ${isLight ? 'text-black/20' : 'text-white/30'
            }`}>
            {timeString}
          </span>

          {isLoggedIn ? (
            <div className="hidden md:block relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-2 p-1 pl-3 rounded-full border transition-all group cursor-pointer ${isLight ? 'border-black/10 bg-black/5 hover:bg-black/10' : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold ${isLight ? 'bg-black/10 text-black/60' : 'bg-white/20 text-white/60'
                  }`}>
                  TU
                </div>
                <ChevronDown size={12} className={`${isLight ? 'text-black/40' : 'text-white/40'} transition-transform duration-300 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className={`absolute right-0 mt-4 w-52 py-2 border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl ${isLight ? 'bg-white border-black/10' : 'bg-[#0B0B0E] border-white/10'
                      }`}
                  >
                    <Link href="/dashboard/profile" className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${isLight ? 'text-black/60 hover:text-black hover:bg-black/5' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}>
                      <User size={16} /> Perfil
                    </Link>
                    <Link href="/dashboard/settings" className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${isLight ? 'text-black/60 hover:text-black hover:bg-black/5' : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}>
                      <Settings size={16} /> Ajustes
                    </Link>
                    <div className={`my-2 border-t ${isLight ? 'border-black/5' : 'border-white/5'}`} />
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");
                        window.location.href = "/login";
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] text-red-400/60 hover:text-red-400 transition-colors text-left cursor-pointer"
                    >
                      <LogOut size={16} /> Cerrar Sesión
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login">
              <button className={`px-6 py-2 rounded-full text-[13px] font-bold transition-all ${isLight ? 'bg-black text-white hover:bg-black/80' : 'bg-[#B9B4FF] text-black hover:bg-[#A8A2FF]'
                }`}>
                Iniciar Sesión
              </button>
            </Link>
          )}

          {/* Hamburger Menu Toggle (Mobile Only) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 transition-all cursor-pointer focus:outline-none ${isLight 
                ? 'text-black hover:text-black/75' 
                : 'text-white hover:text-white/75'
              }`}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`md:hidden absolute top-16 left-0 w-full border-b overflow-hidden ${isLight
                ? 'bg-white border-black/5 text-black'
                : 'bg-[#0B0B0E] border-white/5 text-white'
              }`}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {/* Navigation Section */}
              <div className="flex flex-col gap-1">
                <div className="text-[9px] font-bold uppercase tracking-[0.25em] mb-2 opacity-30">Navegación</div>
                {NAV_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                          ? 'text-[#B9B4FF] bg-[#B9B4FF]/10'
                          : `${isLight ? 'hover:bg-black/5 text-black/60 hover:text-black' : 'hover:bg-white/5 text-white/60 hover:text-white'}`
                        }`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* User Session Quick Actions */}
              {isLoggedIn && (
                <div className={`flex flex-col gap-1 border-t pt-4 mt-2 ${isLight ? 'border-black/5' : 'border-white/5'}`}>
                  <div className="text-[9px] font-bold uppercase tracking-[0.25em] mb-2 opacity-30">Usuario</div>
                  <Link
                    href="/dashboard/profile"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isLight ? 'hover:bg-black/5 text-black/60 hover:text-black' : 'hover:bg-white/5 text-white/60 hover:text-white'
                      }`}
                  >
                    <User size={16} />
                    Mi Perfil
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isLight ? 'hover:bg-black/5 text-black/60 hover:text-black' : 'hover:bg-white/5 text-white/60 hover:text-white'
                      }`}
                  >
                    <Settings size={16} />
                    Ajustes
                  </Link>

                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.location.href = "/login";
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-all text-left cursor-pointer"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
