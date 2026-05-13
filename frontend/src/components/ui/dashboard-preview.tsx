"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DashboardPreview({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="perspective-1000"
    >
      <motion.div
        animate={{ 
          y: [0, -15, 0],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className={cn(
          "relative mx-auto w-full max-w-5xl rounded-[2.5rem] border border-white/10 bg-surface/30 p-3 backdrop-blur-3xl",
          "shadow-[0_0_120px_rgba(185,180,255,0.1)]",
          className
        )}
      >
        <div className="relative overflow-hidden rounded-[1.8rem] bg-black/90 aspect-[16/10] border border-white/5">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-14 bg-white/[0.02] border-b border-white/5 flex items-center px-8 gap-2.5">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
          </div>
          
          {/* Content Mockup */}
          <div className="p-10 pt-24 flex flex-col gap-10 h-full">
            <div className="h-10 w-72 bg-white/5 rounded-xl animate-pulse" />
            <div className="flex gap-8 h-40">
              <div className="flex-1 bg-white/5 rounded-3xl border border-white/5" />
              <div className="flex-1 bg-white/5 rounded-3xl border border-white/5" />
              <div className="flex-1 bg-white/5 rounded-3xl border border-white/5" />
            </div>
            <div className="flex-1 bg-white/5 rounded-3xl border border-white/5" />
          </div>
          
          {/* Layered Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
        </div>
      </motion.div>
    </motion.div>
  );
}
