import { Instagram, Facebook, Music2 } from "lucide-react";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-oxblood text-white pt-28 md:pt-36 pb-12 mt-32">
      <div className="max-w-[1500px] mx-auto gutter-x grid md:grid-cols-2 gap-20 md:gap-24">
        {/* Left */}
        <div>
          <div className="w-24 h-24 rounded-full border border-white/40 flex items-center justify-center mb-5">
            <span className="text-4xl font-thin" style={{ fontWeight: 200 }}>
              S.
            </span>
          </div>
          <p
            className="text-[0.7rem] tracking-[0.42em] uppercase text-white/75 mb-16"
            style={{ fontWeight: 300 }}
          >
            Realtor
          </p>

          <p
            className="text-[0.7rem] tracking-[0.32em] uppercase text-white/55 mb-4"
            style={{ fontWeight: 400 }}
          >
            Office
          </p>
          <p className="text-base font-light leading-[1.9]">
            {site.office.street}
            <br />
            {site.office.cityStateZip}
          </p>

          <p
            className="text-[0.7rem] tracking-[0.32em] uppercase text-white/55 mb-4 mt-12"
            style={{ fontWeight: 400 }}
          >
            Direct
          </p>
          <p className="text-base font-light leading-[1.9]">
            <a href={site.phoneHref} className="hover:opacity-70 transition-opacity">
              {site.phone}
            </a>
            <br />
            <a href={site.emailHref} className="hover:opacity-70 transition-opacity">
              {site.email}
            </a>
          </p>
        </div>

        {/* Right — Newsletter */}
        <div>
          <p className="eyebrow-light mb-8">Stay in Touch</p>
          <h3
            className="text-2xl md:text-3xl uppercase mb-8"
            style={{ fontWeight: 200, letterSpacing: "0.06em" }}
          >
            Newsletter
          </h3>
          <div className="mb-10 w-12 h-px bg-white/40" />
          <p className="text-base font-light leading-[1.9] text-white/85 mb-12 max-w-md">
            Quarterly market reports for Northern Virginia &amp; Maryland. New
            listings, sold prices, and what it means for your zip code. No spam,
            ever.
          </p>

          <form className="max-w-md">
            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-transparent border-b border-white/35 py-4 text-base font-light placeholder:text-white/45 focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="mt-10 px-10 py-4 border border-white/70 text-[0.7rem] tracking-[0.32em] uppercase font-light hover:bg-white hover:text-oxblood transition-all duration-500 ease-editorial"
            >
              Subscribe
            </button>
          </form>

          <div className="mt-16 flex items-center gap-7">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:opacity-70 transition-opacity">
              <Instagram size={22} strokeWidth={1.5} />
            </a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:opacity-70 transition-opacity">
              <Facebook size={22} strokeWidth={1.5} />
            </a>
            <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:opacity-70 transition-opacity">
              <Music2 size={22} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1500px] mx-auto gutter-x mt-24 pt-10 border-t border-white/10">
        <p
          className="text-[0.65rem] tracking-[0.22em] uppercase text-white/55 leading-[1.9] mb-4"
          style={{ fontWeight: 300 }}
        >
          © {new Date().getFullYear()} Samina Bilal · {site.brokerage} · Licensed in Virginia (#{site.licenses.va}) &amp; Maryland (#{site.licenses.md}) · Equal Housing Opportunity
        </p>
        <p
          className="text-[0.6rem] tracking-[0.18em] uppercase text-white/35 leading-[1.9]"
          style={{ fontWeight: 300 }}
        >
          Each office independently owned and operated. All information deemed reliable but not guaranteed. Market data via Redfin and Bright MLS, updated monthly.
        </p>
      </div>
    </footer>
  );
}
