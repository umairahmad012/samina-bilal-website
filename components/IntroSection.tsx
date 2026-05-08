export default function IntroSection() {
  return (
    <section
      id="intro"
      className="relative section-y-lg gutter-x overflow-hidden"
    >
      {/* Soft full-bleed background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.12]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&auto=format&fit=crop&q=85')",
        }}
      />
      <div className="absolute inset-0 bg-cream/70" />

      <div className="relative max-w-3xl mx-auto text-center">
        <p className="eyebrow mb-10">Samina Bilal · Realtor</p>
        <h2
          className="heading-section text-ink mb-12"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
        >
          A Boutique Approach to
          <br />
          Northern Virginia Real Estate
        </h2>

        <div className="mx-auto mb-12 w-12 h-px bg-oxblood/40" />

        <p className="text-lg md:text-xl font-light leading-[1.9] text-ink/80 max-w-2xl mx-auto">
          Samina Bilal is a licensed Realtor with RE/MAX Galaxy, serving buyers
          and sellers across Virginia and Maryland. From first-time buyers in
          Woodbridge to investors in Fredericksburg and families relocating to
          Stafford, she brings a calm, detail-driven approach to one of the
          biggest decisions you'll ever make.
        </p>
      </div>
    </section>
  );
}
