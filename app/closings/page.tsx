import ClosingsGallery from "@/components/ClosingsGallery";

export const metadata = {
  title: "Recent Closings | Samina Bilal",
  description:
    "Every home Samina personally represented at the closing table. Northern Virginia and Maryland.",
};

export default function ClosingsPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] w-full overflow-hidden bg-oxblood-dark">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&auto=format&fit=crop&q=85')",
          }}
        />
        <div className="absolute inset-0 overlay-hero" />

        <div className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-16">
          <p className="eyebrow-light mb-10">Sold by Samina</p>
          <h1
            className="heading-display text-white"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 1.04,
            }}
          >
            Recent
            <br />
            Closings
          </h1>
          <div className="mt-12 w-16 h-px bg-white/40" />
          <p className="mt-12 max-w-xl text-base md:text-lg font-light text-white/90 leading-[1.95] italic">
            Every home below is one Samina personally represented at the closing table.
          </p>
        </div>
      </section>

      <ClosingsGallery />
    </>
  );
}
