# Brand Bonjour — Shared Resend Setup

How form-submission emails work across every realtor site Brand Bonjour
ships (Samina, Shoukoufa, future RA properties). One API key, one
verified domain, one sender address — each site only needs to know
*who receives* the lead.

## The architecture

```
                       ┌─────────────────────────────┐
                       │   Resend account (one)      │
                       │   admin@brandbonjour.com    │
                       │                             │
                       │   Verified domain:          │
                       │     brandbonjour.com        │
                       │   Default sender:           │
                       │     notify@brandbonjour.com │
                       └──────────────┬──────────────┘
                                      │
              one shared RESEND_API_KEY (re_359y…)
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
┌───────▼────────┐           ┌────────▼────────┐           ┌────────▼────────┐
│ Samina site    │           │ Shoukoufa site  │           │ Future realtor… │
│ Netlify env:   │           │ Netlify env:    │           │ Netlify env:    │
│ RESEND_API_KEY │           │ RESEND_API_KEY  │           │ RESEND_API_KEY  │
│                │           │                 │           │                 │
│ Recipient set  │           │ Recipient set   │           │ Recipient set   │
│ in admin →     │           │ in admin →      │           │ in admin →      │
│ Settings →     │           │ Settings →      │           │ Settings →      │
│ Notifications  │           │ Notifications   │           │ Notifications   │
│   ↓            │           │   ↓             │           │   ↓             │
│ samina@…       │           │ shoukoufa@…     │           │ realtor@…       │
└────────────────┘           └─────────────────┘           └─────────────────┘
```

**One** Resend account holds the domain verification and the API key.
**Every** realtor site uses the same key. The recipient address lives in
each site's own `site_settings` row, edited by the realtor inside their
admin panel — no Brand Bonjour involvement once it's set.

## What each piece does

### `RESEND_API_KEY`
Identifies us to Resend's API. Same value on every site. Lives in
**Netlify env vars** only — never in `.env.local`, never in git.

### `RESEND_FROM_EMAIL` = `notify@brandbonjour.com`
The verified address every email comes *from*. Same across all sites.
The realtor's name is prepended at send time, so the inbox shows:

> **Samina Bilal Website** <notify@brandbonjour.com>

The realtor doesn't need to configure any DNS records on their own
domain — Brand Bonjour owns the sending reputation.

### `RESEND_FROM_NAME_FALLBACK` = `Website`
Display name used if a realtor never sets their identity in admin.
Almost never hit in practice.

### `notification_email` (per-site, in DB)
Where leads land. Stored in `site_settings.notification_email`. The
realtor types their inbox address into **Admin → Settings →
Notifications** and saves. That's the only step they have to do.

### `notification_cc` (per-site, in DB, optional)
Optional CC — used when an assistant or team member also wants the
lead. Same admin screen.

### Per-source toggles (per-site, in DB)
`notify_contact`, `notify_valuation`, `notify_forms`, `notify_rsvp`.
Switches in the admin let the realtor mute a specific form type
without breaking the form itself.

## The send flow

1. A visitor submits any form (Contact, Valuation, Leave Review, Open
   House RSVP, custom form).
2. The server action that records the lead also calls
   `sendLeadNotification({ source, data, name, email, phone, message })`
   in `lib/emailNotifications.ts`. It's fire-and-forget — the form
   succeeds even if email fails.
3. `sendLeadNotification`:
   - Reads the realtor's settings via `getSiteSettings()`.
   - No-ops if `RESEND_API_KEY` is unset (dev environments).
   - No-ops if `notification_email` is blank.
   - No-ops if the per-source toggle is off ("muted").
   - Otherwise builds the email and sends.
4. The email arrives in the realtor's inbox with:
   - **From**: `<Realtor Name> Website <notify@brandbonjour.com>`
   - **Reply-To**: the submitter's email — so the realtor replies *from
     their inbox* and the lead receives a real response from the
     realtor, not from Brand Bonjour.
   - **Subject**: e.g. `New Contact form — Jane Doe → Samina Bilal`
   - **Body**: HTML table of every submitted field + a `View in admin`
     CTA linking back to `/admin/inbox` on the realtor's site.

## Adding a new realtor site

Three steps, ~5 minutes:

1. **Copy three env vars into the new site's Netlify project**:
   ```
   RESEND_API_KEY=re_…              # same value as Samina/Shoukoufa
   RESEND_FROM_EMAIL=notify@brandbonjour.com
   RESEND_FROM_NAME_FALLBACK=Website
   ```
2. **Apply migration `0018_email_notifications.sql`** to the site's
   Supabase project (adds the columns to `site_settings`).
3. **Hand off**: tell the realtor to open Admin → Settings →
   Notifications, type their email address, and hit "Send Test Email"
   to confirm it lands.

The shared key works because each site reads its *own* `site_settings`
row to decide where the email goes. There is no global routing logic —
just one Resend account fanning out to N inboxes.

## Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Forms work but no email arrives | `RESEND_API_KEY` not set in Netlify | Add it via `netlify env:set` |
| Forms work, no email, admin shows error | `notification_email` blank in admin | Realtor sets it in Admin → Settings |
| Some forms email, others don't | Per-source toggle off | Flip toggle in admin |
| Email lands in spam | New recipient hasn't whitelisted `notify@brandbonjour.com` | Realtor adds to contacts |
| Resend dashboard shows 4xx | API key revoked or rate limit | Check Resend dashboard (admin@brandbonjour.com) |

## Security & deliverability notes

- The shared API key is a **secret**. It lives only in Netlify env
  vars. Never commit it; never paste it into chat or docs. Rotate via
  Resend dashboard if exposed.
- All sites send from the same domain reputation. A spam complaint
  against one realtor's emails could affect deliverability for all.
  Subjects are deterministic and bodies are transactional — low risk
  in practice, but worth knowing.
- The `Reply-To` header points to the submitter, not to
  `notify@brandbonjour.com`. Realtor replies go directly to the lead,
  not through Brand Bonjour's mailbox.
