"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function PlasmaBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none bg-black">
      {/* Container with Gooey Filter effect if possible, or just cleaner blobs */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen">
        {/* Sphere 1 */}
        <motion.div 
          animate={{
            x: ["-10%", "20%", "-5%", "-10%"],
            y: ["-10%", "15%", "10%", "-10%"],
            scale: [1, 1.2, 0.9, 1],
            borderRadius: ["40% 60% 70% 30% / 40% 50% 60% 50%", "50% 50% 20% 80% / 25% 80% 20% 75%", "40% 60% 70% 30% / 40% 50% 60% 50%"]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute w-[60vw] h-[60vw] bg-[#B9B4FF] blur-[80px]"
        />
        
        {/* Sphere 2 */}
        <motion.div 
          animate={{
            x: ["80%", "60%", "90%", "80%"],
            y: ["70%", "85%", "60%", "70%"],
            scale: [1, 1.3, 1.1, 1],
            borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "60% 40% 30% 70% / 60% 30% 70% 40%", "30% 70% 70% 30% / 30% 30% 70% 70%"]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 1
          }}
          className="absolute w-[50vw] h-[50vw] bg-[#9C8CFF] blur-[100px]"
        />

        {/* Sphere 3 */}
        <motion.div 
          animate={{
            x: ["20%", "70%", "40%", "20%"],
            y: ["60%", "20%", "50%", "60%"],
            scale: [1, 1.5, 1.2, 1],
            borderRadius: ["50% 50% 50% 50% / 50% 50% 50% 50%", "80% 20% 80% 20% / 20% 80% 20% 80%", "50% 50% 50% 50% / 50% 50% 50% 50%"]
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          className="absolute w-[45vw] h-[45vw] bg-[#B9B4FF] blur-[110px] opacity-60"
        />
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Dark gradient to ensure readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
    </div>
  );
}
