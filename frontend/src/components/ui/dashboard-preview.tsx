"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DashboardPreview({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative mx-auto w-full max-w-5xl rounded-[2rem] border border-border-custom bg-surface/50 p-2 backdrop-blur-2xl shadow-[0_0_80px_rgba(185,180,255,0.15)]",
        className
      )}
    >
      <div className="relative overflow-hidden rounded-[1.5rem] bg-black/80 aspect-video border border-white/5">
        <div className="absolute top-0 left-0 right-0 h-12 bg-surface/80 border-b border-white/5 flex items-center px-6 gap-2">
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
          <div className="w-3 h-3 rounded-full bg-white/20" />
        </div>
        <div className="p-8 pt-20 flex flex-col gap-6 h-full">
          <div className="h-8 w-64 bg-white/5 rounded-lg" />
          <div className="flex gap-6 h-32">
            <div className="flex-1 bg-white/5 rounded-2xl border border-white/5" />
            <div className="flex-1 bg-white/5 rounded-2xl border border-white/5" />
            <div className="flex-1 bg-white/5 rounded-2xl border border-white/5" />
          </div>
          <div className="flex-1 bg-white/5 rounded-2xl border border-white/5" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />
      </div>
    </motion.div>
  );
}
