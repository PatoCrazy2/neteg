"use client";

import { Container } from "./container";
import { Button } from "./button";
import { motion } from "framer-motion";
import Link from "next/link";

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border-custom/50 bg-black/40 backdrop-blur-2xl"
    >
      <Container className="flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tighter text-white">
            NETEG
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-text-secondary">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Button variant="primary" size="sm" className="hidden sm:inline-flex">
            Get Started
          </Button>
        </div>
      </Container>
    </motion.header>
  );
}
