import { reviews, ratingsLine } from "@/lib/reviews";
import Link from "next/link";

export const metadata = {
  title: "Reviews | Samina Bilal",
  description:
    "Five-star ratings across Zillow, Google, and Realtor.com. In their own words.",
};

export default function ReviewsPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[70vh] w-full overflow-hidden bg-oxblood-dark">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&auto=format&fit=crop&q=85')",
          }}
        />
        <div className="absolute inset-0 overlay-hero" />

        <div className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-16">
          <p className="eyebrow-light mb-10">What Clients Say</p>
          <h1
            className="heading-display text-white"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 1.04,
            }}
          >
            In Their
            <br />
            Words
          </h1>
          <div className="mt-12 w-16 h-px bg-white/40" />

          {/* Aggregate ratings inside the hero */}
          <div className="mt-16 flex flex-wrap items-end justify-center gap-x-14 gap-y-10 text-center">
            {ratingsLine.map((r) => (
              <div key={r.source}>
                <p className="text-4xl text-white mb-2" style={{ fontWeight: 200 }}>
                  {r.value}
                  <span className="ml-1 text-3xl">★</span>
                </p>
                <div className="mx-auto my-3 w-7 h-px bg-white/40" />
                <p className="text-[0.65rem] tracking-[0.32em] uppercase text-white/75 mb-1">
                  {r.source}
                </p>
                <p className="text-xs font-light text-white/55">{r.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big editorial quotes */}
      <section className="section-y-lg gutter-x">
        <div className="max-w-3xl mx-auto space-y-24 md:space-y-28">
          {reviews.map((r, i) => (
            <figure key={i} className="text-center">
              <div className="text-oxblood mb-10 text-base tracking-[0.4em]">
                ★ ★ ★ ★ ★
              </div>
              <blockquote
                className="text-2xl md:text-3xl lg:text-4xl leading-[1.45] text-ink italic"
                style={{ fontWeight: 200, letterSpacing: "0.005em" }}
              >
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <div className="mx-auto my-10 w-10 h-px bg-oxblood/40" />
              <figcaption className="text-[0.65rem] tracking-[0.32em] uppercase text-ink-muted">
                {r.short ? `${r.short} · ` : ""}
                <span className="text-oxblood">{r.source}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-oxblood text-white section-y gutter-x overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1920&auto=format&fit=crop&q=85')",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2
            className="heading-section mb-10"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
          >
            Be Next.
          </h2>
          <div className="mx-auto mb-10 w-12 h-px bg-white/40" />
          <p className="text-base md:text-lg font-light leading-[1.9] text-white/85 max-w-xl mx-auto mb-14">
            Whether you're buying, selling, or planning ahead — start with a
            30-minute conversation. No pressure. No cost.
          </p>
          <Link href="/contact" className="btn-glass">
            Schedule a Call
          </Link>
        </div>
      </section>
    </>
  );
}
