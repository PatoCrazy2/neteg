"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  MapPin, 
  Users, 
  AlignLeft, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  Camera,
  Globe,
  Lock,
  Palette,
  Settings2
} from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    capacity: "",
    requiresApproval: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      console.log("Creating event:", formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Error creating event", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left Column: Visual Panel (40%) */}
        <div className="lg:col-span-5 space-y-8 sticky top-0">
          <div className="space-y-4">
            <div className="group relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-white/[0.03] border border-white/5 transition-all duration-500 hover:border-[#B9B4FF]/30">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/10 group-hover:text-[#B9B4FF]/40 transition-all">
                <Camera size={32} strokeWidth={1.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Cover Image</span>
              </div>
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between px-2">
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <button key={i} className="w-6 h-6 rounded-full border border-white/10 bg-white/5 hover:border-[#B9B4FF]/50 transition-all" />
                ))}
                <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white/40 hover:text-white transition-all">
                  <Palette size={12} /> Themes
                </button>
              </div>
              <button className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-all">
                Preview
              </button>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] text-white/40">Status</p>
                <p className="text-xs font-medium text-[#B9B4FF]">Drafting</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-white/40">Visibility</p>
                <p className="text-xs font-medium">Private</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Configuration (60%) */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* Metadata Header */}
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
              <Globe size={12} className="text-[#B9B4FF]" /> Public Event
            </div>
            <div className="flex items-center gap-1.5">
              <Lock size={12} /> Invite Only
            </div>
          </div>

          {/* Editable Heading */}
          <div className="space-y-2">
            <input 
              type="text"
              placeholder="Event Name..."
              className="w-full bg-transparent border-none p-0 text-5xl font-bold focus:outline-none placeholder:text-white/5 tracking-tight leading-tight"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Integrated Inline Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <Calendar size={12} /> Date & Time
              </label>
              <input 
                type="datetime-local"
                className="w-full bg-transparent border-none p-0 text-[15px] font-medium focus:outline-none text-white/80 transition-all"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
                <MapPin size={12} /> Location
              </label>
              <input 
                type="text"
                placeholder="Add physical address or link"
                className="w-full bg-transparent border-none p-0 text-[15px] font-medium focus:outline-none text-white/80 placeholder:text-white/10"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
              <AlignLeft size={12} /> Description
            </label>
            <textarea 
              placeholder="What is this event about?"
              rows={4}
              className="w-full bg-transparent border-none p-0 text-[15px] leading-relaxed focus:outline-none text-white/60 placeholder:text-white/5 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Settings List (List Style) */}
          <div className="pt-6 border-t border-white/5 space-y-1">
            <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Settings2 size={12} /> Preferences
            </h4>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between py-3 group hover:bg-white/[0.02] px-3 -mx-3 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <Users size={16} className="text-white/20" />
                  <span className="text-sm text-white/60">Participant Capacity</span>
                </div>
                <input 
                  type="number"
                  placeholder="Unlimited"
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs w-24 text-right focus:outline-none focus:border-[#B9B4FF]/50"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                />
              </div>

              <div className="flex items-center justify-between py-3 group hover:bg-white/[0.02] px-3 -mx-3 rounded-xl transition-all">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className={formData.requiresApproval ? 'text-[#B9B4FF]' : 'text-white/20'} />
                  <span className="text-sm text-white/60">Manual Approval</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, requiresApproval: !formData.requiresApproval})}
                  className={`w-8 h-4 rounded-full relative transition-colors ${formData.requiresApproval ? 'bg-[#B9B4FF]' : 'bg-white/10'}`}
                >
                  <motion.div 
                    animate={{ x: formData.requiresApproval ? 18 : 2 }}
                    className="absolute top-1 w-2.5 h-2.5 rounded-full bg-white"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Connected CTA */}
          <div className="pt-4">
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSubmit}
              disabled={loading}
              className="group flex items-center gap-3 bg-white text-black px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#B9B4FF] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : (
                <>
                  Create Event
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </div>

        </div>
      </div>
    </div>
  );
}
