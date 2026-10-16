---
name: migrate-docs
description: >-
  Migrates Blnk docs from blnkfinance/blnk-docs onto this site one nav group
  at a time, keeping each section's original path. Use when the user says to
  migrate a chunk, group, or section of the docs, or says next.
---

# Migrate docs

Move one group from [sections.md](sections.md) onto this site. Read [status.md](status.md) before choosing a group. Post the plan in chat and wait. Do not write or delete files until the user accepts.

A chunk is one group: `Core · Ledgers`, or `API Reference · Core APIs · Ledgers`. Dropdowns belong to that group. `next` means the first `pending` line in status.md. If the name matches more than one line, ask which one.

## Path rule

The URL is the original path. `ledgers/introduction` is `/ledgers/introduction`. Do not add `/core`, `/enterprise`, `/api/core`, or `/api/enterprise`.

- **Core** stays at the top level: `home/`, `ledgers/`, `balances/`, `transactions/`, `reconciliations/`, `identities/`, `metadata/`, `search/`, `webhooks/`, `api-keys/`, `guides/`, `advanced/`, `tutorials/`, `changelog/`, and `index`.
- **Cloud** stays in `cloud/`. That is the enterprise product. There is no `/enterprise` folder.
- **Watch** stays in `watch/`. It is its own tab.
- **API Reference** stays in `reference/`, `cloud/reference/`, and `watch/reference/`.
- **SDKs & CLI** stay in `cli/` and `sdks/{typescript,go,python,java}/`.

No page is listed in more than one tab. `advanced/` is shared by Configuration and Advanced. `changelog/` is shared by the product changelog pages and Migration guides. Do not move a file to give a group its own folder.

Landing pages, added only once that file exists:

| Tab or menu | Path | Page |
| --- | --- | --- |
| Core | `/` | `index` |
| Cloud | `/cloud` | `cloud/index` |
| Watch | `/watch/quick-start` | `watch/quick-start` |
| API Reference | `/reference/overview` | `reference/overview` |
| Core APIs | `/reference/overview` | `reference/overview` |
| Cloud APIs | `/cloud/reference/overview` | `cloud/reference/overview` |
| Watch APIs | `/watch/reference/overview` | `watch/reference/overview` |
| Blnk CLI | `/cli/install` | `cli/install` |
| Typescript SDK | `/sdks/typescript/start/quick-start` | `sdks/typescript/start/quick-start` |
| Go SDK | `/sdks/go/start/quick-start` | `sdks/go/start/quick-start` |
| Python SDK | `/sdks/python/start/quick-start` | `sdks/python/start/quick-start` |
| Java SDK | `/sdks/java/start/quick-start` | `sdks/java/start/quick-start` |

## Confirm in chat, then wait

Read every source page in the chunk before posting. The message is the plan for this chunk only:

- **Where it sits.** Tab, menu item when there is one, and group name. Page order, including dropdowns, matching sections.md. Name the groups already on the site so this one is placed against them.
- **Slugs.** One line per page: original path, `src/content/{path}.mdx`, and URL. These match unless a file is already at the destination.
- **Icons.** A direct child of the group gets a Mingcute name in frontmatter. A page inside a dropdown does not. The sidenav reads `icon` only on those top-level pages. A name counts only if it is a file in `src/icons/line` or an alias in `src/icons/mingcute.ts`. When sections.md marks a source icon on this tab, menu, or dropdown, show `source → mingcute` for that node. For a top-level page, propose a Mingcute name. Brand images such as `/icons/node-js.svg` are menu marks, not page icons. Do not write a name that is not in the Mingcute set.
- **What might break.** Only risks that are true for this chunk. Call out unregistered MDX tags (ignore tags inside code fences), a code fence with no title after the language, links to pages that are not on the site yet, a tab or menu landing page this chunk would add, a file already at the destination, a folder shared with another group, an endpoint `method` / `path` that does not match `/openapi/openapi.json`, pasted component exports that will be stripped, and an icon name that is not a Mingcute file or alias. If the prototype clear has not run, list the specimen pages and nav groups this run would delete.

Wait for a yes. On yes, do that chunk only. Then set its status line to `done` and stop. Do not start the next group. Do not start the dev server.

## First accepted chunk

If any specimen page is still in `src/content/`, do this once before writing the chunk.

Delete the specimen pages: `core/`, `enterprise/`, `learn/`, `api/`, the prototype guides (`guides/install`, `guides/ledgers`, `guides/transactions/`, `guides/balances/`), `cli/index.mdx`, and `sdks/*/index.mdx`. Keep `src/content/library.mdx` and `src/content/snippets/`.

Keep a minimal `index.mdx` so `/` builds, unless this chunk is Core · Start Here, which replaces it with the original home page.

Rewrite `src/content/docs.json` navigation. Drop the Learn tab and the Open source / Enterprise labels. After the clear, only `/` exists, so the only tab is Core with path `/` and the groups this chunk adds. Add Cloud, Watch, API Reference, or SDKs & CLI when this chunk creates that landing page. Menu items use `label`, not Mintlify's `item`. A nested Mintlify `group` becomes a `dropdown`.

`tabPath` in `src/ui/navigation.ts` must allow `/`. An empty root must not steal `/` from the Core tab. When several tabs match, the longest matching tab or menu prefix wins, so `/cloud/reference/...` stays on API Reference and `/cloud/ledgers/...` stays on Cloud.

Add optional `icon` to the docs schema in `src/content.config.ts`. `src/ui/Pages.astro` shows that icon on a page that is a direct child of a group, and not on a page nested in a dropdown.

## Write each page

Read the source from `blnkfinance/blnk-docs` at the same path (the docs filesystem, or GitHub). Do not copy specimen pages. Do not rewrite the prose.

Remove dividers from the body. A divider is a horizontal rule on its own line, `---`, between sections. Leave the frontmatter fences.

When a Core page explains an action you can also do in the dashboard, put the steps and screenshots on that page. Do not link to a Cloud page for those steps. Do not add a separate Cloud page that only repeats them.

When a request sample and its response are followed by a `Tabs` pair of field tables, keep the tabs. The request tab holds the code group, then its field table. The response tab holds the response sample, then its field table. Code groups stay code groups.

Frontmatter `title` is the H1. `description` is the blockquote under it. Copy `sidebarTitle` when the source has one. The sidebar uses it, and uses `title` in sentence case when it is absent. Drop that H1 and blockquote. On an endpoint page, set `method` and `path` together, matching the source and the OpenAPI spec. On a top-level page, set `icon` to the Mingcute name from the accepted plan. Leave `icon` off nested pages.

Delete pasted `export const` blocks, including `RelatedTopics` and `CtaCallout`. Use the components registered in `src/ui/mdx/components.ts`: Note, Info, Tip, Warning, Check, Steps, Step, CardGroup, Card, Tabs, Tab, AccordionGroup, Accordion, CodeGroup, ParamField, ResponseField, RequestExample, ResponseExample, Frame, Video, Expandable, Update, Icon, Tooltip, RelatedTopics, SchemaChart, SectionLabel, DockerImage, Key, Authorization, NeedHelp, ApiKey.

Keep internal links. They already use the original paths.

Every fenced code block needs a title. The first word is the language. The title is the words after it. `wrap`, `expandable`, `highlight=`, `focus=`, a `{line}` range, and `icon="..."` are flags, not the title.

````md
```bash cURL
```json 201 Created
```typescript Quick start
````

A fence that is only a language, such as `` ```json ``, has no title. The header then shows the language, or `Code`. Take the title from the source fence. Do not invent one that disagrees with the sample. A request is the client name, usually `cURL`. A response is the status, such as `200 OK` or `201 Created`. Inside a `CodeGroup`, that title is the tab. Inside `RequestExample` and `ResponseExample`, it is the label on the block. Those examples wrap on their own, so `wrap` is optional there.

If a tag is not registered, skip that page and ask. Do not invent a component. `<JsonNode` inside a Java sample is source code, not a component.

Add the page to `docs.json` in the original group, in the original order.
