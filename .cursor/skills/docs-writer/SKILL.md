---
name: docs-writer
description: >-
  Writes and edits Blnk docs pages in the site's voice, layout, and code
  samples. Use when writing or editing a page in src/content, including MDX
  copy, frontmatter, headings, intros, callouts, steps, tables, and code.
---

# Docs writer

Follow this skill on every write or edit of a page in `src/content`. Read [patterns.md](patterns.md) for the page type you are touching. Read [COMPONENTS.md](../../../COMPONENTS.md) before using a tag. A tag that is not in `src/ui/mdx/components.ts` and not a snippet is a stop: ask, and do not add a component.

Check the current product before you write an endpoint, a field, a status, or an SDK method. Use the `blnk-docs` MCP: `orient`, then `search`, `list_pages`, or `get_operation`, then `read_page`. A value Blnk stores and never reads stays out.

Keep the original path. Do not add a folder to give a group a new URL.

## One page, one job

The page does one thing. The opening answers that job. A sentence that does not serve it comes out.

The name of the thing is the same in the nav, the title, and the first paragraph. A tier of a product stays a tier.

A reader who already knows their constraint can name the next page from this one. Link that page by its title. Do not write "To learn more, see the following."

The page does not close with a line that says the reader has finished.

## Frontmatter

`title` is the H1. Sentence case: first word capitalized, the rest lowercase. Product names and acronyms stay capitalized: Blnk, Core, Cloud, Watch, Typesense, Go, Java, Python, TypeScript, Git, OAuth, API, SDK, CLI.

A title says what the page is. An overview names the subject: `Balances overview`. A changelog names the product: `Go SDK changelog`. A quick start or error page names the language and leaves `SDK` out: `TypeScript quick start`, `Go error handling`.

`description` is the lede under the title. One sentence about what the reader does on this page. A product slogan goes in `metaDescription`, not in `description` and not as the opening paragraph.

`sidebarTitle` only when the sidebar label differs from the title, such as `Overview` or `Quick start`. `icon` only on a page that is a direct child of a group. The name is a file in `src/icons/line` or an alias in `src/icons/mingcute.ts`. Leave `icon` off a page inside a dropdown.

Do not set `seoTitle`. The document title is `{title} – Blnk Docs` with an en dash. The page `/` uses `Blnk Finance Official Documentation`.

On an endpoint page, set `method` and `path` together. The path matches the OpenAPI spec. A placeholder uses the field name, `{ledger_id}`, not `{id}`.

`enterprise: license` on a licensed page. `tutorial: true` on a tutorial. `noindex: true` only when the page must stay out of search.

## Opening

The body starts with what the thing is and what the reader does with it. Two or three sentences. It does not list the headings on the page.

```mdx
An identity is a customer on your ledger, either an individual or an organization. Create one, then link it to a balance so the transactions on that balance belong to the same customer.
```

A version that gates the whole page sits above that opening, as `Version`.

## Sentences

A paragraph is 2 or 3 sentences. Break a fourth sentence into the next paragraph. Do not stack one-line paragraphs unless that sentence is its own point. A sentence that only restates the heading does not get its own paragraph.

Write to the reader, in the present tense. Name the action. "Call [Create ledger](/reference/create-ledger)." A list is for parallel items. Order is a numbered list or `Steps`. A comparison is a table.

Put the field, status, command, env var, or id in backticks. Bold the control the reader clicks: **Deploy new Core**. A shortcut is `` `⌥ L` `` (`Alt+L` on Windows).

Escape `$` as `\$`.

Do not number headings. `## 1: Installation Guide` is `## Install Blnk`.

## Callouts

| Tag | Use for |
| --- | --- |
| `Version` | A version: when a feature shipped, which Core release a behavior starts in, which SDK release targets a Core version |
| `Warning` | Something that breaks, leaks, or is the wrong tool if ignored |
| `Note` | Extra context that stays in the flow |
| `Info` | A fact the reader needs before they continue, such as who the feature is for |
| `Tip` | A shorter path |
| `Check` | A confirmed outcome that is not obvious from the step |

Do not use `Info`, `Note`, `Tip`, `Warning`, or `Check` for a version line.

A sentence that only confirms the result of a step is a paragraph after the step, not a `Check`. You'll find the instance at `http://localhost:5001`.

An `<Info>` under `### Response` on an API reference page is an intro for that section, not a callout. Write it as a paragraph.

## Steps, dashboard, and samples

A step title is the action. Two actions that are one outcome, such as clone and then start, are one step. Prerequisites are what block the first command. A step that does not move the reader to the page's outcome belongs on another page.

When a Core page explains an action you can also do in the dashboard, put the steps and screenshots on that page. Do not link to a Cloud page for those steps. Do not add a Cloud page that only repeats them.

On a guide, `### Using the API` and `### Using the Dashboard` are h3s under that section's h2. The request and response tabs sit under `### Using the API`. An action that exists only in the API stays under the h2. Do not add `### Using the API` with no dashboard sibling.

When the dashboard covers more than one API section, `## Using the Dashboard` is its own h2 after those sections.

`Using API` and `Using the Dashboard` as tab titles is the quick start only, where both choices are steps.

A dashboard form step lists the fields, then the screenshot:

```md
- **Amount:** `1000`
- **Currency:** `USD`
```

Screenshots live in `src/content/img/`. Write `![alt](img/...)`. The alt says what the screen shows. A JSX `<img src="img/...">` 404s.

A money movement map is a shortened `map.blnkfinance.com` or `map.blnkfinance.xyz` URL inside `<Map>`.

## Code

Every fence has a title. The first word is the language. The title is the words after it. `wrap`, `expandable`, `highlight=`, `focus=`, a `{line}` range, and `icon="..."` are flags, not the title.

A request is the client name, usually `cURL`. When several requests in one example share a language, the title is the action, such as `View ledgers`. A response is the status, such as `200 OK` or `201 Created`. When several responses share a status, the title says which one, such as `All ledgers`.

On a guide, pair the request and the response in tabs. The request tab title is the action, such as `Create ledger`, not `Request`. That tab holds the `CodeGroup`, then the field table. The response tab is `Response` and holds the sample, then its table.

Guide field tables have no Type column. Request columns are Field, Description, and Required. Response columns are Field and Description.

```md
| Field | Description | Required |
| :--- | :--- | :--- |
| `name` | Name of the ledger. | Yes |
```

Language tabs in a `CodeGroup` are `cURL`, `TypeScript`, `Go`, `Python`, and `Java`, in that order, and only for languages the page actually shows. Lines wrap. Do not add `wrap`.

On an API reference page, samples go in `RequestExample` and `ResponseExample`. Sibling fences become tabs. Do not wrap them in `CodeGroup`. Those lines scroll. Group request fields under `### Path`, `### Query`, `### Body`, or `### Header` with `ParamField`. A path field is `required`. Response fields use `ResponseField`.

Core samples call `http://localhost:5001`. Cloud samples call `https://api.cloud.blnkfinance.com`. The header is `X-blnk-key`. Do not send `status`. Blnk sets it.

## Links and closers

`RelatedTopics` is the last block. The items are the next pages for this subject. Point at deploy, configuration, or LLM pages only when the page is about them.

Do not use `Card` or `CardGroup` as a list of links. Do not add `NeedHelp`. Do not paste an `export const` block. Do not put a `---` divider between sections. Leave the frontmatter fences.

Snippets take no props. API pages start with `<Key />` or `<Authorization />` when the page is about a Cloud call. `Key` starts at Authorization. Do not put back a note about an auto-provisioned Enterprise Core URL.

## Before the page is done

- Give a reader one constraint. They can name the right next page, and the reason, in one sentence.
- Every endpoint, field, status, command, image tag, env var, and port matches the current docs or Core. Nothing was copied from memory.
- The guide reaches the outcome the title and the opening promised.
- A fourth sentence did not stay in a paragraph. A version line is `Version`. A fence has a title.
