"use client";

import { motion } from "framer-motion";
import { Badge } from "./badge";
import { Button } from "./button";
import { Container } from "./container";

export function Hero() {
  return (
    <div className="relative pt-40 pb-20 md:pt-52 md:pb-32 overflow-hidden">
      <Container className="relative z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Badge className="mb-8">Neteg 2.0 is live</Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl font-bold tracking-[-0.05em] leading-[0.95] text-white mb-8 max-w-4xl"
        >
          Event management, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-strong">
            reimagined.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-text-secondary max-w-2xl mb-12"
        >
          The cinematic standard for digital certification and attendee management. 
          Automated workflows, premium delivery, zero friction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button variant="primary" size="lg">
            Start Building
          </Button>
          <Button variant="glass" size="lg">
            View Documentation
          </Button>
        </motion.div>
      </Container>
    </div>
  );
}
