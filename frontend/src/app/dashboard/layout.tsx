"use client";

import { TopNavbar } from "@/components/layouts/TopNavbar";
import { PlasmaBackground } from "@/components/ui/PlasmaBackground";
import { ReactNode, useEffect, useState, createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";

type Theme = 'default' | 'black' | 'light';

interface DashboardContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [theme, setTheme] = useState<Theme>('default');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B9B4FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <DashboardContext.Provider value={{ theme, setTheme }}>
      <div className={`h-screen overflow-hidden transition-colors duration-700 flex flex-col relative ${
        theme === 'light' ? 'bg-white text-black' : 'bg-black text-white'
      } selection:bg-[#B9B4FF]/30`}>
        
        {theme === 'default' && <PlasmaBackground />}

        <TopNavbar />

        <main className="flex-1 relative z-10 pt-16 h-full overflow-hidden">
          <div className="h-full max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </DashboardContext.Provider>
  );
}
