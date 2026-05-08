import { reviews, ratingsLine } from "@/lib/reviews";

export default function ReviewsStrip() {
  return (
    <section className="relative section-y-lg gutter-x overflow-hidden bg-cream-soft">
      {/* Subtle background photo */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&auto=format&fit=crop&q=85')",
        }}
      />

      <div className="relative max-w-3xl mx-auto text-center mb-20 md:mb-28">
        <p className="eyebrow mb-8">What Clients Say</p>
        <h2
          className="heading-section text-ink"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
        >
          In Their Words
        </h2>
      </div>

      <div className="relative max-w-6xl mx-auto grid md:grid-cols-3 gap-8 md:gap-10">
        {reviews.slice(0, 3).map((r, i) => (
          <figure
            key={i}
            className="glass-light p-10 md:p-12 flex flex-col"
          >
            <div className="flex justify-center gap-1 text-oxblood mb-8 text-sm tracking-[0.4em]">
              ★★★★★
            </div>
            <blockquote className="flex-1 text-base md:text-lg font-light leading-[1.95] text-ink/85 italic mb-10 text-center">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <div className="mx-auto w-10 h-px bg-oxblood/30 mb-6" />
            <figcaption className="text-[0.65rem] tracking-[0.32em] uppercase text-ink-muted text-center">
              {r.short ? `${r.short} · ` : ""}
              <span className="text-oxblood">{r.source}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Aggregate ratings */}
      <div className="relative mt-24 md:mt-28 max-w-3xl mx-auto flex flex-wrap items-end justify-center gap-x-16 gap-y-10 text-center">
        {ratingsLine.map((r) => (
          <div key={r.source}>
            <p
              className="text-3xl text-oxblood mb-3"
              style={{ fontWeight: 200 }}
            >
              {r.value}
              <span className="ml-0.5 text-2xl">★</span>
            </p>
            <p className="text-[0.65rem] tracking-[0.32em] uppercase text-ink-muted mb-1.5">
              {r.source}
            </p>
            <p className="text-xs font-light text-ink-subtle">{r.count}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
