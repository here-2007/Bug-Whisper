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
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col text-[#141414] font-sans selection:bg-[#e5e5e5]">
      {/* 1. Convex Top Navigation Bar */}
      <ConvexNavbar />

      {/* Main Page Flow Matching Reference Video */}
      <main className="flex-1 flex flex-col">
        {/* 2. Hero Section + Interactive Workbench (Video 00:00 - 00:02) */}
        <ConvexHero />

        {/* 3. LLMs love Convex + Glyph Matrix (Video 00:02 - 00:03) */}
        <ConvexLlmsSection />

        {/* 4. Not just a database - Dusk Gradient & Isometric Blueprint (Video 00:04 - 00:06) */}
        <ConvexProductSection />

        {/* 5. Loved by developers - 3-Column Tweet Grid (Video 00:07 - 00:10) */}
        <ConvexTestimonialsSection />

        {/* 6. Convex ❤️ your favorite frameworks (Video 00:11) */}
        <ConvexFrameworksSection />

        {/* 7. Pre-Footer Dark Grid Banner (Video 00:12 - 00:13) */}
        <ConvexPreFooter />
      </main>

      {/* 8. Convex 4-Column Footer (Video 00:13) */}
      <ConvexFooter />
    </div>
  );
}
