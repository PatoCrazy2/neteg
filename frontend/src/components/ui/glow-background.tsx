import { cn } from "@/lib/utils";

export function GlowBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-black", className)}>
      {/* 
        Upper-left: High-Intensity White Light
      */}
      <div className="absolute -left-[5%] -top-[5%] h-[800px] w-[800px] rounded-full bg-white/[0.15] blur-[120px] mix-blend-screen" />
      <div className="absolute left-[0%] top-[0%] h-[400px] w-[400px] rounded-full bg-white/[0.2] blur-[80px] mix-blend-screen" />

      {/* 
        Lower-right: High-Intensity Purple/Violet Light
      */}
      <div className="absolute -right-[5%] -bottom-[5%] h-[900px] w-[900px] rounded-full bg-[#9C8CFF]/[0.2] blur-[150px] mix-blend-screen" />
      <div className="absolute right-[0%] bottom-[0%] h-[500px] w-[500px] rounded-full bg-[#B9B4FF]/[0.15] blur-[100px] mix-blend-screen" />

      {/* 
        Core Highlights
      */}
      <div className="absolute top-[2%] left-[2%] w-[300px] h-[300px] bg-white/[0.25] blur-[60px] rounded-full mix-blend-screen" />
      <div className="absolute bottom-[2%] right-[2%] w-[350px] h-[350px] bg-[#9C8CFF]/[0.3] blur-[70px] rounded-full mix-blend-screen" />

      {/* Deep Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}
