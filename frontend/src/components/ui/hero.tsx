"use client";

import { motion } from "framer-motion";
import { Badge } from "./badge";
import { Button } from "./button";
import { Container } from "./container";

export function Hero() {
  return (
    <div className="relative pt-56 pb-24 md:pt-72 md:pb-40 overflow-hidden">
      <Container className="relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <Badge className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary-strong">
            Neteg 2.0 is live
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-7xl md:text-[10rem] font-bold tracking-[-0.06em] leading-[0.85] text-white mb-12 max-w-5xl"
        >
          Automate <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
            Excellence.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-text-secondary max-w-2xl mb-20 leading-relaxed"
        >
          The cinematic engine for digital certification and attendee management. 
          Built for scale, designed for impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <div className="relative group">
            {/* Atmospheric glow for CTA */}
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Button variant="primary" size="lg" className="relative z-10 px-10">
              Start Building
            </Button>
          </div>
          <Button variant="glass" size="lg" className="px-10">
            View Documentation
          </Button>
        </motion.div>
      </Container>
    </div>
  );
}
