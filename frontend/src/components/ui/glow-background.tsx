import { cn } from "@/lib/utils";

export function GlowBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-black", className)}>
      {/* 
        Upper-left: Concentrated White-Grey Light Sphere
      */}
      <div className="absolute -left-[5%] -top-[5%] h-[900px] w-[900px] rounded-full bg-white/[0.07] blur-[120px]" />
      <div className="absolute left-[2%] top-[2%] h-[400px] w-[400px] rounded-full bg-white/[0.1] blur-[80px]" />
      
      {/* 
        Lower-right: Concentrated Purple/Violet Light Sphere
      */}
      <div className="absolute -right-[5%] bottom-[10%] h-[1000px] w-[1000px] rounded-full bg-[#9C8CFF]/[0.12] blur-[150px]" />
      <div className="absolute right-[0%] bottom-[15%] h-[500px] w-[500px] rounded-full bg-[#B9B4FF]/[0.08] blur-[100px]" />

      {/* 
        Fine radial overlays to emphasize the "sphere" core 
      */}
      <div className="absolute top-[5%] left-[5%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(255,255,255,0.1),transparent_70%)] blur-2xl" />
      <div className="absolute bottom-[15%] right-[5%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(156,140,255,0.15),transparent_70%)] blur-2xl" />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
    </div>
  );
}
