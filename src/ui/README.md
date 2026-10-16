# UI

The chrome around a documentation page.

| File | What it is |
| --- | --- |
| `DocsLayout.astro` | The page: header, sidebar, article, and the list on the right |
| `Header.astro` | The wordmark, the tabs, and search |
| `Nav.astro`, `Pages.astro` | The sidebar |
| `Toc.astro`, `TocList.astro` | "On this page", and Copy page |
| `navigation.ts` | Reads `src/content/docs.json` and checks that every listed page exists |

Tags used inside a page live in [mdx](mdx/README.md).
