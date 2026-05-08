import Link from "next/link";

export const metadata = {
  title: "Path to Ownership | Renter to Homeowner — Samina Bilal",
  description:
    "A guided 12-to-24 month plan to take you from renting to closing. Free consultation. No pressure.",
};

const steps = [
  {
    n: "01",
    title: "Discover",
    body: "A free, confidential 30-minute consultation. We look at your income, savings, credit, and goals. You leave knowing exactly where you stand.",
  },
  {
    n: "02",
    title: "Prepare",
    body: "A custom 6-to-18-month plan. Credit improvements, down-payment savings, lender introductions, and the right loan program for you (FHA, VA, conventional, first-time buyer grants).",
  },
  {
    n: "03",
    title: "Shop",
    body: "When you're mortgage-ready, we hit the market. Showings on your schedule, neighborhoods that fit your life, and offers that actually win.",
  },
  {
    n: "04",
    title: "Close",
    body: "Inspections, appraisal, negotiation, paperwork. You get the keys. You make yourself at home.",
  },
];

const faqs = [
  {
    q: "Will this affect my credit?",
    a: "No — exploring the program does nothing to your credit. We don't pull anything until you're formally applying for a mortgage.",
  },
  {
    q: "Do I need a minimum income?",
    a: "There's no fixed minimum. What matters more is your debt-to-income ratio, employment stability, and savings runway. We'll review all of it together.",
  },
  {
    q: "I have student loans or past credit issues.",
    a: "Tell Samina. She works with lenders who specialize in your exact situation — including FHA, VA, USDA, and first-time buyer grant programs that exist for a reason.",
  },
  {
    q: "Is this a 'rent-to-own' lease?",
    a: "No — this is a real path to a real mortgage. No rent premium, no lease-option contract, no risk of losing your down payment money. You stay in your current rental until you're ready to buy.",
  },
  {
    q: "What does it cost me?",
    a: "Nothing. Buyer representation in real estate is paid by the seller at closing — that's how the industry works in Virginia and Maryland. The consultation, the planning, the lender intros — all free.",
  },
  {
    q: "How long does it actually take?",
    a: "It depends on where you're starting. Some people are mortgage-ready in 90 days. Most take 12-18 months. A few need a full 24. We'll know after our first conversation.",
  },
];

export default function PathPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[85vh] w-full overflow-hidden bg-oxblood-dark">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1920&auto=format&fit=crop&q=85')",
          }}
        />
        <div className="absolute inset-0 overlay-hero" />

        <div className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-16">
          <p className="eyebrow-light mb-10">A Program for Renters</p>
          <h1
            className="heading-display text-white"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 1.04,
            }}
          >
            Path to
            <br />
            Ownership
          </h1>
          <div className="mt-12 w-16 h-px bg-white/40" />
          <p className="mt-12 max-w-2xl text-base md:text-lg font-light text-white/90 leading-[1.95]">
            A guided 12-to-24 month plan to take you from renting to closing.
            <br />
            <span className="italic">No pressure. No guesswork. No cost to start.</span>
          </p>
        </div>
      </section>

      {/* The truth */}
      <section className="section-y-lg gutter-x">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-10">The Truth</p>
          <h2
            className="heading-section text-ink mb-12"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
          >
            You're closer than you think.
          </h2>
          <div className="mx-auto mb-14 w-12 h-px bg-oxblood/40" />
          <p className="text-lg md:text-xl font-light leading-[1.9] text-ink/85">
            Most renters in Northern Virginia and Maryland believe homeownership
            is years — or a lifetime — away. The truth is, with the right plan,
            most of them are 12 to 24 months from closing on their first home.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-cream-soft section-y-lg gutter-x">
        <div className="max-w-3xl mx-auto text-center mb-20 md:mb-24">
          <p className="eyebrow mb-8">The Process</p>
          <h2
            className="heading-section text-ink"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
          >
            Four Steps to the Front Door
          </h2>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {steps.map((s) => (
            <div key={s.n} className="glass-light p-10 md:p-12 flex flex-col">
              <p
                className="text-5xl md:text-6xl text-oxblood/40 mb-8"
                style={{ fontWeight: 200 }}
              >
                {s.n}
              </p>
              <div className="my-2 mb-6 w-10 h-px bg-oxblood/40" />
              <h3
                className="text-lg uppercase mb-5 text-ink"
                style={{ fontWeight: 300, letterSpacing: "0.08em" }}
              >
                {s.title}
              </h3>
              <p className="text-sm font-light leading-[1.85] text-ink/75">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="section-y gutter-x">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 text-center">
          {[
            { v: "$0", l: "What you pay Samina to start" },
            { v: "12–24", l: "Months from first call to closing" },
            { v: "2", l: "States — Virginia & Maryland" },
          ].map((s) => (
            <div key={s.l}>
              <p
                className="text-5xl md:text-6xl text-oxblood mb-6"
                style={{ fontWeight: 200 }}
              >
                {s.v}
              </p>
              <div className="mx-auto mb-5 w-8 h-px bg-oxblood/40" />
              <p className="text-[0.7rem] tracking-[0.32em] uppercase text-ink-muted leading-[1.7]">
                {s.l}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-cream-soft section-y-lg gutter-x">
        <div className="max-w-3xl mx-auto text-center mb-20 md:mb-24">
          <p className="eyebrow mb-8">Who It's For</p>
          <h2
            className="heading-section text-ink"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
          >
            Built for Real People
          </h2>
        </div>
        <div className="max-w-3xl mx-auto space-y-6 text-base md:text-lg font-light text-ink/85 leading-[1.9]">
          {[
            "Renters tired of the rent-increase cycle",
            "First-generation buyers in your family",
            "VA loan-eligible service members and veterans",
            "Couples planning ahead before a wedding, baby, or move",
            "Anyone who's been told 'no' by a bank and isn't sure why",
          ].map((line) => (
            <div key={line} className="flex items-start gap-5">
              <span className="text-oxblood text-2xl leading-none mt-1.5" style={{ fontWeight: 200 }}>
                ·
              </span>
              <p>{line}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section-y-lg gutter-x">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20 md:mb-24">
            <p className="eyebrow mb-8">Common Questions</p>
            <h2
              className="heading-section text-ink"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
            >
              Answered
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group glass-light px-8 md:px-10 py-7 transition-all"
              >
                <summary className="cursor-pointer flex items-center justify-between text-base md:text-lg font-light text-ink list-none">
                  <span>{f.q}</span>
                  <span className="text-oxblood text-2xl ml-6 group-open:rotate-45 transition-transform duration-400 ease-editorial flex-shrink-0">
                    +
                  </span>
                </summary>
                <p className="mt-6 text-base font-light text-ink/75 leading-[1.9]">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
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
            Take the First Step.
            <br />
            It's Free.
          </h2>
          <div className="mx-auto mb-10 w-12 h-px bg-white/40" />
          <p className="text-base md:text-lg font-light leading-[1.9] text-white/85 max-w-xl mx-auto mb-14">
            Schedule a 30-minute, no-pressure conversation with Samina.
          </p>
          <Link href="/contact" className="btn-glass">
            Book My Consult
          </Link>
        </div>
      </section>
    </>
  );
}
