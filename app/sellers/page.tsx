import { TrendingUp, Eye, Handshake } from "lucide-react";

export const metadata = {
  title: "What's Your Home Worth? | Samina Bilal",
  description:
    "Get a no-obligation home valuation from a Realtor who actually knows your block.",
};

const reasons = [
  {
    icon: <TrendingUp size={28} strokeWidth={1.25} />,
    h: "Local pricing intelligence",
    p: "Real comps, walked in person — not algorithm guesses. Samina knows what every house on your block sold for, why it sold for that, and what yours is actually worth today.",
  },
  {
    icon: <Eye size={28} strokeWidth={1.25} />,
    h: "Marketing that gets shown",
    p: "Professional photography, social, MLS, and the global RE/MAX network. Your home is staged, shot, written, and placed in front of qualified buyers — not just listed.",
  },
  {
    icon: <Handshake size={28} strokeWidth={1.25} />,
    h: "Negotiation that protects you",
    p: "Offers vetted carefully, contingencies handled cleanly, and terms structured to actually close — not just to hit a high number on paper that falls apart at appraisal.",
  },
];

export default function SellersPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[80vh] w-full overflow-hidden bg-oxblood-dark">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&auto=format&fit=crop&q=85')",
          }}
        />
        <div className="absolute inset-0 overlay-hero" />

        <div className="relative z-10 min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-16">
          <p className="eyebrow-light mb-10">For Sellers</p>
          <h1
            className="heading-display text-white"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 1.04,
            }}
          >
            What's Your
            <br />
            Home Worth?
          </h1>
          <div className="mt-12 w-16 h-px bg-white/40" />
          <p className="mt-12 max-w-xl text-base md:text-lg font-light text-white/90 leading-[1.95] italic">
            Get a no-obligation valuation from someone who actually knows your block.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="section-y-lg gutter-x">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <p className="eyebrow mb-8">Request a Valuation</p>
            <h2
              className="heading-section text-ink"
              style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)" }}
            >
              Tell Samina About Your Home
            </h2>
            <div className="mx-auto mt-10 w-12 h-px bg-oxblood/40" />
          </div>

          <form className="glass-light p-10 md:p-14 space-y-12">
            {[
              { l: "Property Address", t: "text", p: "1234 Main St, Woodbridge, VA 22192" },
              { l: "Your Name", t: "text", p: "" },
              { l: "Email", t: "email", p: "" },
              { l: "Phone", t: "tel", p: "" },
            ].map((f) => (
              <div key={f.l}>
                <label className="block eyebrow mb-4">{f.l}</label>
                <input
                  type={f.t}
                  placeholder={f.p}
                  className="w-full bg-transparent border-b border-ink/25 py-3 text-lg font-light placeholder:text-ink-subtle focus:outline-none focus:border-oxblood transition-colors"
                />
              </div>
            ))}
            <div>
              <label className="block eyebrow mb-4">Anything I should know?</label>
              <textarea
                rows={4}
                placeholder="Recent renovations, timing, special features, etc."
                className="w-full bg-transparent border-b border-ink/25 py-3 text-base font-light placeholder:text-ink-subtle focus:outline-none focus:border-oxblood transition-colors resize-none"
              />
            </div>
            <div className="pt-4">
              <button type="submit" className="btn-solid">
                Get My Valuation
              </button>
              <p className="mt-6 text-xs text-ink-subtle italic">
                Typical response time: within 24 hours.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* Why list with Samina */}
      <section className="bg-cream-soft section-y-lg gutter-x">
        <div className="max-w-3xl mx-auto text-center mb-20 md:mb-24">
          <p className="eyebrow mb-8">Why List with Samina</p>
          <h2
            className="heading-section text-ink"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
          >
            What You Actually Get
          </h2>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 md:gap-10">
          {reasons.map((r, i) => (
            <div key={r.h} className="glass-light p-10 md:p-12 flex flex-col">
              <div className="text-oxblood mb-6">{r.icon}</div>
              <p
                className="text-3xl text-oxblood/40 mb-2 tracking-wide"
                style={{ fontWeight: 200 }}
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <div className="my-6 w-10 h-px bg-oxblood/40" />
              <h3
                className="text-lg uppercase mb-5 text-ink"
                style={{ fontWeight: 300, letterSpacing: "0.08em" }}
              >
                {r.h}
              </h3>
              <p className="text-sm font-light leading-[1.85] text-ink/75">
                {r.p}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
