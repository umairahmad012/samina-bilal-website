import Link from "next/link";

export default function PathTeaser() {
  return (
    <section className="relative section-y-lg gutter-x overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&auto=format&fit=crop&q=85')",
        }}
      />
      <div className="absolute inset-0 overlay-left-fade" />

      <div className="relative max-w-[1500px] mx-auto">
        {/* Frosted glass card holding the message */}
        <div className="max-w-2xl glass-dark p-10 md:p-14 lg:p-16">
          <p className="eyebrow-light mb-8">A Program for Renters</p>
          <h2
            className="heading-section text-white mb-10"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
          >
            From Renting to Owning,
            <br />
            in 12 to 24 Months.
          </h2>

          <div className="mb-10 w-12 h-px bg-white/40" />

          <p className="text-base md:text-lg font-light leading-[1.95] text-white/85 mb-12">
            Most renters in Northern Virginia and Maryland believe homeownership
            is years — or a lifetime — away. The truth is, with the right plan,
            most of them are 12 to 24 months from closing on their first home.
            Samina's <span className="italic">Path to Ownership</span> program
            is built to get you there. No pressure. No guesswork. No cost to
            start.
          </p>
          <Link href="/path-to-ownership" className="btn-glass">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
