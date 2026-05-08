import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { heroStats } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-oxblood-dark">
      {/* Video / image layer */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&auto=format&fit=crop&q=85"
        >
          <source
            src="https://res.cloudinary.com/dgkg1aozt/video/upload/v1/samples/sea-turtle.mp4"
            type="video/mp4"
          />
        </video>

        {/* Composited cinematic overlay */}
        <div className="absolute inset-0 overlay-hero" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-32 pb-12">
          <p
            className="eyebrow-light mb-10 animate-fade-in"
            style={{ animationDelay: "0.2s", animationFillMode: "both" }}
          >
            Northern Virginia &nbsp;·&nbsp; Maryland &nbsp;·&nbsp; Washington D.C.
          </p>

          <h1
            className="heading-display text-white animate-fade-in-up"
            style={{
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              animationDelay: "0.4s",
              animationFillMode: "both",
              lineHeight: 1.02,
            }}
          >
            Make Yourself
            <br />
            at Home
          </h1>

          <div
            className="mt-12 w-16 h-px bg-white/40 animate-fade-in"
            style={{ animationDelay: "0.7s", animationFillMode: "both" }}
          />

          <p
            className="mt-12 max-w-xl text-base md:text-lg font-light text-white/90 leading-[1.9] animate-fade-in-up"
            style={{ animationDelay: "0.85s", animationFillMode: "both" }}
          >
            Boutique real estate representation across Virginia and Maryland —
            guided by <span className="italic">Samina Bilal</span>, RE/MAX Galaxy.
          </p>

          <div
            className="mt-16 flex flex-wrap items-center justify-center gap-5 animate-fade-in-up"
            style={{ animationDelay: "1.05s", animationFillMode: "both" }}
          >
            <Link href="/communities" className="btn-glass">
              Explore Communities
            </Link>
            <Link href="/path-to-ownership" className="btn-outline-light">
              Path to Ownership
            </Link>
          </div>
        </div>

        {/* Frosted glass stat strip */}
        <div className="relative pb-24 px-6">
          <div className="max-w-6xl mx-auto glass-dark rounded-[2px] animate-fade-in-up"
            style={{ animationDelay: "1.3s", animationFillMode: "both" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3">
              {heroStats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`px-8 md:px-12 py-12 md:py-14 text-center ${
                    i > 0 ? "md:border-l border-white/15 border-t md:border-t-0" : ""
                  }`}
                >
                  <p
                    className="text-4xl md:text-5xl text-white tracking-wide"
                    style={{ fontWeight: 200, letterSpacing: "0.04em" }}
                  >
                    {stat.value}
                  </p>
                  <div className="mx-auto my-5 w-8 h-px bg-white/30" />
                  <p
                    className="text-[0.68rem] tracking-[0.32em] uppercase text-white/75"
                    style={{ fontWeight: 400 }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <a
            href="#intro"
            aria-label="Scroll to next section"
            className="absolute left-1/2 -translate-x-1/2 bottom-6 text-white/70 hover:text-white transition-colors animate-fade-in"
            style={{ animationDelay: "1.6s", animationFillMode: "both" }}
          >
            <ChevronDown size={32} strokeWidth={1} />
          </a>
        </div>
      </div>
    </section>
  );
}
