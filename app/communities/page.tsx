import PageHero from "@/components/PageHero";
import CommunitiesGrid from "@/components/CommunitiesGrid";
import { communities } from "@/lib/communities";

export const metadata = {
  title: "Communities | Northern Virginia & Maryland Real Estate",
  description:
    "Six neighborhoods Samina knows by street name. Real 2026 market data for Woodbridge, Dumfries, Ashburn, Lorton, Stafford, and Manassas.",
};

export default function CommunitiesPage() {
  // Sort by YoY for the table — biggest gainers first
  const sorted = [...communities].sort((a, b) => {
    const av = parseFloat(a.yoy.replace(/[^0-9.\-]/g, "")) * (a.yoyDirection === "down" ? -1 : 1);
    const bv = parseFloat(b.yoy.replace(/[^0-9.\-]/g, "")) * (b.yoyDirection === "down" ? -1 : 1);
    return bv - av;
  });

  return (
    <>
      <PageHero
        eyebrow="The Six"
        title="Communities"
        subtitle="Six neighborhoods Samina knows by street name, school zone, and sale price. Real 2026 market data, written by someone who works here every day."
        image="https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1920&auto=format&fit=crop&q=85"
      />

      {/* 2026 comparison table */}
      <section className="section-y gutter-x bg-cream">
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <p className="eyebrow mb-8">2026 At a Glance</p>
          <h2
            className="heading-section text-ink mb-10"
            style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}
          >
            Side-by-Side Market Read
          </h2>
          <div className="mx-auto mb-10 w-12 h-px bg-oxblood/40" />
          <p className="text-base font-light leading-[1.9] text-ink/70 max-w-xl mx-auto">
            How the six markets actually compare today. Sorted by YoY price
            change — biggest gainers first.
          </p>
        </div>

        <div className="max-w-5xl mx-auto glass-light p-2 md:p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm md:text-base font-light">
              <thead>
                <tr className="border-b border-ink/10 text-[0.62rem] tracking-[0.28em] uppercase text-ink-muted">
                  <th className="py-6 px-4 md:px-6">Neighborhood</th>
                  <th className="py-6 px-4 md:px-6">Median</th>
                  <th className="py-6 px-4 md:px-6">YoY</th>
                  <th className="py-6 px-4 md:px-6">DOM</th>
                  <th className="py-6 px-4 md:px-6">Market</th>
                </tr>
              </thead>
              <tbody className="text-ink/85">
                {sorted.map((c) => (
                  <tr
                    key={c.slug}
                    className="border-b border-ink/8 last:border-0 hover:bg-white/30 transition-colors"
                  >
                    <td className="py-6 px-4 md:px-6">
                      <a
                        href={`/communities/${c.slug}`}
                        className="uppercase tracking-[0.08em] text-ink hover:text-oxblood transition-colors"
                      >
                        {c.name}
                      </a>
                    </td>
                    <td className="py-6 px-4 md:px-6 tracking-wide">{c.median}</td>
                    <td
                      className={`py-6 px-4 md:px-6 tracking-wide ${
                        c.yoyDirection === "up"
                          ? "text-emerald-700"
                          : c.yoyDirection === "down"
                          ? "text-oxblood"
                          : "text-ink-muted"
                      }`}
                    >
                      {c.yoy}
                    </td>
                    <td className="py-6 px-4 md:px-6">{c.dom}</td>
                    <td className="py-6 px-4 md:px-6 text-[0.85rem]">
                      {c.marketType === "Balanced" ? "Balanced" : `${c.marketType}'s`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-8 text-xs text-ink-subtle italic text-center">
          Source: Redfin, March 2026. Updated monthly.
        </p>
      </section>

      <CommunitiesGrid />
    </>
  );
}
