"use client";

import { useState, useTransition } from "react";
import { X, Send, Check } from "lucide-react";
import { submitFormPublic } from "@/app/admin/forms/actions";

export default function SignupModal({
  formId,
  formSlug,
  heading,
  address,
  onClose,
}: {
  formId: string;
  formSlug: string;
  heading: string;
  address: string;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partySize, setPartySize] = useState("");
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await submitFormPublic({
        formId,
        source: formSlug,
        data: {
          name,
          email,
          phone,
          party_size: partySize,
          open_house: heading,
          address,
        },
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDone(true);
    });
  }

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/60 flex items-center justify-center p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-md w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-5 border-b border-black/10 flex items-center justify-between">
          <div>
            <p
              className="text-[0.6rem] tracking-[0.32em] uppercase text-ink/55"
              style={{ fontWeight: 500 }}
            >
              RSVP
            </p>
            <h3
              className="text-lg text-ink mt-1"
              style={{ fontWeight: 400, letterSpacing: "0.02em" }}
            >
              Save my spot
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-ink/55 hover:text-ink"
          >
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <div className="inline-flex w-12 h-12 rounded-full bg-emerald-50 items-center justify-center mb-5">
              <Check size={22} className="text-emerald-700" strokeWidth={1.5} />
            </div>
            <p className="text-base text-ink leading-relaxed">
              Got it — see you there. We&rsquo;ll send a reminder the day before.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 text-xs uppercase tracking-[0.18em] text-ink/65 hover:text-ink"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-6 space-y-4">
            <p className="text-xs text-ink/55 leading-relaxed mb-2">
              {heading}
              <br />
              {address}
            </p>

            <div>
              <label className="text-[10px] uppercase tracking-[0.18em] text-ink/55 block mb-1.5" style={{ fontWeight: 500 }}>
                Your name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-black/15 rounded text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-[0.18em] text-ink/55 block mb-1.5" style={{ fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-black/15 rounded text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-[0.18em] text-ink/55 block mb-1.5" style={{ fontWeight: 500 }}>
                  Phone <span className="text-ink/40 normal-case">(optional)</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 border border-black/15 rounded text-sm focus:outline-none focus:border-navy"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-[0.18em] text-ink/55 block mb-1.5" style={{ fontWeight: 500 }}>
                  Party size
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={partySize}
                  onChange={(e) => setPartySize(e.target.value)}
                  placeholder="1"
                  className="w-full p-3 border border-black/15 rounded text-sm focus:outline-none focus:border-navy"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full inline-flex items-center justify-center px-7 py-3 bg-navy text-white text-sm rounded hover:bg-navy-dark disabled:opacity-50"
              style={{ fontWeight: 500, letterSpacing: "0.04em" }}
            >
              <Send size={14} className="mr-2" />
              {pending ? "Sending…" : "Save my spot"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
