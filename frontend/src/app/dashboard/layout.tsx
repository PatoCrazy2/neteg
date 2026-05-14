import { TopNavbar } from "@/components/layouts/TopNavbar";
import { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-black text-white selection:bg-[#B9B4FF]/30 flex flex-col">
      {/* Background Lighting Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-[#B9B4FF]/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#9C8CFF]/5 blur-[120px] rounded-full" />
      </div>

      <TopNavbar />

      <main className="flex-1 relative z-10 pt-16 h-full overflow-hidden">
        <div className="h-full max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
