import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Calendar, Clock, Phone, Mail, Instagram } from "lucide-react";
import { getOpenHouseBySlug } from "@/lib/openHousesLoader";
import { getPortrait } from "@/lib/contentLoader";
import {
  OPEN_HOUSE_FEATURE_BY_KEY,
  OPEN_HOUSE_FEATURES,
} from "@/lib/openHouseFeatures";
import { site } from "@/lib/site";
import * as LucideIcons from "lucide-react";
import PrintFlyerActions from "@/components/openhouse/PrintFlyerActions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const oh = await getOpenHouseBySlug(slug);
  if (!oh) return { title: "Open House" };
  return {
    title: `${oh.heading} | Samina Bilal`,
    description: oh.description || `Open house at ${oh.address}.`,
  };
}

function formatDate(iso: string | null): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function OpenHousePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [oh, portrait] = await Promise.all([
    getOpenHouseBySlug(slug),
    getPortrait(),
  ]);
  if (!oh) notFound();

  const dateLabel = formatDate(oh.date);
  const features = oh.features
    .map((k) => OPEN_HOUSE_FEATURE_BY_KEY[k])
    .filter(Boolean);

  return (
    <>
      {/* Print + global tweaks scoped to this page */}
      <style>{`
        @page { size: A4 portrait; margin: 0; }
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #fff !important; }
          header, nav, footer, .no-print { display: none !important; }
          .flyer { box-shadow: none !important; margin: 0 !important; page-break-inside: avoid; }
        }
        .flyer { width: 210mm; min-height: 297mm; }
        @media (max-width: 760px) {
          .flyer { width: 100%; min-height: 0; }
        }
      `}</style>

      <main className="bg-cream-soft py-10 md:py-16 px-4 print:p-0 print:bg-white">
        <article
          className="flyer mx-auto bg-white text-ink shadow-[0_30px_80px_-30px_rgba(20,40,64,0.25)] flex flex-col"
          style={{ fontFamily: "var(--font-montserrat), system-ui, sans-serif" }}
        >
          {/* Header band — slim navy strip with brokerage line */}
          <div
            className="bg-navy text-white px-8 md:px-10 py-4 flex items-center justify-between"
            style={{ fontWeight: 300 }}
          >
            <div className="flex items-center gap-3">
              <div className="text-[0.6rem] tracking-[0.4em] uppercase opacity-90">
                {site.brokerageOffice.name}
              </div>
            </div>
            <div className="text-[0.6rem] tracking-[0.32em] uppercase opacity-80">
              Open House
            </div>
          </div>

          {/* Heading + address */}
          <div className="px-8 md:px-10 pt-7 md:pt-9 pb-5 md:pb-6 text-center">
            <h1
              className="text-2xl md:text-[2rem] leading-[1.15] text-ink"
              style={{ fontWeight: 300, letterSpacing: "0.02em" }}
            >
              {oh.heading}
            </h1>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[0.7rem] md:text-xs tracking-[0.2em] uppercase text-ink/65">
              <MapPin size={12} strokeWidth={1.5} />
              <span style={{ fontWeight: 400 }}>{oh.address}</span>
            </div>
          </div>

          {/* Hero photo with date/time pill */}
          <div className="relative mx-6 md:mx-8 aspect-[16/9] overflow-hidden rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={oh.hero}
              alt={oh.heading}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {(dateLabel || oh.timeLabel) && (
              <div className="absolute top-4 right-4 md:top-5 md:right-5 bg-white/95 backdrop-blur-sm rounded-full px-4 md:px-5 py-2 md:py-2.5 shadow-lg border border-white/60 max-w-[60%]">
                <div className="flex items-center gap-2">
                  <Calendar
                    size={14}
                    className="text-navy shrink-0"
                    strokeWidth={1.75}
                  />
                  <div className="text-[0.62rem] md:text-[0.7rem] uppercase tracking-[0.16em] text-navy leading-tight" style={{ fontWeight: 500 }}>
                    {dateLabel && <div>{dateLabel}</div>}
                    {oh.timeLabel && (
                      <div className="text-ink/75 mt-0.5">{oh.timeLabel}</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Two more landscape photos */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mx-6 md:mx-8 mt-3 md:mt-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={oh.second}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={oh.third}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Features row */}
          {features.length > 0 && (
            <div className="px-8 md:px-10 pt-6 md:pt-7 pb-2">
              <div
                className="grid gap-2 md:gap-3"
                style={{
                  gridTemplateColumns: `repeat(${features.length}, minmax(0, 1fr))`,
                }}
              >
                {features.map((f) => {
                  const Icon =
                    (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>>)[
                      f.icon
                    ] ?? LucideIcons.Check;
                  return (
                    <div
                      key={f.key}
                      className="text-center bg-cream-soft/70 rounded px-2 py-3"
                    >
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        className="text-navy mx-auto mb-1.5"
                      />
                      <p
                        className="text-[0.6rem] md:text-[0.7rem] tracking-[0.14em] uppercase text-ink/85 leading-tight"
                        style={{ fontWeight: 500 }}
                      >
                        {f.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Description */}
          {oh.description && (
            <div className="px-8 md:px-10 py-4 md:py-5 text-center">
              <p
                className="text-sm md:text-[0.95rem] text-ink/85 italic leading-[1.65] max-w-2xl mx-auto"
                style={{ fontWeight: 300 }}
              >
                {oh.description}
              </p>
            </div>
          )}

          {/* Realtor contact */}
          <div className="mt-auto bg-navy text-white px-8 md:px-10 py-5 md:py-6 flex items-center gap-5">
            <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden ring-2 ring-white/30 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={portrait.avatar}
                alt={site.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm md:text-base"
                style={{ fontWeight: 500, letterSpacing: "0.02em" }}
              >
                {site.name} · Realtor
              </p>
              <p className="text-[0.65rem] md:text-[0.72rem] tracking-[0.18em] uppercase opacity-80">
                {site.brokerageOffice.name}
              </p>
              <div className="mt-1.5 flex items-center gap-3 md:gap-4 flex-wrap text-[0.7rem] md:text-xs">
                <a
                  href={site.phoneHref}
                  className="inline-flex items-center gap-1.5 opacity-95 hover:opacity-100"
                >
                  <Phone size={11} strokeWidth={1.75} />
                  {site.phone}
                </a>
                <a
                  href={site.emailHref}
                  className="inline-flex items-center gap-1.5 opacity-95 hover:opacity-100"
                >
                  <Mail size={11} strokeWidth={1.75} />
                  {site.email}
                </a>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 opacity-95 hover:opacity-100"
                >
                  <Instagram size={11} strokeWidth={1.75} />
                  homewithsamina
                </a>
              </div>
            </div>
            {oh.formId && (
              <div className="hidden md:flex flex-col items-end gap-1 text-right shrink-0 print:flex">
                <p
                  className="text-[0.6rem] tracking-[0.28em] uppercase opacity-85"
                  style={{ fontWeight: 500 }}
                >
                  RSVP online
                </p>
                <p className="text-[0.7rem] opacity-90">
                  saminarealtor.com/open-house/{oh.slug}
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Web-only call-to-action under the flyer */}
        <div className="no-print max-w-2xl mx-auto mt-8 text-center">
          <Link
            href="/"
            className="text-xs tracking-[0.2em] uppercase text-ink/55 hover:text-ink"
          >
            ← Back to Samina&rsquo;s site
          </Link>
        </div>
      </main>

      {/* Hovering action bar (Print / RSVP) — hidden during print */}
      <PrintFlyerActions
        formId={oh.formId ?? ""}
        formSlug={`open-house-${oh.slug}`}
        heading={oh.heading}
        address={oh.address}
        hasForm={Boolean(oh.formId)}
      />
    </>
  );
}
