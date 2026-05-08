import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import PillarCards from "@/components/PillarCards";
import CommunitiesGrid from "@/components/CommunitiesGrid";
import PathTeaser from "@/components/PathTeaser";
import ClosingsGallery from "@/components/ClosingsGallery";
import ReviewsStrip from "@/components/ReviewsStrip";

export default function Home() {
  return (
    <>
      <Hero />
      <IntroSection />
      <PillarCards />
      <CommunitiesGrid />
      <PathTeaser />
      <ClosingsGallery preview />
      <ReviewsStrip />
    </>
  );
}
