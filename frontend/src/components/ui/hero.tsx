"use client";

import { motion } from "framer-motion";
import { Badge } from "./badge";
import { Button } from "./button";
import { Container } from "./container";

export function Hero() {
  return (
    <div className="relative pt-24 pb-4 md:pt-32 md:pb-6 overflow-hidden">
      <Container className="relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <Badge className="px-3 py-1 border-primary/20 bg-primary/5 text-primary-strong text-[10px]">
            Neteg 2.0 is live
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl md:text-6xl font-bold tracking-[-0.04em] leading-[1] text-white mb-4 max-w-4xl"
        >
          Architecting the Future of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-strong">
            Presence & Identity
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-lg text-text-secondary max-w-xl mb-8 leading-relaxed"
        >
          The cinematic engine for digital certification and attendee management. 
          Built for scale, designed for impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-row gap-4 items-center justify-center"
        >
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Button variant="primary" size="md" className="relative z-10 px-6">
              Start Building
            </Button>
          </div>
          <Button variant="glass" size="md" className="px-6">
            View Documentation
          </Button>
        </motion.div>
      </Container>
    </div>
  );
}
