/**
 * Mintlify-style related topics list.
 *
 * @param {{ title?: string, items: Array<{ title: string, href: string }> }} props
 */
export const RelatedTopics = ({ title = "Related topics", items = [] }) => {
  if (!items.length) {
    return null
  }

  return (
    <nav className="related-topics not-prose mt-20 mb-10 flex flex-col" aria-label={title}>
      <p className="related-topics-heading m-0 border-b border-zinc-200 pb-3 text-sm font-medium text-zinc-500 dark:border-white/10 dark:text-zinc-400">
        {title}
      </p>
      <ul className="related-topics-list m-0 mt-3 flex list-none flex-col gap-0.5 p-0">
        {items.map((item) => {
          const isExternal =
            typeof item.href === "string" && /^https?:\/\//i.test(item.href)

          return (
            <li key={item.href} className="m-0 p-0">
              <a
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="related-topics-link group inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 no-underline transition-colors dark:text-zinc-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="related-topics-icon shrink-0 text-zinc-400 dark:text-zinc-500"
                  aria-hidden="true"
                >
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                  <path d="M10 9H8" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                </svg>
                <span className="relative top-px transition-colors group-hover:text-[#DD7B1B]">
                  {item.title}
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
