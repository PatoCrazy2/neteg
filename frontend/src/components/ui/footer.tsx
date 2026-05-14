"use client";

import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.03] pt-24 pb-12 overflow-hidden bg-black">
      {/* Background ambient fade - very subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
          {/* Section 1: Logo & Tagline */}
          <div className="lg:col-span-4 space-y-8">
            <div className="inline-block opacity-90 cursor-default">
              <Image
                src="/NETEG.svg"
                alt="NETEG Logo"
                width={110}
                height={32}
                className="h-8 w-auto brightness-200"
              />
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-[280px]">
              Automatización inteligente para eventos y certificaciones digitales.
            </p>

            {/* Social Icons - Minimalistic (Using direct SVG to avoid dependency issues) */}
            <div className="flex items-center gap-6 pt-2">
              <Link
                href="https://github.com/PatoCrazy2/neteg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors"
                aria-label="GitHub Repository"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5-.73 1.02-1.08 2.25-1 3.5 0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </Link>
            </div>
          </div>

          {/* Section 2: Navigation */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Explore</h4>
            <ul className="space-y-4">
              <li><Link href="#features" className="text-sm text-text-secondary hover:text-primary transition-colors duration-300">Features</Link></li>
              <li><Link href="/dashboard" className="text-sm text-text-secondary hover:text-primary transition-colors duration-300">Dashboard</Link></li>
              <li><Link href="/pricing" className="text-sm text-text-secondary hover:text-primary transition-colors duration-300">Pricing</Link></li>
              <li><Link href="/faq" className="text-sm text-text-secondary hover:text-primary transition-colors duration-300">FAQ</Link></li>
              <li><Link href="/contact" className="text-sm text-text-secondary hover:text-primary transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Section 3: Legal */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Governance</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-sm text-text-secondary hover:text-primary transition-colors duration-300">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm text-text-secondary hover:text-primary transition-colors duration-300">Terms</Link></li>
              <li><Link href="/security" className="text-sm text-text-secondary hover:text-primary transition-colors duration-300">Security</Link></li>
              <li><Link href="/status" className="text-sm text-text-secondary hover:text-primary transition-colors duration-300">Status</Link></li>
            </ul>
          </div>

          {/* Section 4: CTA - Premium Look */}
          <div className="lg:col-span-4 lg:pl-8">
            <div className="relative p-8 rounded-3xl bg-white/[0.015] border border-white/[0.04] overflow-hidden group">
              {/* Animated hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

              <div className="relative z-10 space-y-5">
                <h4 className="text-lg font-medium text-white/90">
                  Empieza a automatizar tus eventos hoy.
                </h4>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-5 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-white/90 transition-all hover:translate-y-[-1px] active:translate-y-[1px]"
                >
                  Join Neteg
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <span className="text-[11px] text-white/20 font-medium tracking-tight">
              © 2026 NETEG. All rights reserved.
            </span>
            <div className="hidden md:block w-1 h-1 rounded-full bg-white/5" />
            <span className="text-[11px] text-white/20 font-medium tracking-tight">
              Built for modern event infrastructure.
            </span>
          </div>

          {/* Contributors - Very subtle */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/PatoCrazy2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/10 group-hover:text-white/40 transition-colors">
                PatoCrazy2
              </span>
            </a>
            <div className="w-[1px] h-3 bg-white/5" />
            <a
              href="https://github.com/nestortlachi22-cmyk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 group"
            >
              <span className="text-[9px] uppercase tracking-[0.3em] text-white/10 group-hover:text-white/40 transition-colors">
                ChesseT
              </span>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
