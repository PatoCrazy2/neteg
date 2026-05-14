"use client";

import { Container } from "./container";
import { Button } from "./button";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export function Navbar() {
  const { scrollY } = useScroll();
  const [isHovered, setIsHovered] = useState(false);

  // Interpolate values based on scroll position (0 to 100 pixels)
  const bgOpacity = useTransform(scrollY, [0, 80], [0.05, 0.7]);
  const blurValue = useTransform(scrollY, [0, 80], [8, 24]);
  const borderColor = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255, 255, 255, 0.03)", "rgba(255, 255, 255, 0.08)"]
  );
  const borderGlow = useTransform(
    scrollY,
    [0, 80],
    ["0px 0px 0px rgba(185, 180, 255, 0)", "0px 4px 20px rgba(185, 180, 255, 0.05)"]
  );

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(0, 0, 0, ${v})`),
        backdropFilter: useTransform(blurValue, (v) => `blur(${v}px)`),
        borderBottom: "1px solid",
        borderBottomColor: borderColor,
        boxShadow: borderGlow,
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-500"
    >
      <Container className="flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="relative h-10 flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative flex items-center justify-center min-w-[120px]">
              <AnimatePresence mode="wait">
                {isHovered ? (
                  <motion.div
                    key="logo-svg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    className="flex items-center justify-center"
                  >
                    <Image 
                      src="/NETEG.svg" 
                      alt="NETEG Logo" 
                      width={130} 
                      height={40} 
                      className="h-10 w-auto brightness-200"
                      style={{ width: "auto" }}
                    />
                  </motion.div>
                ) : (
                  <motion.span
                    key="logo-text"
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -2 }}
                    transition={{ duration: 0.1 }}
                    className="text-3xl font-extrabold tracking-[-0.06em] text-white whitespace-nowrap"
                  >
                    NETEG
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
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
          <Link href="/register" tabIndex={-1}>
            <Button variant="primary" size="sm" className="hidden sm:inline-flex">
              Get Started
            </Button>
          </Link>
        </div>
      </Container>
    </motion.header>
  );
}
