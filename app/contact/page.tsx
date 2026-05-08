import { Phone, Mail, MapPin, Clock, Instagram, Facebook, Music2 } from "lucide-react";
import { site } from "@/lib/site";

export const metadata = {
  title: "Contact | Samina Bilal",
  description:
    "Get in touch with Samina Bilal — Realtor at RE/MAX Galaxy. Licensed in Virginia and Maryland.",
};

export default function ContactPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[60vh] w-full overflow-hidden bg-oxblood-dark">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&auto=format&fit=crop&q=85')",
          }}
        />
        <div className="absolute inset-0 overlay-hero" />

        <div className="relative z-10 min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-32 pb-16">
          <p className="eyebrow-light mb-10">Get in Touch</p>
          <h1
            className="heading-display text-white"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 1.04,
            }}
          >
            Let's Talk
          </h1>
          <div className="mt-12 w-16 h-px bg-white/40" />
          <p className="mt-12 max-w-xl text-base md:text-lg font-light text-white/90 leading-[1.95] italic">
            A 30-minute conversation. No pressure. No cost.
          </p>
        </div>
      </section>

      <section className="section-y-lg gutter-x">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24">
          {/* Form */}
          <div>
            <p className="eyebrow mb-8">Send a Message</p>
            <h2
              className="heading-section text-ink mb-12"
              style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.75rem)" }}
            >
              Tell Samina What You Need
            </h2>
            <div className="mb-12 w-12 h-px bg-oxblood/40" />

            <form className="space-y-10">
              {[
                { l: "Name", t: "text" },
                { l: "Email", t: "email" },
                { l: "Phone", t: "tel" },
              ].map((f) => (
                <div key={f.l}>
                  <label className="block eyebrow mb-4">{f.l}</label>
                  <input
                    type={f.t}
                    className="w-full bg-transparent border-b border-ink/25 py-3 text-lg font-light focus:outline-none focus:border-oxblood transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block eyebrow mb-4">Message</label>
                <textarea
                  rows={5}
                  className="w-full bg-transparent border-b border-ink/25 py-3 text-base font-light focus:outline-none focus:border-oxblood transition-colors resize-none"
                />
              </div>
              <label className="flex items-start gap-4 text-xs font-light text-ink-muted leading-[1.7] pt-2">
                <input type="checkbox" className="mt-1 flex-shrink-0" />
                <span>
                  I agree to be contacted by Samina Bilal via call, email, and
                  text. Reply STOP to opt out at any time. Message and data rates
                  may apply.
                </span>
              </label>
              <div className="pt-4">
                <button type="submit" className="btn-solid">
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Direct details */}
          <div>
            <p className="eyebrow mb-8">Direct Contact</p>
            <h2
              className="heading-section text-ink mb-12"
              style={{ fontSize: "clamp(1.4rem, 2.4vw, 1.75rem)" }}
            >
              Samina Bilal · Realtor
            </h2>
            <div className="mb-12 w-12 h-px bg-oxblood/40" />

            <div className="glass-light p-10 md:p-12 space-y-10">
              <Detail icon={<Phone size={20} strokeWidth={1.5} />} label="Phone">
                <a href={site.phoneHref} className="hover:text-oxblood transition-colors">
                  {site.phone}
                </a>
              </Detail>
              <Detail icon={<Mail size={20} strokeWidth={1.5} />} label="Email">
                <a href={site.emailHref} className="hover:text-oxblood transition-colors">
                  {site.email}
                </a>
              </Detail>
              <Detail icon={<MapPin size={20} strokeWidth={1.5} />} label="Office">
                {site.office.street}
                <br />
                {site.office.cityStateZip}
              </Detail>
              <Detail icon={<Clock size={20} strokeWidth={1.5} />} label="Hours">
                By appointment, 7 days a week
              </Detail>
            </div>

            {/* Social */}
            <div className="mt-12">
              <p className="eyebrow mb-6">Follow</p>
              <div className="flex items-center gap-7 text-oxblood">
                <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-60 transition-opacity">
                  <Instagram size={22} strokeWidth={1.5} />
                </a>
                <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-60 transition-opacity">
                  <Facebook size={22} strokeWidth={1.5} />
                </a>
                <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:opacity-60 transition-opacity">
                  <Music2 size={22} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-6">
      <div className="text-oxblood flex-shrink-0 pt-1">{icon}</div>
      <div>
        <p className="eyebrow mb-2">{label}</p>
        <p className="text-base md:text-lg font-light text-ink/85 leading-[1.9]">
          {children}
        </p>
      </div>
    </div>
  );
}
