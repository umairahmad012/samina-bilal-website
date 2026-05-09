"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2, ExternalLink, Printer } from "lucide-react";
import {
  createOpenHouse,
  updateOpenHouse,
  deleteOpenHouse,
  type OpenHouseInput,
} from "@/app/admin/open-houses/actions";
import ImagePicker, {
  type LibraryItem,
} from "@/components/admin/media/ImagePicker";
import {
  OPEN_HOUSE_FEATURES,
  MAX_FEATURES,
} from "@/lib/openHouseFeatures";

export default function OpenHouseForm({
  existingId,
  initial,
  library,
}: {
  existingId?: string;
  initial: OpenHouseInput;
  library: LibraryItem[];
}) {
  const router = useRouter();
  const [v, setV] = useState<OpenHouseInput>(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof OpenHouseInput>(k: K, val: OpenHouseInput[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  function toggleFeature(key: string) {
    const has = v.features.includes(key);
    if (has) {
      set(
        "features",
        v.features.filter((f) => f !== key),
      );
      return;
    }
    if (v.features.length >= MAX_FEATURES) {
      setError(
        `Pick at most ${MAX_FEATURES} features. Uncheck one before adding another.`,
      );
      return;
    }
    setError(null);
    set("features", [...v.features, key]);
  }

  function handleSave() {
    setError(null);
    if (!v.heading || !v.slug) {
      setError("Heading and slug are required.");
      return;
    }
    if (v.features.length === 0) {
      setError("Pick at least one feature (up to 4).");
      return;
    }
    startTransition(async () => {
      const res = existingId
        ? await updateOpenHouse(existingId, v)
        : await createOpenHouse(v);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      if (!existingId && res.slug) {
        router.push(`/admin/open-houses/${res.slug}`);
      } else {
        router.refresh();
      }
    });
  }

  function handleDelete() {
    if (!existingId) return;
    if (!confirm(`Delete this open house? This also removes its RSVP form.`))
      return;
    startTransition(async () => {
      const res = await deleteOpenHouse(existingId);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/admin/open-houses");
      router.refresh();
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-8 py-8 md:py-12">
      <Link
        href="/admin/open-houses"
        className="inline-flex items-center gap-1.5 text-xs text-ink/55 hover:text-ink mb-6"
      >
        <ArrowLeft size={14} /> All open houses
      </Link>

      <div className="flex items-end justify-between gap-4 flex-wrap mb-8">
        <div>
          <p
            className="text-[0.65rem] tracking-[0.32em] uppercase text-ink/55 mb-3"
            style={{ fontWeight: 500 }}
          >
            {existingId ? "Edit Open House" : "New Open House"}
          </p>
          <h1
            className="text-2xl md:text-3xl text-ink mb-2"
            style={{ fontWeight: 300, letterSpacing: "0.04em" }}
          >
            {v.heading || "Untitled"}
          </h1>
          {existingId && (
            <div className="flex items-center gap-3 text-xs text-ink/65">
              <code className="text-[11px] bg-black/5 px-1.5 py-0.5 rounded">
                /open-house/{v.slug}
              </code>
              <a
                href={`/open-house/${v.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-navy hover:underline"
              >
                <ExternalLink size={12} /> Preview
              </a>
              <a
                href={`/open-house/${v.slug}?print=1`}
                target="_blank"
                className="inline-flex items-center gap-1 text-navy hover:underline"
              >
                <Printer size={12} /> Print flyer
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {/* Basics */}
        <div className="admin-card p-6 space-y-4">
          <h2
            className="text-xs tracking-[0.18em] uppercase text-ink/55"
            style={{ fontWeight: 500 }}
          >
            Basics
          </h2>
          <div>
            <label className="admin-label">Open house heading</label>
            <input
              className="admin-input"
              value={v.heading}
              onChange={(e) => set("heading", e.target.value)}
              placeholder="Open House — 1234 Maple Lane"
            />
          </div>
          <div>
            <label className="admin-label">Full address</label>
            <input
              className="admin-input"
              value={v.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="1234 Maple Lane, Woodbridge, VA 22192"
            />
          </div>
          <div>
            <label className="admin-label">Slug (URL)</label>
            <input
              className="admin-input"
              value={v.slug}
              onChange={(e) =>
                set(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-]+/g, "-")
                    .replace(/^-+|-+$/g, ""),
                )
              }
              placeholder="1234-maple-lane"
            />
            <p className="text-[11px] text-ink/45 mt-1">
              The public URL: <code>/open-house/{v.slug || "[slug]"}</code>
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Date</label>
              <input
                type="date"
                className="admin-input"
                value={v.open_date ?? ""}
                onChange={(e) => set("open_date", e.target.value || null)}
              />
            </div>
            <div>
              <label className="admin-label">Time (free-form)</label>
              <input
                className="admin-input"
                value={v.open_time_label ?? ""}
                onChange={(e) => set("open_time_label", e.target.value || null)}
                placeholder="1:00 PM – 4:00 PM"
              />
              <p className="text-[11px] text-ink/45 mt-1">
                Shown in the prominent pill on the hero photo.
              </p>
            </div>
          </div>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={v.is_published}
              onChange={(e) => set("is_published", e.target.checked)}
            />
            <span className="text-sm text-ink/75">
              {v.is_published
                ? "Published — landing page is live"
                : "Draft — page returns 404 publicly"}
            </span>
          </label>
        </div>

        {/* Photos */}
        <div className="admin-card p-6 space-y-6">
          <h2
            className="text-xs tracking-[0.18em] uppercase text-ink/55"
            style={{ fontWeight: 500 }}
          >
            Photos
          </h2>
          <ImagePicker
            label="Hero photo (full-width landscape)"
            crop="wide"
            value={v.hero_image_id}
            onChange={(id) => set("hero_image_id", id)}
            cropArea={v.hero_image_crop}
            onCropAreaChange={(c) => set("hero_image_crop", c)}
            library={library}
            emptyText="The big landscape photo at the top of the flyer."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImagePicker
              label="Second photo"
              crop="landscape"
              value={v.second_image_id}
              onChange={(id) => set("second_image_id", id)}
              cropArea={v.second_image_crop}
              onCropAreaChange={(c) => set("second_image_crop", c)}
              library={library}
            />
            <ImagePicker
              label="Third photo"
              crop="landscape"
              value={v.third_image_id}
              onChange={(id) => set("third_image_id", id)}
              cropArea={v.third_image_crop}
              onCropAreaChange={(c) => set("third_image_crop", c)}
              library={library}
            />
          </div>
        </div>

        {/* Features */}
        <div className="admin-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2
              className="text-xs tracking-[0.18em] uppercase text-ink/55"
              style={{ fontWeight: 500 }}
            >
              Features ({v.features.length} of {MAX_FEATURES})
            </h2>
            <span className="text-[11px] text-ink/55">
              Pick up to {MAX_FEATURES}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {OPEN_HOUSE_FEATURES.map((f) => {
              const checked = v.features.includes(f.key);
              const disabled =
                !checked && v.features.length >= MAX_FEATURES;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleFeature(f.key)}
                  disabled={disabled}
                  className={`text-xs px-3 py-2 rounded border text-left transition-colors ${
                    checked
                      ? "bg-navy text-white border-navy"
                      : disabled
                        ? "bg-black/5 text-ink/35 border-black/10 cursor-not-allowed"
                        : "bg-white text-ink/75 border-black/10 hover:border-navy/40"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="admin-card p-6 space-y-4">
          <h2
            className="text-xs tracking-[0.18em] uppercase text-ink/55"
            style={{ fontWeight: 500 }}
          >
            Description (2 lines)
          </h2>
          <textarea
            rows={3}
            className="admin-input"
            value={v.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Sun-drenched four-bedroom in Lake Ridge with a rare flat lot, two-car garage, and a kitchen made for hosting."
          />
        </div>

        {/* Auto-form note */}
        <div className="admin-card p-5 bg-cream-soft/40 border-dashed">
          <p className="text-xs uppercase tracking-[0.18em] text-ink/55 mb-2">
            RSVP Form
          </p>
          <p className="text-sm text-ink/75 leading-relaxed">
            A sign-up form is{" "}
            {existingId ? "already attached" : "auto-created on save"} so
            visitors can RSVP from the landing page. Fields: name, email,
            phone, party size. Submissions land in your{" "}
            <a
              href="/admin/inbox"
              className="text-navy underline underline-offset-2"
            >
              Inbox
            </a>
            .
          </p>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}

      {/* Sticky save bar */}
      <div className="flex items-center justify-between mt-6 sticky bottom-4 bg-white border border-black/10 rounded-md p-3 shadow-sm">
        <div>
          {existingId && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-red-700 hover:text-red-800 rounded hover:bg-red-50"
            >
              <Trash2 size={13} /> Delete open house
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/open-houses"
            className="px-4 py-2 text-xs text-ink/65 hover:text-ink rounded hover:bg-black/5"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSave}
            disabled={pending || !v.heading || !v.slug}
            className="admin-btn"
          >
            <Save size={14} className="mr-2" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
