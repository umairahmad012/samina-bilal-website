import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const pillars = [
  {
    title: "Buy",
    body: "Find a home that actually fits — your life, your timing, your budget. Showings on your schedule, offers that win.",
    href: "/communities",
    cta: "Browse Communities",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&auto=format&fit=crop&q=85",
  },
  {
    title: "Sell",
    body: "Maximize your home's value with a strategy built around your timeline. Pricing, staging, marketing, negotiation.",
    href: "/sellers",
    cta: "Get Your Valuation",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1400&auto=format&fit=crop&q=85",
  },
  {
    title: "Path to Ownership",
    body: "Renting now? Build a real plan to buy in 12 to 24 months. Free consultation. No pressure.",
    href: "/path-to-ownership",
    cta: "Start Your Path",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1400&auto=format&fit=crop&q=85",
  },
];

export default function PillarCards() {
  return (
    <section className="section-y gutter-x">
      <div className="max-w-3xl mx-auto text-center mb-20 md:mb-24">
        <p className="eyebrow mb-8">How We Work Together</p>
        <h2
          className="heading-section text-ink"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
        >
          Three Ways In
        </h2>
      </div>

      <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
        {pillars.map((p) => (
          <Link
            key={p.title}
            href={p.href}
            className="group relative block aspect-[3/4.2] overflow-hidden bg-oxblood-dark"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.4s] ease-editorial group-hover:scale-[1.05]"
              style={{ backgroundImage: `url('${p.image}')` }}
            />
            <div className="absolute inset-0 overlay-card" />

            {/* Frosted glass panel containing the copy */}
            <div className="absolute left-6 right-6 bottom-6 md:left-8 md:right-8 md:bottom-8 glass-dark p-7 md:p-9 text-white">
              <h3
                className="text-xl md:text-2xl uppercase mb-5"
                style={{ fontWeight: 300, letterSpacing: "0.08em" }}
              >
                {p.title}
              </h3>
              <p className="text-sm md:text-[0.95rem] font-light leading-[1.85] text-white/85 mb-7">
                {p.body}
              </p>
              <span className="inline-flex items-center gap-3 text-[0.68rem] tracking-[0.32em] uppercase font-light text-white border-t border-white/25 pt-5">
                {p.cta}
                <ArrowUpRight
                  size={15}
                  strokeWidth={1.5}
                  className="transition-transform duration-500 ease-editorial group-hover:translate-x-1.5 group-hover:-translate-y-1.5"
                />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
