import { StickyNavbar } from './components/landing/StickyNavbar';
import { HeroSection } from './components/landing/HeroSection';
import { AstIntelligenceSection } from './components/landing/AstIntelligenceSection';
import { StudioSection } from './components/landing/StudioSection';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { IntegrationsSection } from './components/landing/IntegrationsSection';
import { PreFooterSection } from './components/landing/PreFooterSection';
import { FooterSection } from './components/landing/FooterSection';

export default function App() {
  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col text-[#141414] font-sans selection:bg-[#e5e5e5]">
      {/* Sticky Top Nav (Activates smoothly on scroll) */}
      <StickyNavbar />

      <main className="flex-1 flex flex-col">
        {/* 1. Hero Card with In-Card Nav, Copy, and Workbench */}
        <HeroSection />

        {/* 2. AI Tools: AST Intelligence + 8-bit Glyph Matrix */}
        <AstIntelligenceSection />

        {/* 3. Interactive Studio: Python Debugging Studio */}
        <StudioSection />

        {/* 4. Customer Love: Loved by developers */}
        <TestimonialsSection />

        {/* 5. Integrations: Ecosystem & Tooling */}
        <IntegrationsSection />

        {/* 6. Pre-Footer: Dark Grid Banner */}
        <PreFooterSection />
      </main>

      {/* 7. Footer: 4-Column Deep Black Footer */}
      <FooterSection />
    </div>
  );
}
