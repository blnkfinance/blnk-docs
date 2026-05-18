/**
 * Promotional CTA block for MDX (distinct from Mintlify Note/Tip/Warning).
 *
 * Import in any page:
 *   import { CtaCallout } from "/snippets/cta-callout.jsx"
 *
 * @param {object} props
 * @param {string} [props.title="Ready for production?"] — Heading above the body (rendered as `h3`).
 * @param {string} [props.buttonLabel="Explore deployment"] — Label for the primary link/button.
 * @param {string} props.href — Destination URL. Internal docs paths (e.g. `/home/deploy`) stay in-tab; `http(s)://` opens in a new tab unless `buttonTarget` overrides.
 * @param {string} [props.trackingEvent] — If set, click fires analytics helpers: `CustomEvent("blnk:docs-cta")`, `posthog.capture(trackingEvent, { href })`, and `dataLayer.push({ event: "docs_cta_click", cta_name, cta_href })`. The anchor also gets `data-docs-cta={trackingEvent}` for GTM/CSS. Omit to skip all tracking.
 * @param {string} [props.buttonTarget] — Optional `target` on the anchor (e.g. `_self`). Defaults to `_blank` only for external `href`; internal links have no target.
 * @param {string} [props.rel="noopener noreferrer"] — Applied when the link opens in a new tab (external URLs by default).
 * @param {React.ReactNode} props.children — Body copy below the title (text or light JSX).
 *
 * Layout: from the `lg` breakpoint up, the section is 125% of the parent content width and shifted with a negative margin so it stays centered (horizontal bleed). Mobile/tablet stays full width of the column.
 */
export const CtaCallout = ({
  title = "Ready for production?",
  buttonLabel = "Explore deployment",
  href,
  trackingEvent,
  buttonTarget,
  rel = "noopener noreferrer",
  children,
}) => {
  const handleCtaClick = () => {
    if (typeof window === "undefined" || !trackingEvent) {
      return
    }

    try {
      window.dispatchEvent(
        new CustomEvent("blnk:docs-cta", {
          detail: { name: trackingEvent, href },
        }),
      )
    } catch {
      /* non-fatal */
    }

    try {
      window.posthog?.capture?.(trackingEvent, { href })
    } catch {
      /* non-fatal */
    }

    try {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: "docs_cta_click",
        cta_name: trackingEvent,
        cta_href: href,
      })
    } catch {
      /* non-fatal */
    }
  }

  const isExternal = typeof href === "string" && /^https?:\/\//i.test(href)
  const target = buttonTarget ?? (isExternal ? "_blank" : undefined)
  const linkRel = isExternal ? rel : undefined

  return (
    <section
      className="not-prose relative my-10 overflow-hidden rounded-2xl border border-zinc-950/[0.08] bg-gradient-to-br from-[#DD7B1B]/[0.09] via-white to-zinc-50/80 p-6 shadow-sm sm:p-8 dark:border-white/[0.09] dark:from-[#8F4812]/[0.14] dark:via-zinc-950 dark:to-zinc-950 lg:max-w-none lg:w-[125%] lg:-ml-[12.5%]"
      aria-labelledby="blnk-cta-callout-title"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#DD7B1B]/[0.15] blur-2xl dark:bg-[#6B3810]/[0.35]"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-5">
        <div className="min-w-0 space-y-3">
          <h3
            id="blnk-cta-callout-title"
            className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-white"
          >
            {title}
          </h3>
          <div className="text-[0.9375rem] leading-relaxed text-zinc-950/80 dark:text-white/75">
            {children}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-stretch pt-1 sm:items-start">
          <a
            href={href}
            target={target}
            rel={linkRel}
            onClick={handleCtaClick}
            data-docs-cta={trackingEvent || undefined}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#DD7B1B] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#DD7B1B]/25 transition hover:bg-[#c56d18] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#DD7B1B] sm:w-auto dark:bg-[#A85E18] dark:shadow-black/25 dark:hover:bg-[#8F5014] dark:focus-visible:outline-[#C47322]"
          >
            {buttonLabel}
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
