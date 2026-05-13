import { cn } from "@/lib/utils";

export function GlowBackground({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 -z-10 overflow-hidden pointer-events-none", className)}>
      <div className="absolute left-[20%] top-[10%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px] opacity-60 mix-blend-screen" />
      <div className="absolute right-[10%] top-[40%] h-[500px] w-[500px] rounded-full bg-primary-strong/10 blur-[100px] opacity-40 mix-blend-screen" />
    </div>
  );
}
