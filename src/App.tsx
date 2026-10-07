import { ConvexNavbar } from './components/convex/ConvexNavbar';
import { ConvexHero } from './components/convex/ConvexHero';
import { ConvexLlmsSection } from './components/convex/ConvexLlmsSection';
import { ConvexProductSection } from './components/convex/ConvexProductSection';
import { ConvexTestimonialsSection } from './components/convex/ConvexTestimonialsSection';
import { ConvexFrameworksSection } from './components/convex/ConvexFrameworksSection';
import { ConvexPreFooter } from './components/convex/ConvexPreFooter';
import { ConvexFooter } from './components/convex/ConvexFooter';

export default function App() {
  return (
    <div className="min-h-screen bg-[#eeede4] flex flex-col text-[#141414] font-sans selection:bg-[#dfdacd]">
      {/* Sticky Top Nav (Activates smoothly on scroll) */}
      <ConvexNavbar />

      <main className="flex-1 flex flex-col">
        {/* 1. Giant Olive Hero Card with In-Card Nav, Copy, and Terracotta Workbench (Video 00:00 - 00:02) */}
        <ConvexHero />

        {/* 2. AI Tools: LLMs love Convex + 8-bit Glyph Matrix (Video 00:02 - 00:03) */}
        <ConvexLlmsSection />

        {/* 3. Product: Not just a database + Cyan CTA + Isometric 10 Badges (Video 00:04 - 00:06) */}
        <ConvexProductSection />

        {/* 4. Customer Love: Loved by developers + 3-Col Dark Tweet Masonry (Video 00:07 - 00:10) */}
        <ConvexTestimonialsSection />

        {/* 5. Integrations: Convex ❤️ your favorite frameworks (Video 00:11) */}
        <ConvexFrameworksSection />

        {/* 6. Pre-Footer: Dark Grid Banner + Copper Brackets (Video 00:12 - 00:13) */}
        <ConvexPreFooter />
      </main>

      {/* 7. Footer: 4-Column Deep Black Footer (Video 00:13 - 00:14) */}
      <ConvexFooter />
    </div>
  );
}
