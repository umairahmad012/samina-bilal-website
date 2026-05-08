import Link from "next/link";
import { site } from "@/lib/site";

export const metadata = {
  title: "About Samina Bilal | RE/MAX Galaxy Realtor — VA & MD",
  description:
    "Samina Bilal is a licensed Realtor with RE/MAX Galaxy, dual-licensed in Virginia and Maryland.",
};

export default function AboutPage() {
  return (
    <>
      {/* HERO with portrait + name treatment */}
      <section className="relative min-h-[90vh] w-full overflow-hidden bg-oxblood-dark">
        <div
          className="absolute inset-0 bg-cover bg-center grayscale"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&auto=format&fit=crop&q=85')",
          }}
        />
        <div className="absolute inset-0 overlay-hero" />

        <div className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-16">
          <p className="eyebrow-light mb-10">Realtor · Virginia &amp; Maryland</p>
          <h1
            className="heading-display text-white"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 1.04,
            }}
          >
            Samina Yunus
            <br />
            Bilal
          </h1>
          <div className="mt-12 w-16 h-px bg-white/40" />
          <p className="mt-12 max-w-xl text-base md:text-lg font-light text-white/90 leading-[1.95] italic">
            A boutique approach to one of the biggest decisions you'll ever make.
          </p>
        </div>
      </section>

      {/* Bio section */}
      <section className="section-y-lg gutter-x">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-16 md:gap-24 items-start">
          <div className="md:col-span-2">
            <div
              className="aspect-[3/4] bg-cover bg-center grayscale shadow-[0_30px_60px_-20px_rgba(59,20,24,0.18)]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&auto=format&fit=crop&q=85')",
              }}
            />
            <p className="mt-6 text-[0.65rem] tracking-[0.32em] uppercase text-ink-subtle italic">
              Portrait — to be replaced with Samina's editorial headshot
            </p>
          </div>

          <div className="md:col-span-3 space-y-8 text-base md:text-lg font-light leading-[1.95] text-ink/85">
            <p className="eyebrow text-oxblood mb-2">A note from Samina</p>
            <p>
              Samina Bilal is a licensed Realtor with {site.brokerage}, dual-licensed
              in Virginia and Maryland. Based in Woodbridge, she serves clients
              across Northern Virginia — Stafford, Fairfax, Prince William, Lake
              Ridge, Chantilly, Haymarket — and throughout the Maryland suburbs of
              D.C.
            </p>
            <p>
              Her practice is built on three things her clients consistently say
              about her: she listens, she follows through, and she makes the
              process feel calm. Whether it's a first-time buyer trying to
              understand closing costs, a seller weighing the right time to list,
              or a family moving across state lines, Samina handles the work so
              her clients can focus on what's next.
            </p>
            <p>
              She's earned a 5-star rating across Zillow, Google, and Realtor.com
              — but the language she's most proud of in those reviews is the same
              word, repeated: <em>trust</em>.
            </p>
            <p>
              Beyond traditional buy-and-sell representation, Samina has built a
              dedicated{" "}
              <Link
                href="/path-to-ownership"
                className="text-oxblood underline underline-offset-4 hover:no-underline transition-all"
              >
                Path to Ownership
              </Link>{" "}
              track for renters who want to become owners. It's the work she
              finds most meaningful — turning what feels impossible into a 12 to
              24-month plan with a real closing date at the end.
            </p>
          </div>
        </div>
      </section>

      {/* Three pillars — what I do */}
      <section className="bg-cream-soft section-y-lg gutter-x">
        <div className="max-w-3xl mx-auto text-center mb-20 md:mb-24">
          <p className="eyebrow mb-8">Practice Areas</p>
          <h2
            className="heading-section text-ink"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
          >
            What I Do
          </h2>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 md:gap-10">
          {[
            {
              h: "Buyer Representation",
              p: "From pre-approval to keys. Showings, offers, inspections, negotiation — all handled so you can focus on what's next.",
            },
            {
              h: "Listing & Selling",
              p: "Pricing strategy, staging guidance, professional marketing, and offers structured to close — not just to be the highest number on paper.",
            },
            {
              h: "Path to Ownership",
              p: "A guided 12-to-24 month program for renters preparing to buy. Free consultation, lender introductions, and a real plan with a closing date.",
            },
          ].map((b, i) => (
            <div key={b.h} className="glass-light p-10 md:p-12 flex flex-col">
              <p
                className="text-3xl text-oxblood mb-2 tracking-wide"
                style={{ fontWeight: 200 }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <div className="my-6 w-10 h-px bg-oxblood/40" />
              <h3
                className="text-lg uppercase mb-5 text-ink"
                style={{ fontWeight: 300, letterSpacing: "0.08em" }}
              >
                {b.h}
              </h3>
              <p className="text-sm md:text-base font-light leading-[1.85] text-ink/75">
                {b.p}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Credentials */}
      <section className="section-y-lg gutter-x">
        <div className="max-w-3xl mx-auto text-center">
          <p className="eyebrow mb-8">Credentials</p>
          <h2
            className="heading-section text-ink mb-12"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
          >
            Licensed &amp; Affiliated
          </h2>
          <div className="mx-auto mb-14 w-12 h-px bg-oxblood/40" />

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-8 max-w-xl mx-auto text-left">
            <Cred label="Brokerage" value={`${site.brokerage} · Associate`} />
            <Cred label="Affiliate" value="Kay C & Associates" />
            <Cred label="Virginia License" value={`#${site.licenses.va}`} />
            <Cred label="Maryland License" value={`#${site.licenses.md}`} />
            <Cred label="Service Area" value="Northern Virginia · D.C. · Maryland" />
            <Cred label="Office" value={`${site.office.street}, ${site.office.cityStateZip}`} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-oxblood text-white section-y gutter-x overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.18]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&auto=format&fit=crop&q=85')",
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h2
            className="heading-section mb-10"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
          >
            Let's Find Yours
          </h2>
          <div className="mx-auto mb-10 w-12 h-px bg-white/40" />
          <p className="text-base md:text-lg font-light leading-[1.9] text-white/85 max-w-xl mx-auto mb-14">
            Whether you're buying your first or your fifth, listing or just exploring,
            start with a 30-minute conversation. No pressure. No cost.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/contact" className="btn-glass">
              Schedule a Call
            </Link>
            <Link href="/communities" className="btn-outline-light">
              Explore Communities
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Cred({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.65rem] tracking-[0.32em] uppercase text-ink-muted mb-2">
        {label}
      </p>
      <p className="text-base font-light text-ink/85 leading-relaxed">{value}</p>
    </div>
  );
}
