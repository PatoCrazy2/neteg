import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/ui/hero";
import { DashboardPreview } from "@/components/ui/dashboard-preview";
import { GlowBackground } from "@/components/ui/glow-background";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { GlassCard } from "@/components/ui/glass-card";
import { Fingerprint, Zap, Globe } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-text-primary selection:bg-primary/30 selection:text-white">
      <Navbar />
      <GlowBackground />
      
      {/* Hero Section with Dashboard Preview */}
      <section className="relative">
        <Hero />
        <Container className="pb-32">
          <DashboardPreview />
        </Container>
      </section>

      {/* Features Section */}
      <Section id="features" className="bg-surface relative border-t border-border-custom overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <Container>
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Precision engineered.
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Built on a modern stack with uncompromising attention to detail. Neteg delivers 
              performance and aesthetics without sacrificing reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <Zap className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Asynchronous Engine</h3>
              <p className="text-text-secondary leading-relaxed">
                PDF rendering decoupled entirely from the API. Zero blocking, maximum throughput with Playwright-powered background workers.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <Globe className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">S3 / R2 Native</h3>
              <p className="text-text-secondary leading-relaxed">
                Immutable, distributed asset storage. Files are generated and uploaded directly to the edge, never touching local disks.
              </p>
            </GlassCard>

            <GlassCard>
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                <Fingerprint className="text-primary w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cryptographic Verity</h3>
              <p className="text-text-secondary leading-relaxed">
                Every diploma is uniquely identifiable and instantly verifiable via secure QR indexing, protecting your brand's integrity.
              </p>
            </GlassCard>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="relative border-t border-border-custom">
        <GlowBackground className="opacity-50" />
        <Container className="text-center max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
            Ready to scale?
          </h2>
          <p className="text-xl text-text-secondary mb-12">
            Join the most ambitious organizations using Neteg to deliver premium digital certificates at unprecedented scale.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="h-14 px-8 rounded-2xl bg-white text-black font-medium text-lg hover:bg-gray-200 transition-colors">
              Deploy to Production
            </button>
            <button className="h-14 px-8 rounded-2xl bg-glass border border-border-custom text-white font-medium text-lg hover:bg-white/5 backdrop-blur-md transition-colors">
              Contact Sales
            </button>
          </div>
        </Container>
      </Section>
    </main>
  );
}
