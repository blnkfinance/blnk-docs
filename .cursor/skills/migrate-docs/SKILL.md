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

- **Core** stays at the top level: `home/`, `ledgers/`, `balances/`, `transactions/`, `reconciliations/`, `identities/`, `metadata/`, `search/`, `webhooks/`, `operating/`, `guides/`, `tutorials/`, `changelog/`, `migrations/`, and `index`. API key guides live in `operating/api-keys/`.
- **Cloud** stays in `cloud/`. That is the enterprise product. There is no `/enterprise` folder.
- **Watch** stays in `watch/`. It is its own tab.
- **API Reference** stays in `reference/` and `watch/reference/`. Cloud API pages are `reference/<slug>` with `enterprise: license`. There is no `reference/cloud/` or `cloud/reference/` folder.
- **SDKs & CLI** stay in `cli/` and `sdks/{typescript,go,python,java}/`.

No page is listed in more than one tab. Operating pages live in `operating/`. `changelog/` holds the product changelog pages. Core version migrations live in `migrations/core/`. Migrate to Blnk Cloud lives at `migrations/migrate-to-cloud`. Do not write those pages back under `changelog/` or `cloud/instances/`. Do not move a file to give a group its own folder.

Landing pages, added only once that file exists:

| Tab or menu | Path | Page |
| --- | --- | --- |
| Core | `/` | `index` |
| Cloud | `/cloud` | `cloud/index` |
| Watch | `/watch/quick-start` | `watch/quick-start` |
| API Reference | `/reference/core` | `reference/core` |
| Core APIs | `/reference/core` | `reference/core` |
| Enterprise APIs | `/reference/enterprise` | `reference/enterprise` |
| Watch APIs | `/watch/reference/overview` | `watch/reference/overview` |
| Blnk CLI | `/cli/install` | `cli/install` |
| Typescript SDK | `/sdks/typescript/start/quick-start` | `sdks/typescript/start/quick-start` |
| Go SDK | `/sdks/go/start/quick-start` | `sdks/go/start/quick-start` |
| Python SDK | `/sdks/python/start/quick-start` | `sdks/python/start/quick-start` |
| Java SDK | `/sdks/java/start/quick-start` | `sdks/java/start/quick-start` |

## Confirm in chat, then wait

Read every source page in the chunk before posting. The message is the plan for this chunk only:

- **Where it sits.** Tab, menu item when there is one, and group name. Page order, including dropdowns, matching sections.md. On the API tab, list every page. Do not add a dropdown unless the user said to. Name the groups already on the site so this one is placed against them.
- **Slugs.** One line per page: original path, `src/content/{path}.mdx`, and URL. These match unless a file is already at the destination.
- **Icons.** A direct child of the group gets a Mingcute name in frontmatter. A page inside a dropdown does not. The sidenav reads `icon` only on those top-level pages. A name counts only if it is a file in `src/icons/line` or an alias in `src/icons/mingcute.ts`. When sections.md marks a source icon on this tab, menu, or dropdown, show `source → mingcute` for that node. For a top-level page, propose a Mingcute name. Brand images such as `/icons/node-js.svg` are menu marks, not page icons. Do not write a name that is not in the Mingcute set.
- **What might break.** Only risks that are true for this chunk. For each one, say how this chunk will fix it. Do not list a risk with no fix.

  - An MDX tag that is not registered. Ignore tags inside code fences. Fix: skip that page and ask. Do not invent a component.
  - A fence with no title after the language. Fix: use the source title. A request is the client name, usually `cURL`. When several requests in one example share a language, the title is the action, such as `View ledgers`. A response is the status, such as `200 OK`. When several responses share a status, the title says which one, such as `All ledgers`.
  - A `$` in prose. Fix: escape it as `\$`.
  - An `<img>` or a screenshot still in `public/`. Fix: move the file to `src/content/img/` and use `![alt](img/...)`.
  - A link to a page that is not on the site yet. Fix: keep the original path, and name the chunk that adds the target.
  - A landing page this chunk would add. Fix: add that tab or menu from the landing table, and no others.
  - A file already at the destination. Fix: edit that file in place. Do not add a second path.
  - A folder shared with another group. Fix: add this group's pages in that folder. Do not move the other group's files.
  - An endpoint `method` or `path` that does not match `/openapi/openapi.json`. Fix: use the spec. A path placeholder uses the field name, such as `{ledger_id}`, not `{id}`.
  - A field or behavior Blnk Core does not have or does not use. Fix: leave it out. Confirm in `blnkfinance/blnk`. A value that is only stored, and never read, stays out.
  - A pasted `export const` block, or `<NeedHelp />`. Fix: delete it.
  - A `<Card>` or `<CardGroup>`. Fix: drop it. A link to another page goes in RelatedTopics.
  - A dropdown on the API tab. Fix: list the pages in the group. Add a dropdown only when the user said to.
  - An icon name that is not a Mingcute file or alias. Fix: propose a name that is, and show `source → mingcute`.
  - The prototype clear has not run. Fix: list the specimen pages and nav groups, delete them, then write this chunk.

Wait for a yes. On yes, do that chunk only. Then set its status line to `done` and stop. Do not start the next group. Do not start the dev server.

## First accepted chunk

If any specimen page is still in `src/content/`, do this once before writing the chunk.

Delete the specimen pages: `core/`, `enterprise/`, `learn/`, `api/`, the prototype guides (`guides/install`, `guides/ledgers`, `guides/transactions/`, `guides/balances/`), `cli/index.mdx`, and `sdks/*/index.mdx`. Keep `src/content/snippets/`.

Keep a minimal `index.mdx` so `/` builds, unless this chunk is Core · Start Here, which replaces it with the original home page.

Rewrite `src/content/docs.json` navigation. Drop the Learn tab and the Open source / Enterprise labels. After the clear, only `/` exists, so the only tab is Core with path `/` and the groups this chunk adds. Add Cloud, Watch, API Reference, or SDKs & CLI when this chunk creates that landing page. Menu items use `label`, not Mintlify's `item`. A nested Mintlify `group` becomes a `dropdown`, except on the API tab, where those pages are listed. Do not add an API dropdown unless the user said to.

`tabPath` in `src/ui/navigation.ts` must allow `/`. An empty root must not steal `/` from the Core tab. When several tabs match, the longest matching tab or menu prefix wins, so `/reference/...` stays on API Reference and `/cloud/...` stays on Cloud.

Add optional `icon` to the docs schema in `src/content.config.ts`. `src/ui/Pages.astro` shows that icon on a page that is a direct child of a group, and not on a page nested in a dropdown.

## Write each page

Read the source from `blnkfinance/blnk-docs` at the same path (the docs filesystem, or GitHub). Do not copy specimen pages. Keep the source wording, and apply Copy.

Remove dividers from the body. A divider is a horizontal rule on its own line, `---`, between sections. Leave the frontmatter fences.

When a Core page explains an action you can also do in the dashboard, put the steps and screenshots on that page. Do not link to a Cloud page for those steps. Do not add a separate Cloud page that only repeats them. That section uses `### Using the API` and `### Using the Dashboard`. See **Using the API and the dashboard** under Decisions already on the site.

When a request sample and its response are followed by a `Tabs` pair of field tables, keep the tabs. The request tab holds the code group, then its field table. The response tab holds the response sample, then its field table. Code groups stay code groups.

Frontmatter `title` is the H1. `description` is the lede: one sentence about what the reader does on this page. If the source blockquote is a product slogan, rewrite it. Copy `sidebarTitle` when the source has one. The sidebar uses `sidebarTitle`, and uses `title` in sentence case when it is absent. Copy `og:title` to `seoTitle` and `og:description` to `metaDescription`. `seoTitle` is the full document title and `og:title`. It already includes the site name, and `documentTitle` does not append ` | Blnk Documentation` when it is set. `metaDescription` is the meta description and `og:description`. Drop the H1 and blockquote from the body. On an endpoint page, set `method` and `path` together, matching the source and the OpenAPI spec. On a top-level page, set `icon` to the Mingcute name from the accepted plan. Leave `icon` off nested pages.

Delete pasted `export const` blocks, including `RelatedTopics` and `CtaCallout`. Drop `<NeedHelp />`. It is not used on docs or API reference pages. Do not import `<Card>` or `<CardGroup>` from the source. Drop them. A link to another page goes in RelatedTopics. Use the components in `src/ui/mdx/components.ts` and the snippets in `src/content/snippets`. The reference is [COMPONENTS.md](../../../COMPONENTS.md). Registered tags: Note, Info, Version, Tip, Warning, Check, Steps, Step, CardGroup, Card, Tabs, Tab, AccordionGroup, Accordion, CodeGroup, ParamField, ResponseField, RequestExample, ResponseExample, Frame, Map, Video, Expandable, Update, Icon, Tooltip, RelatedTopics, SchemaChart, SectionLabel, DockerImage, Key, Authorization, ApiKey.

Keep internal links. They already use the original paths.

Every fenced code block needs a title. The first word is the language. The title is the words after it. `wrap`, `expandable`, `highlight=`, `focus=`, a `{line}` range, and `icon="..."` are flags, not the title.

````md
```bash cURL
```json 201 Created
```typescript Quick start
````

A fence that is only a language, such as `` ```json ``, has no title. The header then shows the language, or `Code`. Take the title from the source fence. Do not invent one that disagrees with the sample. A request is the client name, usually `cURL`. When several requests in one example share a language, the title is the action, such as `View ledgers` or `Get ledger`. A response is the status, such as `200 OK` or `201 Created`. When several responses share a status, the title says which one, such as `All ledgers`. Inside a `CodeGroup`, that title is the tab. Inside `RequestExample` and `ResponseExample`, it is the label on the block. Do not add `wrap` on those fences. The lines scroll. Several fences stay siblings inside `RequestExample` or `ResponseExample`. The page turns them into tabs. Do not wrap them in `CodeGroup`.

If a tag is not registered, skip that page and ask. Do not invent a component. `<JsonNode` inside a Java sample is source code, not a component.

Add the page to `docs.json` in the original group, in the original order.

## Decisions already on the site

Do not undo these. A stated length in px stays that px. Do not divide it by the 15px root font size.

### Copy

The lede is one sentence about what the reader does on this page. A product slogan stays in `metaDescription`. It is not the lede.

Do not number headings. `## 1: Installation Guide` becomes `## Install Blnk`.

The opening says what the thing is and what the reader does. It does not list the headings on the page. The page does not close with a line that says the reader has finished.

Name a tab by the choice the reader is making, such as `On your machine` or `Using Blnk Cloud`. On a guide, `Using the API` and `Using the Dashboard` are h3s, not tab titles. See **Using the API and the dashboard**.

A step title is the action. Two source steps that are one action, such as clone and then start, become one step. A shortcut is `⌥ L` (`Alt+L` on Windows`). The control name is bold.

A dashboard form step lists the fields, then the screenshot:

```md
- **Amount:** `1000`
- **Currency:** `USD`
```

A sentence that only confirms the result is a paragraph after the step, not a Check.

Related topics are the next pages for this subject. Point at deploy, configuration, or LLM pages only when the page is about them.

Escape `$` as `\$`.

### A page works

One page, one job. The opening answers that job. A sentence that does not serve it comes out.

A reader who already knows their constraint can name the next page from this one. The name of a thing is the same in the nav, the title, and the first paragraph. A tier of a product stays a tier.

A module, command, image tag, env var, or port is a claim. Trace it to the current source page or the Core repo before writing it.

A step changes the outcome the page promises. Prerequisites are what block the first command. A step that does not move the reader there belongs on another page.

A paragraph is 2 or 3 sentences. Break a fourth sentence into the next paragraph. Do not stack one-line paragraphs unless that sentence is its own point. A list is for parallel items. A sentence that only restates the heading does not get its own paragraph.

A callout that states a version uses `Version`. That includes when a feature shipped, which Core release a behavior starts in, and which SDK release targets a Core version. Do not use `Info`, `Note`, `Tip`, `Warning`, or `Check` for that line.

A callout that states a version uses `Version`. That includes "available in version", "from Blnk Core", and which release a package targets. Do not use `Info`, `Note`, `Tip`, `Warning`, or `Check` for that line.

Before the page is done, check it as someone who did not write it:

- Give them one constraint. They name the right next page, and the reason, in one sentence.
- Tick every claim against the source without the draft open.
- Follow the guide. It reaches the outcome the page promised.

### Dividers

Remove every `---` between sections. Leave the frontmatter fences. Do not put a divider back.

### Samples

Do not add `wrap` on a fence inside `RequestExample` or `ResponseExample`. Those lines scroll.

Several fences inside one `RequestExample` or `ResponseExample` stay siblings. The page groups them as tabs. Do not wrap them in `CodeGroup`.

A guide that pairs a request and a response uses tabs. The request tab title is the action, such as `Create ledger` or `Update ledger`, not `Request`. That tab holds the code group, then the field table. The response tab is `Response` and holds the sample, then its table. Those tables have no Type column. Request columns are Field, Description, and Required. Response columns are Field and Description.

A path placeholder uses the field name from the spec, such as `{ledger_id}`, not `{id}`.

Group request fields under `### Path`, `### Query`, `### Body`, or `### Header`. A path field is `required`.

Do not document a field, parameter, or behavior that Blnk Core does not have or does not use. Confirm it in `blnkfinance/blnk` before adding it. A value that is accepted or stored, and never read, stays out.

An `<Info>` under `### Response` on an API reference page is an intro paragraph for that section, not a callout.

A sentence that only confirms the result of a step is a paragraph after the step, not a Check callout.

### Version

A line that says a feature is available in a particular version is `<Version>`, not `<Info>`.

```mdx
<Version>Available in version 0.8.4 and later.</Version>
```

### Images

Screenshots live in `src/content/img/`, not `public/`. Write them as markdown images: `![alt](img/...)`. `img/file.png` resolves from `src/content` on any page. A JSX `<img src="img/...">` becomes a relative URL and 404s.

### Using the API and the dashboard

When one section shows the same action in the API and in the dashboard, both are h3s under that section's h2. Do this on every guide that has both, including identities.

```md
## Create an identity

### Using the API

Call the endpoint, then the request and response tabs.

### Using the Dashboard

The steps and screenshots.
```

The request and response tabs sit under `### Using the API`. Do not put those tabs directly under the h2. Do not hang the dashboard steps on a later section.

When the dashboard covers more than one API section, such as tokenizing one field and several fields, `## Using the Dashboard` is its own h2 after those sections. Do not nest it under the last one.

An action that exists only in the API stays under the h2. Do not add `### Using the API` with no dashboard sibling.

`Using API` and `Using the Dashboard` as tab titles is the quick start only, where both choices are steps. On a guide, those words are the h3s above.

### Outline

A `<Tab title="...">` is a table-of-contents child of the heading it follows. Clicking that item opens the tab and scrolls to it. Do not add a heading only to list a tab. Under `### Using the API`, the request and response tabs nest under that h3.

### Spacing and type

- `.article h2` margin-top is `64px`.
- `.article .page-description` margin-bottom is `32px`.
- When `<Steps>` is the first element in a tab, that `.steps` margin-top is `0` and the tab panel padding-top is the space above it. That padding is `24px`.
- The endpoint path beside the method badge, `.endpoint-path`, is `14px`.

### API navigation

List every page on the API tab. Do not add a dropdown unless the user said to.

### Cards

Do not import `<Card>` or `<CardGroup>` from the source. Drop them. A link to another page goes in RelatedTopics.

### Need help

Do not add `<NeedHelp />` on a docs page or an API reference page. Drop it from the source.

### Authorization snippet

`src/content/snippets/key.mdx` starts at Authorization. Do not put back the Note about the auto-provisioned Enterprise Core instance or `https://ENTERPRISE_PUBLIC_URL/core`. If a source page includes that note, drop it.

### Quick start

`src/content/install.mdx` is `/install`. Do not replace it with the original `home/install` page.

It has two sections, with no numbers on the headings: Install Blnk, then Record your first transaction. Nothing else. No "View your ledger", key concepts, or dry run.

Install Blnk has two tabs, "On your machine" and "Using Blnk Cloud". On your machine is one step: clone the repo and `docker compose up` in one code block. The result is a paragraph, not a Check: the reader will find the instance at `http://localhost:5001`. Using Blnk Cloud merges sign-up and Deploy Core into one step and uses `img/home/cloud-home.png`. There is no Check after the step that waits until the instance is connected.

The opening introduces the problem Blnk solves for developers, correctness and reliable ledger infrastructure, then how little it takes to start. It does not describe the sections on the page.

Record your first transaction has two tabs, "Using API" and "Using the Dashboard". Both are Steps. The API sample sends `skip_queue: true`, and the response status is `APPLIED`. Dashboard steps and screenshots stay on this page. The page ends with related pages for the ledger, balance, transaction, and identity introductions.
