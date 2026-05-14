"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function GlassCard({ children, className = "", delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.23, 1, 0.32, 1] }}
      className={`
        relative overflow-hidden
        bg-[rgba(255,255,255,0.03)]
        backdrop-blur-xl
        border border-[rgba(255,255,255,0.08)]
        rounded-2xl
        shadow-2xl
        ${className}
      `}
    >
      {/* Ambient Inner Glow */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[rgba(185,180,255,0.05)] to-transparent" />
      
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
}
