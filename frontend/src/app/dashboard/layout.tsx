import { TopNavbar } from "@/components/layouts/TopNavbar";
import { PlasmaBackground } from "@/components/ui/PlasmaBackground";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-hidden text-white selection:bg-[#B9B4FF]/30 flex flex-col relative">
      <PlasmaBackground />

      <TopNavbar />

      <main className="flex-1 relative z-10 pt-16 h-full overflow-hidden">
        <div className="h-full max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
