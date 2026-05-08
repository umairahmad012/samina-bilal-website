import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { communities } from "@/lib/communities";

export default function CommunitiesGrid({ limit }: { limit?: number }) {
  const items = limit ? communities.slice(0, limit) : communities;
  return (
    <section className="section-y-lg gutter-x bg-cream-soft">
      <div className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
        <p className="eyebrow mb-8">The Six</p>
        <h2
          className="heading-section text-ink mb-10"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
        >
          Communities We Serve
        </h2>
        <div className="mx-auto mb-10 w-12 h-px bg-oxblood/40" />
        <p className="text-base md:text-lg font-light leading-[1.9] text-ink/70 max-w-2xl mx-auto">
          Hyper-local 2026 market data, neighborhood character, and what your
          money actually buys — written by someone who works here every day.
        </p>
      </div>

      <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {items.map((c) => (
          <Link
            key={c.slug}
            href={`/communities/${c.slug}`}
            className="group relative aspect-[4/3.2] block overflow-hidden bg-oxblood-dark"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.6s] ease-editorial group-hover:scale-[1.05]"
              style={{ backgroundImage: `url('${c.image}')` }}
            />
            <div className="absolute inset-0 overlay-card" />

            {/* Glass strip at bottom containing all info */}
            <div className="absolute left-6 right-6 bottom-6 md:left-8 md:right-8 md:bottom-8 glass-dark p-7 md:p-9 text-white">
              <div className="flex items-baseline justify-between mb-4">
                <p className="eyebrow-light">{c.state}</p>
                <span className="inline-flex items-center gap-2 text-[0.62rem] tracking-[0.32em] uppercase text-white/70 group-hover:text-white transition-colors">
                  Explore
                  <ArrowUpRight
                    size={13}
                    strokeWidth={1.5}
                    className="transition-transform duration-500 ease-editorial group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </span>
              </div>

              <h3
                className="text-3xl md:text-4xl uppercase tracking-wide mb-6"
                style={{ fontWeight: 200, letterSpacing: "0.05em" }}
              >
                {c.name}
              </h3>

              <div className="grid grid-cols-3 gap-4 pt-5 border-t border-white/20">
                <div>
                  <p className="text-[0.6rem] tracking-[0.28em] uppercase text-white/55 mb-1.5">
                    Median
                  </p>
                  <p className="text-base font-light text-white">{c.median}</p>
                </div>
                <div>
                  <p className="text-[0.6rem] tracking-[0.28em] uppercase text-white/55 mb-1.5">
                    YoY
                  </p>
                  <p
                    className={`text-base font-light ${
                      c.yoyDirection === "up"
                        ? "text-emerald-300"
                        : c.yoyDirection === "down"
                        ? "text-orange-300"
                        : "text-white/85"
                    }`}
                  >
                    {c.yoy}
                  </p>
                </div>
                <div>
                  <p className="text-[0.6rem] tracking-[0.28em] uppercase text-white/55 mb-1.5">
                    DOM
                  </p>
                  <p className="text-base font-light text-white">{c.dom}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
