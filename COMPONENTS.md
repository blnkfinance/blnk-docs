# Components

How to use the MDX components in `src/content`. A rendered copy of each tag lives on the [component library](/library) page (`src/content/library.mdx`).

Pages in `src/content` get every component below with no import. The map is `src/ui/mdx/components.ts`, passed in from `src/pages/[...slug].astro`.

Snippets in `src/content/snippets` are MDX files imported as components. Each file is compiled on its own, so it imports the components it uses.

The page heading, description, and endpoint bar come from frontmatter, not from a component. Set `title` and `description` on every page. Set `method` and `path` together on API pages (`GET`, `POST`, `PUT`, or `DELETE`, and a path that starts with `/`).

## Callouts

`Note`, `Info`, `Tip`, `Warning`, and `Check` share one layout. The tone changes the color. A label row, with its icon, always appears. Omit `label` and it uses the tone name: Note, Info, Tip, Warning, or Check.

| Tag | Use for |
| --- | --- |
| `Note` | Extra context that stays in the article flow |
| `Info` | Neutral background the reader should see before continuing |
| `Tip` | A shorter path or a recommended starting point |
| `Warning` | Something that will break or leak if ignored |
| `Check` | A confirmed outcome |

```mdx
<Note>
A note stays in the article flow. Links and `code` inside it use the same type as the rest of the page.
</Note>

<Info label="Before you ship">
Info is the same component with a different label.
</Info>

<Warning>
Do not commit an API key in a public repository.
</Warning>
```

| Prop | Type | |
| --- | --- | --- |
| `label` | `string` | Heading inside the callout. Defaults to the tone name |

## Steps

A numbered sequence. The numbers come from the order of `Step` children.

```mdx
<Steps>
  <Step title="Create a ledger">
    Give the ledger a name. The id comes back on the response.
  </Step>
  <Step title="Create a balance" id="create-balance">
    Attach the balance to that ledger.
  </Step>
</Steps>
```

`titleSize="h3"` enlarges the step titles. Any other value leaves the default size.

| Component | Prop | Type | |
| --- | --- | --- | --- |
| `Steps` | `titleSize` | `"h2"` \| `"h3"` \| `boolean` | Only `"h3"` changes the title size |
| `Step` | `title` | `string` | Required |
| `Step` | `id` | `string` | Optional anchor on the step |

## Cards

A grid of links or static tiles. `CardGroup` defaults to two columns and stacks to one column on narrow screens.

```mdx
<CardGroup cols={2}>
  <Card title="Install Blnk" icon="sparkles" href="/core">
    Deploy your ledger in minutes.
  </Card>
  <Card title="Ledgers" icon="book">
    Learn how ledgers work in Blnk.
  </Card>
</CardGroup>
```

A card with `href` renders as a link and shows an arrow. Omit `href` for a tile that does not navigate.

| Component | Prop | Type | |
| --- | --- | --- | --- |
| `CardGroup` | `cols` | `number` | Columns. Default `2` |
| `Card` | `title` | `string` | Required |
| `Card` | `icon` | `string` | Optional icon name. See [Icons](#icons) |
| `Card` | `href` | `string` | Optional link |

## Tabs

The first tab is selected. Each `Tab` needs a `title`. An optional `icon` sits in the tab button.

```mdx
<Tabs>
  <Tab title="Pull" icon="download-2">
    Pull the image, then start the server.
  </Tab>
  <Tab title="Push">
    Push a built image to your registry.
  </Tab>
</Tabs>
```

| Component | Prop | Type | |
| --- | --- | --- | --- |
| `Tab` | `title` | `string` | Required. Shown on the tab button |
| `Tab` | `icon` | `string` | Optional icon name |

## Accordions

`AccordionGroup` draws the shared top border. Each `Accordion` starts closed, and more than one can be open at once.

```mdx
<AccordionGroup>
  <Accordion title="API feels slow" icon="heartbeat">
    Check the hot-balance guide before you add more workers.
  </Accordion>
  <Accordion title="Transactions stuck in QUEUED">
    The queue drains after the worker catches up.
  </Accordion>
</AccordionGroup>
```

| Component | Prop | Type | |
| --- | --- | --- | --- |
| `Accordion` | `title` | `string` | Required |
| `Accordion` | `icon` | `string` | Optional icon name |

## Expandable

A single disclosure. The summary defaults to `Details`.

```mdx
<Expandable title="Optional parameters">
  These fields can be omitted. Blnk fills the defaults.
</Expandable>
```

| Prop | Type | |
| --- | --- | --- |
| `title` | `string` | Summary text. Default `Details` |

## Frame

Wraps an image or other media and prints an optional caption.

```mdx
<Frame caption="Wordmark used in the docs header.">

![Blnk wordmark](img/logo/dev-light-mode.svg)

</Frame>
```

| Prop | Type | |
| --- | --- | --- |
| `caption` | `string` | Optional figcaption |

Images in `src/content` are rewritten to site paths by the content-images remark plugin. Put the file next to the page, or under `src/content`, and reference it the way the page already does.

The frame has no background, border, or padding. It shows the image, then the caption.

## Map

Embeds a Blnk money movement map. `src` is a `https://map.blnkfinance.com` or `https://map.blnkfinance.xyz` URL. The map in the page is view-only. **View full map** opens it.

```mdx
<Map
  src="https://map.blnkfinance.xyz/YIVzmTEYZ5"
  title="Wallet structure"
/>
```

| Prop | Type | |
| --- | --- | --- |
| `src` | `string` | Required. Map URL |
| `title` | `string` | Accessible name. Default `Blnk map` |

**View full map** is a secondary button under the embed. It opens the map in a new tab. |

## Video

A 16:9 embed that fills the article column. `src` is the player URL. `title` is the accessible name.

```mdx
<Video
  src="https://www.youtube.com/embed/EIPuW0Wt004"
  title="How Money Moves in a Wallet App: Ledger Design Explained"
/>
```

| Prop | Type | |
| --- | --- | --- |
| `src` | `string` | Required. Embed URL |
| `title` | `string` | Required. Accessible name of the video |

## Update

A changelog entry. `label` is the version or the change name. `description` is the secondary line, usually a date.

```mdx
<Update label="1.5.0" description="Sep 24, 2026">
  Balance snapshots can be taken for a single ledger.
</Update>
```

| Prop | Type | |
| --- | --- | --- |
| `label` | `string` | Required |
| `description` | `string` | Optional |

## Tooltip

The slot is the text in the sentence. `tip` is the text that appears on hover and keyboard focus.

```mdx
You can detect if <Tooltip tip="Any change leaves a visible sign in the hash or chain.">protected fields</Tooltip> were changed after recording.
```

| Prop | Type | |
| --- | --- | --- |
| `tip` | `string` | Required |

## Icon

An inline MingCute icon, or an image when `icon` is a path.

```mdx
<Icon icon="sparkles" size={16} color="currentColor" />
```

| Prop | Type | |
| --- | --- | --- |
| `icon` | `string` | Required. Icon name, or a path starting with `/` or `./` |
| `size` | `number` | Pixels. Default `16` |
| `color` | `string` | CSS color. Default `currentColor` |

An unknown name renders as small text of that name.

## Section label

A short labeled row above a block of prose. It is not a heading, so it does not appear in the table of contents.

```mdx
<SectionLabel icon="list-ordered">Usage</SectionLabel>
```

| Prop | Type | |
| --- | --- | --- |
| `icon` | `string` | Required icon name |

## API fields

`ParamField` documents a request field. Set one of `body`, `query`, `path`, or `header`. That value is the field name, and it also sets the location badge.

```mdx
<ParamField body="identity_type" type="string" required>
  `individual` or `organization`.
</ParamField>

<ParamField query="per_page" type="integer" default="10">
  Results per page.
</ParamField>

<ParamField path="balance_id" type="string" required>
  Balance id, for example `bln_…`.
</ParamField>

<ParamField header="X-blnk-key" type="string" required>
  Secret API key.
</ParamField>
```

| Prop | Type | |
| --- | --- | --- |
| `body` | `string` | Field name. Location badge `body` |
| `query` | `string` | Field name. Location badge `query` |
| `path` | `string` | Field name. Location badge `path` |
| `header` | `string` | Field name. Location badge `header` |
| `type` | `string` | Shown next to the name, for example `string` or `object` |
| `required` | `boolean` | Shows a required badge |
| `default` | `string` | Shows `default` and the value. Omit it, or leave it empty, to hide the badge |

`ResponseField` documents a response field. Nest fields to show an object or array.

```mdx
<ResponseField name="data" type="array">
  The page of results.

  <ResponseField name="ledger_id" type="string" required>
    Id of the ledger.
  </ResponseField>
</ResponseField>
```

| Prop | Type | |
| --- | --- | --- |
| `name` | `string` | Required |
| `type` | `string` | Shown next to the name |
| `required` | `boolean` | Shows a required badge |

Consecutive fields of the same kind and location are grouped. A heading, paragraph, or other element between them starts a new group. Each field opens on click.

## Code

Fenced code blocks highlight with Shiki. Every block gets a copy button. A block longer than 12 lines collapses behind **Show more**.

The first word of the fence info is the language. `text` is an alias for plaintext. Words after the language become the title.

````mdx
```bash cURL wrap
curl -X POST "http://localhost:5001/ledgers" \
  -H "X-blnk-key: <api-key>"
```
````

| Meta | Effect |
| --- | --- |
| Title words | Inside a `CodeGroup`, this is the tab label. Example: `cURL`, `200 OK` |
| `wrap` | Long lines wrap |
| `highlight={2}` | Highlight those lines. Also `highlight={2,4-6}` or `{2,4-6}` |
| `focus={2,3}` | Dim every line outside the range. Ranges work the same way as highlight |

Line numbers start at 1. `expandable` and `icon="name"` are stored on the block and do not change the layout. Collapse follows the 12-line rule on its own.

### Code group

Put fences one after another inside `CodeGroup`. Each fence becomes a tab. The tab label is the fence title, then the language, then `Code`.

````mdx
<CodeGroup>

```bash cURL wrap
curl -X POST "http://localhost:5001/ledgers" \
  -H "X-blnk-key: <api-key>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Customer wallets" }'
```

```json 200 OK highlight={2}
{
  "ledger_id": "ldg_049495fe-6f03-4e7b-b3b4-7b0466c127c7",
  "name": "Customer wallets",
  "created_at": "2026-09-24T00:00:00Z"
}
```

</CodeGroup>
````

The fences need to be direct children of `CodeGroup`. The first tab is selected.

## Request and response examples

`RequestExample` and `ResponseExample` hold the sample for an API page. Place them as top-level tags in the page. The layout lifts those blocks into the right-hand rail. An example nested inside another component stays in the article.

````mdx
<RequestExample>

```bash cURL
curl -X GET "http://localhost:5001/ledgers/ldg_049495fe" \
  -H "X-blnk-key: <api-key>"
```

</RequestExample>

<ResponseExample>

```json 200 OK
{
  "ledger_id": "ldg_049495fe",
  "name": "Customer wallets"
}
```

</ResponseExample>
````

Neither component takes props. A fence title, such as `cURL` or `201 Created`, is the label on that block. These blocks do not show a copy button.

`ResponseExample` can hold a `CodeGroup`. Each fence title becomes a tab.

````mdx
<ResponseExample>

<CodeGroup>

```json 201 Created
{
  "ledger_id": "ldg_049495fe"
}
```

```json 400 Bad Request
{
  "error": "name is required"
}
```

</CodeGroup>

</ResponseExample>
````

## Related topics

A list of follow-up links. The block is omitted when `items` is empty. Links that start with `http://` or `https://` open in a new tab.

```mdx
<RelatedTopics
  items={[
    { title: "Open source", href: "/core" },
    { title: "Blnk Finance", href: "https://blnkfinance.com" },
  ]}
/>
```

| Prop | Type | |
| --- | --- | --- |
| `title` | `string` | Heading. Default `Related pages` |
| `items` | `{ title: string; href: string }[]` | Default `[]` |

## Schema chart

A fixed diagram of how transactions, balances, ledgers, and identity connect. It takes no props.

```mdx
<SchemaChart />
```

## Snippets

Shared blocks for API pages. They live in `src/content/snippets` and are imported as components from `src/ui/mdx/components.ts`. They take no props. Drop the tag in where the page needs that copy.

```ts
export { default as ApiKey } from '../../content/snippets/api-key.mdx';
```

A snippet is compiled on its own, so it also imports any component it uses:

```mdx
import ParamField from '../../ui/mdx/ParamField.astro';
```

| Tag | Inserts |
| --- | --- |
| `ApiKey` | Core authorization header (`X-blnk-key`) |
| `Authorization` | Cloud authorization, including the API key and OAuth token |
| `Key` | Enterprise base URL note, then the authorization header |
| `DockerImage` | Which image name to use for Blnk `0.15.3` and later, and for `0.15.2` and earlier |
| `NeedHelp` | Support email and Discord closer |

```mdx
<ApiKey />
```

## Icons

Icon names are the file names in `src/icons/line`, without `.svg`. `sparkles` loads `src/icons/line/sparkles.svg`.

These older names still resolve:

| You can write | Loads |
| --- | --- |
| `activity` | `heartbeat` |
| `book-open` | `book` |
| `circle-check` | `check-circle` |
| `info` | `information` |
| `lightbulb` | `bulb` |
| `magnifying-glass` | `search-2` |
| `rotate` | `refresh-2` |
| `rotate-cw` | `refresh-2` |
| `scale-balanced` | `balance` |
| `search` | `search-2` |
| `sliders-horizontal` | `settings-2` |
| `triangle-alert` | `alert` |
| `water` | `drop` |

A file with the same name as the alias wins over the alias.

## Adding a component

1. Add the Astro file under `src/ui/mdx/`.
2. Export it from `src/ui/mdx/components.ts`.
3. Add a sample to `src/content/library.mdx`.

Content pages can use the tag on the next render. Snippets still import the component file directly.
