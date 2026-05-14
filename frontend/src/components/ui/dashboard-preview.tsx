import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  Calendar, 
  BarChart3, 
  Settings, 
  Bell, 
  Search,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  ExternalLink
} from "lucide-react";

type PageId = "dashboard" | "members" | "certificates" | "events" | "analytics" | "settings";

interface DashboardPreviewProps {
  className?: string;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
}

export function DashboardPreview({ className, mouseX: externalX, mouseY: externalY }: DashboardPreviewProps) {
  const [activeTab, setActiveTab] = useState<PageId>("dashboard");
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parallax / Tilt Logic
  const internalX = useMotionValue(0);
  const internalY = useMotionValue(0);

  // Use external values if provided, otherwise use internal
  const x = externalX || internalX;
  const y = externalY || internalY;

  // FAST & RESPONSIVE: Increased stiffness and reduced mass to eliminate delay
  const springConfig = { stiffness: 150, damping: 22, mass: 1 };
  const mouseXSpring = useSpring(x, { ...springConfig });
  const mouseYSpring = useSpring(y, { ...springConfig });

  // When hovered, we want to drive the tilt to 0.
  const tiltScale = useSpring(isHovered ? 0 : 1, { stiffness: 150, damping: 25 });

  // PUSH AWAY EFFECT: The side you point at moves BACK
  // Properly combine mouse movement and tilt scale for reactive updates
  // TILT TOWARDS CURSOR: Side being pointed at comes forward
  // Properly combine mouse movement and tilt scale for reactive updates
  const rotateX = useTransform(
    [mouseYSpring, tiltScale],
    ([yVal, scale]) => `${(yVal as number) * 35 * (scale as number)}deg`
  );
  
  const rotateY = useTransform(
    [mouseXSpring, tiltScale],
    ([xVal, scale]) => `${(xVal as number) * -50 * (scale as number)}deg`
  );

  // Reset translation (Fixed Camera)
  const translateX = 0;
  const translateY = 0;

  // Glow position logic
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowXSpring = useSpring(glowX, { stiffness: 300, damping: 30 });
  const glowYSpring = useSpring(glowY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (externalX) {
      // Still update glow position even if tilt is external
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      glowX.set(e.clientX - rect.left);
      glowY.set(e.clientY - rect.top);
      return; 
    }
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    
    internalX.set(normalizedX);
    internalY.set(normalizedY);

    glowX.set(e.clientX - rect.left);
    glowY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (externalX) return;
    internalX.set(0);
    internalY.set(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("perspective-1000 relative group", className)}
    >
      {/* Cinematic Main Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          translateX,
          translateY,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto w-full max-w-6xl rounded-[2.5rem] border border-white/10 bg-surface/20 p-2 backdrop-blur-3xl will-change-transform"
      >
        {/* Interactive Surface */}
        <div className="relative overflow-hidden rounded-[2rem] bg-[#0A0A0B] aspect-[16/10] border border-white/5 flex flex-col shadow-2xl">
          
          {/* Custom Cursor Glow Layer - MINIMALIST */}
          <motion.div 
            style={{
              left: glowXSpring,
              top: glowYSpring,
              translateX: "-50%",
              translateY: "-50%",
            }}
            className="absolute pointer-events-none w-48 h-48 bg-primary/[0.03] blur-[60px] rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          />

          <div className="flex flex-1 overflow-hidden z-10">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 flex flex-col shrink-0 p-4 bg-white/[0.01]">
              <div className="flex items-center gap-4 px-3 py-2 mb-10">
                <div className="w-10 h-10 bg-primary-strong rounded-xl flex items-center justify-center shadow-lg shadow-primary-strong/20">
                  <Image src="/NETEG.svg" alt="Logo" width={20} height={20} className="brightness-200" />
                </div>
                <span className="font-black tracking-tighter text-white text-xl">NETEG</span>
              </div>

              <div className="space-y-1">
                <SidebarItem 
                  icon={<LayoutDashboard size={18} />} 
                  label="Dashboard" 
                  active={activeTab === "dashboard"} 
                  onClick={() => setActiveTab("dashboard")} 
                />
                <SidebarItem 
                  icon={<Users size={18} />} 
                  label="Members" 
                  active={activeTab === "members"} 
                  onClick={() => setActiveTab("members")} 
                />
                <SidebarItem 
                  icon={<Award size={18} />} 
                  label="Certificates" 
                  active={activeTab === "certificates"} 
                  onClick={() => setActiveTab("certificates")} 
                />
                <SidebarItem 
                  icon={<Calendar size={18} />} 
                  label="Events" 
                  active={activeTab === "events"} 
                  onClick={() => setActiveTab("events")} 
                />
                <SidebarItem 
                  icon={<BarChart3 size={18} />} 
                  label="Analytics" 
                  active={activeTab === "analytics"} 
                  onClick={() => setActiveTab("analytics")} 
                />
              </div>

              <div className="mt-auto pt-4 border-t border-white/5">
                <SidebarItem 
                  icon={<Settings size={18} />} 
                  label="Settings" 
                  active={activeTab === "settings"} 
                  onClick={() => setActiveTab("settings")} 
                />
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar bg-black/40">
              <div className="p-8 min-h-full flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex-1"
                  >
                    {activeTab === "dashboard" && <DashboardPage />}
                    {activeTab === "members" && <MembersPage />}
                    {activeTab === "certificates" && <CertificatesPage />}
                    {activeTab === "events" && <EventsPage />}
                    {activeTab === "analytics" && <AnalyticsPage />}
                    {activeTab === "settings" && <SettingsPage />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>

          {/* Depth Effects */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
        </div>
      </motion.div>

      {/* Hero Visual Integration - Floor Shadow */}
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[80%] h-24 bg-primary/10 blur-[80px] rounded-full opacity-50 z-0 pointer-events-none" />
    </div>
  );
}

// --- Sub-components ---

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group/item",
        active 
          ? "bg-white/10 text-white shadow-[inset_0_0_12px_rgba(255,255,255,0.02)]" 
          : "text-white/40 hover:text-white/80 hover:bg-white/[0.03]"
      )}
    >
      <div className={cn("transition-colors duration-300", active ? "text-primary" : "group-hover/item:text-white")}>
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
      {active && (
        <motion.div 
          layoutId="active-nav" 
          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-strong shadow-[0_0_10px_#9C8CFF]"
        />
      )}
    </button>
  );
}

// --- Mock Pages ---

function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Overview</h1>
          <p className="text-white/40 text-sm">Real-time infrastructure health and certificate generation metrics.</p>
        </div>
        <button className="bg-primary-strong text-black text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:brightness-110 transition-all shadow-lg shadow-primary-strong/20">
          <Plus size={16} /> New Event
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Certificates" value="12,842" trend="+12.5%" icon={<Award className="text-primary" />} />
        <StatCard label="Active Members" value="2,401" trend="+5.2%" icon={<Users className="text-primary" />} />
        <StatCard label="Live Events" value="18" trend="+2" icon={<Calendar className="text-primary" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MockGraphCard title="Generation Velocity" />
        <ActivityFeed />
      </div>

      <div className="h-48 rounded-3xl border border-white/5 bg-white/[0.02] p-6 flex flex-col justify-center items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
          <Clock size={20} className="text-white/20" />
        </div>
        <p className="text-white/40 text-sm">Waiting for scheduled tasks to complete...</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon }: { label: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] group/card hover:bg-white/[0.04] transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-white/5 group-hover/card:bg-white/10 transition-colors">
          {icon}
        </div>
        <div className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
          {trend}
        </div>
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-white/40 font-medium">{label}</div>
    </div>
  );
}

function MockGraphCard({ title }: { title: string }) {
  return (
    <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col h-72">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-sm font-bold text-white/80">{title}</h3>
        <ArrowUpRight size={14} className="text-white/40" />
      </div>
      <div className="flex-1 flex items-end gap-2 pb-2">
        {[40, 60, 45, 80, 55, 90, 70, 85, 95, 60, 40, 50, 30, 45, 60, 55].map((h, i) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 1, delay: i * 0.05 }}
            className="flex-1 bg-gradient-to-t from-primary/10 to-primary-strong/40 rounded-t-sm"
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between text-[10px] font-medium text-white/20 uppercase tracking-widest">
        <span>08:00 AM</span>
        <span>12:00 PM</span>
        <span>04:00 PM</span>
        <span>08:00 PM</span>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const activities = [
    { user: "Sarah K.", action: "Verified certificate #8291", time: "2m ago" },
    { user: "Marcus V.", action: "Registered for Global Tech Summit", time: "12m ago" },
    { user: "Luma Dev", action: "Updated template configuration", time: "1h ago" },
    { user: "System", action: "Successfully deployed worker v2.1.0", time: "2h ago" },
  ];

  return (
    <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col h-72 overflow-hidden">
      <h3 className="text-sm font-bold text-white/80 mb-6">Recent Activity</h3>
      <div className="space-y-5">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-white/90">{a.user}</span>
                <span className="text-[10px] font-medium text-white/20 uppercase">{a.time}</span>
              </div>
              <p className="text-[11px] text-white/40">{a.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MembersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Platform Members</h1>
      <div className="rounded-3xl border border-white/5 bg-white/[0.01] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/[0.03] text-[10px] uppercase font-bold text-white/30 tracking-widest">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Activity</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="text-xs text-white/60 divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors group/row">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20" />
                    <div>
                      <div className="text-white font-medium">User Prototype_{i}</div>
                      <div className="text-[10px] text-white/30">user_{i}@neteg.io</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span>Active</span>
                  </div>
                </td>
                <td className="px-6 py-4">Manager</td>
                <td className="px-6 py-4">2 mins ago</td>
                <td className="px-6 py-4 text-right">
                  <MoreHorizontal size={14} className="ml-auto text-white/20 group-hover/row:text-white/60 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white">Certificates Registry</h1>
          <p className="text-white/40 text-sm">Manage and verify cryptographic identity assets.</p>
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-9 rounded-xl border border-white/5 bg-white/[0.03] flex items-center justify-center text-white/40">
            <Search size={16} />
          </div>
          <div className="h-9 px-4 rounded-xl border border-white/5 bg-white/[0.03] flex items-center gap-2 text-xs font-bold text-white/60">
            Filters
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex items-center gap-4 group/item cursor-pointer hover:bg-white/[0.04] transition-all">
            <div className="w-20 h-14 rounded-lg bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 opacity-10 flex items-center justify-center font-black text-[10px]">NETEG</div>
              <Award size={20} className="text-white/20 group-hover/item:text-primary transition-colors" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-white mb-1">Global UX Award 2024</div>
              <div className="text-[10px] text-white/40 font-mono">HASH: 8e2a...91bc</div>
            </div>
            <CheckCircle2 size={16} className="text-green-500/40" />
          </div>
        ))}
      </div>

      <div className="mt-8 p-12 rounded-[2rem] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center">
          <Award size={32} className="text-white/10" />
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-white/60">No pending generations</div>
          <div className="text-xs text-white/20">All workers are currently on idle state</div>
        </div>
      </div>
    </div>
  );
}

function EventsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Events Matrix</h1>
      <div className="grid grid-cols-1 gap-4">
        {[
          { name: "Neon Tech Night", date: "May 24, 2024", attendees: 450, status: "Active" },
          { name: "Vercel Ship 2024", date: "June 12, 2024", attendees: 1200, status: "Draft" },
          { name: "Stripe Connect Live", date: "July 02, 2024", attendees: 800, status: "Ended" },
        ].map((event, i) => (
          <div key={i} className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] flex items-center justify-between hover:bg-white/[0.04] transition-all group/item">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Calendar className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover/item:text-primary transition-colors">{event.name}</h3>
                <div className="flex items-center gap-4 text-[11px] text-white/30 font-medium">
                  <span>{event.date}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span>{event.attendees} Registered</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                event.status === "Active" ? "bg-green-500/10 border-green-500/20 text-green-500" :
                event.status === "Draft" ? "bg-white/5 border-white/10 text-white/40" :
                "bg-red-500/10 border-red-500/20 text-red-500"
              )}>
                {event.status}
              </span>
              <button className="p-2 rounded-xl bg-white/5 text-white/20 hover:text-white transition-colors">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">System Analytics</h1>
      <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] flex flex-col h-[400px]">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="text-4xl font-bold text-white mb-1">99.98%</div>
            <div className="text-xs text-white/40 font-medium uppercase tracking-widest">Global Uptime</div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 px-4 rounded-lg bg-white/5 flex items-center text-[10px] font-bold text-white/60">Day</div>
            <div className="h-8 px-4 rounded-lg bg-primary/20 border border-primary/30 flex items-center text-[10px] font-bold text-white">Week</div>
            <div className="h-8 px-4 rounded-lg bg-white/5 flex items-center text-[10px] font-bold text-white/60">Month</div>
          </div>
        </div>
        
        <div className="flex-1 flex items-end gap-1 relative overflow-hidden">
          {/* Mock Graph Lines */}
          <div className="absolute inset-0 flex flex-col justify-between opacity-10">
            <div className="h-px w-full bg-white" />
            <div className="h-px w-full bg-white" />
            <div className="h-px w-full bg-white" />
            <div className="h-px w-full bg-white" />
          </div>
          
          {Array.from({ length: 40 }).map((_, i) => {
            const h = 40 + Math.random() * 50;
            return (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ duration: 1.5, delay: i * 0.02 }}
                className="flex-1 bg-primary/20 rounded-t-[2px] relative group/bar"
              >
                <div className="absolute inset-0 bg-primary opacity-0 group-hover/bar:opacity-50 transition-opacity" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <div className="max-w-2xl space-y-12">
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">Worker Configuration</h3>
          <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Automatic Retries</div>
                <div className="text-xs text-white/40">Retry failed PDF jobs up to 3 times.</div>
              </div>
              <div className="w-10 h-5 rounded-full bg-primary/40 border border-primary/50 relative">
                <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">High Performance Mode</div>
                <div className="text-xs text-white/40">Enable multi-instance Chromium rendering.</div>
              </div>
              <div className="w-10 h-5 rounded-full bg-white/10 border border-white/10 relative">
                <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white/20" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest">Danger Zone</h3>
          <div className="p-6 rounded-3xl border border-red-500/10 bg-red-500/5 space-y-4">
            <div className="text-sm font-medium text-red-500">Flush Job Queue</div>
            <p className="text-xs text-red-500/40">This will permanently delete all pending jobs in Redis. This action cannot be undone.</p>
            <button className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold hover:bg-red-500/20 transition-all">
              Clear Queue
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
