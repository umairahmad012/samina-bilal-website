import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import PillarCards from "@/components/PillarCards";
import CommunitiesGrid from "@/components/CommunitiesGrid";
import PathTeaser from "@/components/PathTeaser";
import ClosingsGallery from "@/components/ClosingsGallery";
import ReviewsStrip from "@/components/ReviewsStrip";
import DarkBreak from "@/components/DarkBreak";
import { getSection, resolveImageUrl } from "@/lib/contentLoader";

// Render dynamically so admin edits to content_blocks show up without
// a full rebuild. (Performance: reads are sub-100ms from Supabase EU/US.)
export const dynamic = "force-dynamic";

type DarkBreakContent = {
  backgroundImage?: { image_id?: string };
  eyebrow: string;
  quote: string;
  attribution: string;
};

const DB1_FALLBACK_BG = "/images/Light%20Interior/A.%20Light%20interior1.png";
const DB1_DEFAULT_EYEBROW = "What Clients Say Most";
const DB1_DEFAULT_QUOTE =
  "She makes the process feel calm — exactly what you want when you're making the biggest decision of your life.";
const DB1_DEFAULT_ATTRIBUTION = "Repeat client · Google Review";

const DB2_FALLBACK_BG = "/images/Light%20Interior/Light%20interior%20%2B%20Kitchen1.png";
const DB2_DEFAULT_EYEBROW = "Why I Do This Work";
const DB2_DEFAULT_QUOTE =
  "Real estate is the most important purchase most people make. It deserves a Realtor who treats it that way.";
const DB2_DEFAULT_ATTRIBUTION = "Samina";

export default async function Home() {
  const [db1, db2] = await Promise.all([
    getSection<DarkBreakContent>("home", "darkBreak1"),
    getSection<DarkBreakContent>("home", "darkBreak2"),
  ]);

  const [db1Bg, db2Bg] = await Promise.all([
    resolveImageUrl(db1.backgroundImage, {
      fallback: DB1_FALLBACK_BG,
      crop: "wide",
      width: 3840,
    }),
    resolveImageUrl(db2.backgroundImage, {
      fallback: DB2_FALLBACK_BG,
      crop: "wide",
      width: 3840,
    }),
  ]);

  return (
    <>
      <Hero />
      <IntroSection />

      {/* Dark break — establishes rhythm between bio and services */}
      <DarkBreak
        bgImage={db1Bg}
        eyebrow={db1.eyebrow || DB1_DEFAULT_EYEBROW}
        quote={db1.quote || DB1_DEFAULT_QUOTE}
        attribution={db1.attribution || DB1_DEFAULT_ATTRIBUTION}
        height="md"
      />

      <PillarCards />
      <CommunitiesGrid />
      <PathTeaser />
      <ClosingsGallery preview />

      {/* Dark break — separates closings from reviews */}
      <DarkBreak
        bgImage={db2Bg}
        eyebrow={db2.eyebrow || DB2_DEFAULT_EYEBROW}
        quote={db2.quote || DB2_DEFAULT_QUOTE}
        attribution={db2.attribution || DB2_DEFAULT_ATTRIBUTION}
        height="md"
      />

      <ReviewsStrip />
    </>
  );
}
