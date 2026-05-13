import { cn } from "@/lib/utils";

export function GlowBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden pointer-events-none select-none", className)}>
      {/* 
        Upper-left: White Cinematic Ambient Lighting 
        Layered to create depth and soft falloff
      */}
      <div className="absolute -left-[15%] -top-[15%] h-[1200px] w-[1200px] rounded-full bg-white/[0.02] blur-[180px]" />
      <div className="absolute left-[0%] top-[0%] h-[800px] w-[800px] rounded-full bg-white/[0.015] blur-[140px]" />
      
      {/* 
        Bottom-right: Violet/Purple Hardware Glow 
        Using primary-strong and primary for a deep cinematic purple
      */}
      <div className="absolute -right-[15%] bottom-[0%] h-[1300px] w-[1300px] rounded-full bg-[#9C8CFF]/[0.04] blur-[200px]" />
      <div className="absolute right-[5%] bottom-[10%] h-[900px] w-[900px] rounded-full bg-[#B9B4FF]/[0.02] blur-[150px]" />

      {/* 
        Fine radial overlays for surface illumination feel 
      */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.03),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(156,140,255,0.04),transparent_55%)]" />
      
      {/* Subtile vignette to keep the center clean and the edges moody */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  );
}
