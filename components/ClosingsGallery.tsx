"use client";

import { useState } from "react";
import Link from "next/link";
import { closings } from "@/lib/closings";

const PAGE = 6;

export default function ClosingsGallery({
  preview = false,
}: {
  preview?: boolean;
}) {
  const [shown, setShown] = useState(PAGE);
  const list = preview ? closings.slice(0, PAGE) : closings.slice(0, shown);
  const canLoadMore = !preview && shown < closings.length;

  return (
    <section className="section-y-lg gutter-x bg-cream">
      <div className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
        <p className="eyebrow mb-8">Sold by Samina</p>
        <h2
          className="heading-section text-ink mb-10"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}
        >
          Recently Closed
        </h2>
        <div className="mx-auto mb-10 w-12 h-px bg-oxblood/40" />
        <p className="text-base md:text-lg font-light leading-[1.9] text-ink/70 max-w-2xl mx-auto">
          {preview
            ? "A glimpse at homes Samina has helped families buy and sell across Northern Virginia."
            : "Every home below is one Samina personally represented at the closing table."}
        </p>
      </div>

      <div className="max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {list.map((c) => (
          <div
            key={c.id}
            className="group relative aspect-[4/3] overflow-hidden bg-oxblood-dark"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.6s] ease-editorial group-hover:scale-[1.05]"
              style={{ backgroundImage: `url('${c.image}')` }}
            />
            <div className="absolute inset-0 overlay-card" />

            {/* Glass SOLD pill */}
            <span className="absolute top-5 right-5 glass-pill px-4 py-1.5 text-white text-[0.6rem] tracking-[0.32em] uppercase">
              Sold
            </span>

            {/* Glass label strip at bottom */}
            <div className="absolute left-5 right-5 bottom-5 md:left-6 md:right-6 md:bottom-6 glass-dark px-6 py-5 text-white">
              <p className="text-[0.6rem] tracking-[0.32em] uppercase opacity-70 mb-2">
                {c.neighborhood}
              </p>
              <p className="text-base md:text-lg font-light tracking-wide">
                {c.city}, {c.state}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 md:mt-24 flex justify-center">
        {preview ? (
          <Link href="/closings" className="btn-outline-dark">
            See All Closings
          </Link>
        ) : canLoadMore ? (
          <button
            onClick={() => setShown((n) => Math.min(n + PAGE, closings.length))}
            className="btn-outline-dark"
          >
            Load More
          </button>
        ) : (
          !preview && (
            <div className="text-center max-w-md">
              <p className="text-ink-muted font-light italic mb-8 text-lg">
                You've seen them all. Want to be next?
              </p>
              <Link href="/contact" className="btn-solid">
                Schedule a Consult
              </Link>
            </div>
          )
        )}
      </div>
    </section>
  );
}
