# Pages

The routes Astro builds.

| File | What it serves |
| --- | --- |
| `[...slug].astro` | Each documentation page |
| `[...slug].md.ts` | The same page as markdown, at `/{path}.md` |
| `llms.txt.ts` | A list of the pages, for agents and answer engines |
| `llms-full.txt.ts` | The full text of those pages |
| `sitemap.xml.ts` | The sitemap |
| `robots.txt.ts` | `robots.txt` |

A page with `noindex: true` stays on the site and is left out of the markdown copy, the sitemap, and the `llms` files.
