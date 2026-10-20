# Components

MDX tags used in `src/content`. The source is `src/ui/mdx`. Styles for these tags are in `src/styles/mdx.css`.

A page in `src/content` gets every export from `src/ui/mdx/components.ts`, plus one tag per file in `src/content/snippets`. `src/pages/[...slug].astro` passes that map into the page. A page does not import either.

A snippet is compiled on its own. It imports each component it uses.

`Callout.astro`, `CodeBlocks.astro`, and `fields.ts` are part of this folder and are not page tags. `DocsLayout.astro` includes `CodeBlocks`. `ParamField` and `ResponseField` load `fields.ts`.

## Files

| File | Tag | What it does |
| --- | --- | --- |
| `components.ts` | | The component map. Snippets are added beside it |
| `Callout.astro` | | Shared layout for the five callouts. Not exported |
| `Note.astro` | `Note` | Callout, tone `note`, icon `information` |
| `Info.astro` | `Info` | Callout, tone `info`, icon `information` |
| `Version.astro` | `Version` | Info callout with no label |
| `Tip.astro` | `Tip` | Callout, tone `tip`, icon `bulb` |
| `Warning.astro` | `Warning` | Callout, tone `warning`, icon `alert` |
| `Check.astro` | `Check` | Callout, tone `check`, icon `check-circle` |
| `Steps.astro` | `Steps` | Numbered sequence |
| `Step.astro` | `Step` | One step |
| `TutorialSteps.astro` | `TutorialSteps` | Sections on a tutorial page |
| `TutorialStep.astro` | `TutorialStep` | One tutorial section |
| `TutorialFrame.astro` | `TutorialFrame` | Container to the right of a tutorial step |
| `TutorialCode.astro` | `TutorialCode` | Code whose `{{name}}` values follow the frame |
| `TutorialInput.astro` | `TutorialInput` | A field in a tutorial frame |
| `TutorialValue.astro` | `TutorialValue` | A fixed request value, not shown in the form |
| `TutorialForm.astro` | `TutorialForm` | Submit control for a tutorial frame |
| `TutorialResponse.astro` | `TutorialResponse` | Response hidden until that form is submitted |
| `CardGroup.astro` | `CardGroup` | Grid of cards |
| `Card.astro` | `Card` | Link or static tile |
| `Prompt.astro` | `Prompt` | Click to copy a prompt |
| `Tabs.astro` | `Tabs` | Tab set. The bar is built in the browser |
| `Tab.astro` | `Tab` | One panel |
| `AccordionGroup.astro` | `AccordionGroup` | Border around a set of accordions |
| `Accordion.astro` | `Accordion` | One disclosure. More than one can be open |
| `Expandable.astro` | `Expandable` | Single disclosure |
| `Frame.astro` | `Frame` | Figure and optional caption |
| `Map.astro` | `Map` | Money movement map embed |
| `Video.astro` | `Video` | 16:9 embed |
| `Update.astro` | `Update` | Changelog entry |
| `Tooltip.astro` | `Tooltip` | Hover and focus tip |
| `Icon.astro` | `Icon` | MingCute icon, or an image |
| `SectionLabel.astro` | `SectionLabel` | Labeled row. Not a heading |
| `ParamField.astro` | `ParamField` | Request field |
| `ResponseField.astro` | `ResponseField` | Response field |
| `fields.ts` | | Groups consecutive fields and opens them on click |
| `CodeGroup.astro` | `CodeGroup` | Wrapper. Tabs are built in the browser |
| `CodeBlocks.astro` | | Copy button, titles, collapse, and code-group tabs |
| `RequestExample.astro` | `RequestExample` | Sample lifted into the right-hand rail |
| `ResponseExample.astro` | `ResponseExample` | Sample lifted into the right-hand rail |
| `RelatedTopics.astro` | `RelatedTopics` | Follow-up links |
| `SchemaChart.astro` | `SchemaChart` | Fixed diagram of ledgers, balances, identity, and transactions |
| `LakeFlow.astro` | `LakeFlow` | Node diagram. The ledger copies into the sync, the sync stores archive files, and DuckDB reads them |

The page heading, description, and endpoint bar come from frontmatter. See [README.md](README.md).

## Callouts

`Note`, `Info`, `Tip`, `Warning`, and `Check` render `Callout`. The tone sets the color and the default icon. A label row appears when the label has any text. Omit `label` and the label is the tone name. Pass an empty `label` and the row is omitted.

`Version` is that info callout with the label left off. Use it for a line that says a feature is available in a particular version. It takes no props.

| Tag | Use for |
| --- | --- |
| `Note` | Extra context that stays in the article flow |
| `Info` | Neutral background the reader should see before continuing |
| `Version` | A feature is available in a particular version. No label |
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

<Version>Available in version 0.8.4 and later.</Version>
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

`titleSize="h3"` enlarges the step titles. `"h2"`, a boolean, or omitting the prop leaves the default size.

| Component | Prop | Type | |
| --- | --- | --- | --- |
| `Steps` | `titleSize` | `"h2"` \| `"h3"` \| `boolean` | Only `"h3"` changes the title size |
| `Step` | `title` | `string` | Required |
| `Step` | `id` | `string` | Optional anchor on the step |

## Cards

A grid of links or static tiles. `CardGroup` defaults to two columns and stacks to one column on narrow screens.

```mdx
<CardGroup cols={2}>
  <Card title="Install Blnk" icon="sparkles" href="/">
    Deploy your ledger in minutes.
  </Card>
  <Card title="Ledgers" icon="book">
    Learn how ledgers work in Blnk.
  </Card>
</CardGroup>
```

A card with `href` renders as a link and shows an arrow. Omit `href` for a tile that does not navigate.

`Card` also accepts `iconType` on its props type. The component does not read it.

| Component | Prop | Type | |
| --- | --- | --- | --- |
| `CardGroup` | `cols` | `number` | Columns. Default `2` |
| `Card` | `title` | `string` | Required |
| `Card` | `icon` | `string` | Optional icon name. See [Icons](#icons) |
| `Card` | `href` | `string` | Optional link |

## Prompt

A button. Clicking it copies the prompt. The prompt text is not shown on the page.

```mdx
<Prompt>
Add the server, then tell me if I need to reload.
</Prompt>
```

`Prompt` takes no props.

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
| `Tabs` | `sync` | `string` | Optional. Groups with the same value keep the same tab index selected |
| `Tab` | `title` | `string` | Required. Shown on the tab button |
| `Tab` | `icon` | `string` | Optional icon name |

The tab bar is built on the client from the `Tab` children. The first panel is shown. A `sync` value links two or more `Tabs` on the page: choosing a tab in one selects the tab at the same index in the others.

A `Tab` title is a table-of-contents child of the `h2` or `h3` it follows. `src/lib/toc.ts` reads `title="..."` from the markdown. Clicking that item opens the tab and scrolls to it. The tab's id is the slug of its title. A second tab with the same title gets `-2`, then `-3`.

## Accordions

`AccordionGroup` draws a border around the set, with a divider between items. A single `Accordion` has its own border. Each `Accordion` starts closed. More than one can be open at once.

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

`AccordionGroup` takes no props. Open and close animate. `prefers-reduced-motion: reduce` snaps open and closed.

## Expandable

A single disclosure. The summary defaults to `Details`. It starts closed and uses the same motion as an accordion.

```mdx
<Expandable title="Optional parameters">
  These fields can be omitted. Blnk fills the defaults.
</Expandable>
```

| Prop | Type | |
| --- | --- | --- |
| `title` | `string` | Summary text. Default `Details` |

## Frame

Wraps an image or other media and prints an optional caption. The frame has no background, border, or padding.

```mdx
<Frame caption="Wordmark used in the docs header.">

![Blnk wordmark](img/logo/dev-light-mode.svg)

</Frame>
```

| Prop | Type | |
| --- | --- | --- |
| `caption` | `string` | Optional figcaption |

Images in `src/content` are rewritten to site paths by `src/lib/remark-content-images.ts`. `img/file.png` resolves from `src/content` on any page. A path that starts with `.`, `/`, or a scheme is left alone. A missing file is left alone. Write screenshots as markdown images. A JSX `<img src="img/...">` becomes a relative URL and 404s.

## Map

Embeds a Blnk money movement map. `src` must be `https` on `map.blnkfinance.com` or `map.blnkfinance.xyz`. Any other value renders nothing.

The iframe can be zoomed and panned. Editing stays off. **View full map** opens the same URL in a new tab.

```mdx
<Map
  src="https://map.blnkfinance.xyz/YIVzmTEYZ5"
  title="Wallet structure"
/>
```

| Prop | Type | |
| --- | --- | --- |
| `src` | `string` | Required. Map URL on an allowed host |
| `title` | `string` | Accessible name. Default `Blnk map` |

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

A changelog entry. `label` is the version. It is the heading, and the table of contents lists those versions. `description` is the date, shown beside the version.

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

The slot is the text in the sentence. `tip` is the text that appears on hover and keyboard focus. The wrapper is focusable.

```mdx
You can detect if <Tooltip tip="Any change leaves a visible sign in the hash or chain.">protected fields</Tooltip> were changed after recording.
```

| Prop | Type | |
| --- | --- | --- |
| `tip` | `string` | Required |

## Icon

An inline MingCute icon, or an image when `icon` is a path starting with `/` or `./`.

```mdx
<Icon icon="sparkles" size={16} color="currentColor" />
```

| Prop | Type | |
| --- | --- | --- |
| `icon` | `string` | Required. Icon name, or a path starting with `/` or `./` |
| `size` | `number` | Pixels. Default `16` |
| `color` | `string` | CSS color. Default `currentColor` |

An unknown name renders as small text of that name. Names and aliases are in [Icons](#icons).

## Section label

A short labeled row above a block of prose. It is a paragraph, so it does not appear in the table of contents.

```mdx
<SectionLabel icon="list-ordered">Usage</SectionLabel>
```

| Prop | Type | |
| --- | --- | --- |
| `icon` | `string` | Required icon name |

## API fields

`ParamField` documents a field. Set one of `body`, `query`, `path`, or `header` for a request field. That value is the field name, and it sets the location badge. If more than one is set, the first of `body`, `query`, `path`, `header` wins. Set `name` instead when the field is not a request field, such as an environment variable. `name` does not show a location badge.

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

<ParamField name="BLNK_SERVER_PORT" default="5001">
  The port Blnk listens on.
</ParamField>
```

| Prop | Type | |
| --- | --- | --- |
| `name` | `string` | Field name with no location badge |
| `body` | `string` | Field name. Location badge `body` |
| `query` | `string` | Field name. Location badge `query` |
| `path` | `string` | Field name. Location badge `path` |
| `header` | `string` | Field name. Location badge `header` |
| `type` | `string` | Shown next to the name, for example `string` or `object` |
| `required` | `boolean` | Shows a required badge |
| `default` | `string` | Shows `default` and the value. Omit it, or leave it empty, to hide the badge |
| `expanded` | `boolean` | Leaves the field open. Omit it to start collapsed |

`ResponseField` documents a response field. Nest fields to show an object or array. It has no location badge and no default badge.

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
| `expanded` | `boolean` | Leaves the field open. Omit it to start collapsed |

`fields.ts` groups consecutive fields that share a kind and, for `ParamField`, a location. A heading, paragraph, or other element between them starts a new group. Nested fields group inside their parent. Each field opens on click, with the same reduced-motion behavior as an accordion.

## Code

Fenced code is highlighted with Shiki (`one-light` / `one-dark-pro` in `astro.config.ts`). `text` is an alias for plaintext. `src/lib/fence-meta.ts` reads the words after the language. `CodeBlocks.astro` adds the title, copy button, collapse control, and code-group tabs.

The first word of the fence info is the language. Words after it are a title, unless they are a flag below.

````mdx
```bash cURL
curl -X POST "http://localhost:5001/ledgers" \
  -H "X-blnk-key: <api-key>"
```
````

Lines wrap. A block inside `RequestExample` or `ResponseExample` scrolls instead.

| Meta | Effect |
| --- | --- |
| Title words | Header on a standalone block. Tab label inside a `CodeGroup` or a multi-fence example. Example: `cURL`, `200 OK` |
| `wrap` | Accepted so the word stays out of the title. Lines wrap without it |
| `highlight={2}` | Highlight those lines. Also `highlight={2,4-6}`, `{2,4-6}`, or `2,4-6` |
| `focus={2,3}` | Dim every line outside the range. Ranges work the same way as highlight |
| `expandable` | Stored as `data-expandable`. No change to the layout |
| `icon="name"` | Stored as `data-icon`. No change to the layout |

Line numbers start at 1. A block longer than 12 lines collapses behind **Show more**. Placeholders shaped like `{ledger_id}` are marked in the sample.

A standalone block with a title gets a header. A block with only a language gets a header when it sits inside `RequestExample` or `ResponseExample`. Give every fence a title. A request is the client name, usually `cURL`. A response is the status, such as `200 OK`.

Every block gets a copy button, except a block inside `RequestExample` or `ResponseExample`.

### Code group

Put fences one after another as direct children of `CodeGroup`. Each fence becomes a tab. The tab label is the fence title, then the language, then `Code`. The first tab is selected.

````mdx
<CodeGroup>

```bash cURL
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

`CodeGroup` takes no props.

## Request and response examples

`RequestExample` and `ResponseExample` hold the sample for an API page. Place them as top-level tags in the page. `DocsLayout` moves those blocks into the right-hand rail and hides the table of contents. An example nested inside another component stays in the article.

````mdx
<RequestExample>

```bash cURL
curl -X GET "http://localhost:5001/ledgers/{ledger_id}" \
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

Neither component takes props. A fence title, such as `cURL` or `201 Created`, is the label on that block. These blocks do not show a copy button, and their lines scroll.

Two or more fences that are direct children of one example become tabs. The page does that grouping. Leave them as siblings.

````mdx
<ResponseExample>

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

</ResponseExample>
````

A `CodeGroup` inside an example also becomes tabs. Prefer sibling fences.

## Related topics

A list of follow-up links. The block is omitted when `items` is empty. Links that start with `http://` or `https://` open in a new tab. The heading is an `h2`, so it appears in the table of contents.

```mdx
<RelatedTopics
  items={[
    { title: "Install Blnk", href: "/" },
    { title: "Blnk Finance", href: "https://blnkfinance.com" },
  ]}
/>
```

| Prop | Type | |
| --- | --- | --- |
| `title` | `string` | Heading. Default `Related pages` |
| `items` | `{ title: string; href: string }[]` | Default `[]` |

## Schema chart

A fixed diagram. Transactions point to balances as source and destination. Balances point to ledgers by `ledger_id` and to identity by `identity_id`. It takes no props.

```mdx
<SchemaChart />
```

## Lake flow

A node diagram, drawn the same way as the schema chart. The ledger copies into the sync, the sync stores archive files, and DuckDB reads them. It takes no props.

```mdx
<LakeFlow />
```

## Snippets

Shared blocks live in `src/content/snippets`. A file directly in that folder becomes a tag. Drop `.mdx`, capitalize the first letter of each word, and join the words. `api-key.mdx` is `<ApiKey />`. `docker-image.mdx` is `<DockerImage />`. A single word such as `key.mdx` is `<Key />`.

The file name is lowercase words separated by hyphens. The build fails if that name matches a component, such as `note.mdx`. The content collection skips `snippets/`, so a snippet is not its own page.

A snippet takes no props. It is compiled on its own, so it imports any component it uses. A snippet that uses another snippet imports that file the same way.

```mdx
import ParamField from '../../ui/mdx/ParamField.astro';
```

| Tag | File | Inserts |
| --- | --- | --- |
| `ApiKey` | `snippets/api-key.mdx` | Core authorization header (`X-blnk-key`) |
| `Authorization` | `snippets/authorization.mdx` | Cloud authorization, including the API key and OAuth token |
| `Key` | `snippets/key.mdx` | Authorization header for an API key |
| `DockerImage` | `snippets/docker-image.mdx` | Which image name to use for Blnk `0.15.3` and later, and for `0.15.2` and earlier |
| `NeedHelp` | `snippets/need-help.mdx` | Support email and Discord closer |

```mdx
<ApiKey />
```

`Key` starts at Authorization. It does not include a note about an auto-provisioned Enterprise Core instance. Guides and API reference pages do not use `NeedHelp`.

## Icons

Icon names are the file names in `src/icons/line`, without `.svg`. `sparkles` loads `src/icons/line/sparkles.svg`. `src/icons/mingcute.ts` resolves the name. `src/icons/prepare.ts` sets the pixel size and leaves the 24×24 viewBox alone.

These older names still resolve. A file with the same name as the alias wins over the alias.

| You can write | Loads |
| --- | --- |
| `activity` | `heartbeat` |
| `arrow-left-right` | `transfer` |
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
| `user` | `user-3` |
| `water` | `drop` |

`Card`, `Tab`, `Accordion`, callouts, and `SectionLabel` all use these names. Frontmatter `icon` on a page uses the same set. The sidebar shows that icon on a page that is a direct child of a group.

## Tutorials

A tutorial is one page, with `tutorial: true` in the frontmatter. The sidenav lists that page. The story stays on that page, in `TutorialSteps`. Do not split the steps into separate files.

Each `TutorialStep` is one section. The label is `Step 1`, `Step 2`, and so on, from the order of the steps. A line sits under the label, across the article. The title renders as an `h2`.

Every tutorial page has a banner. Until a Core URL and secret are saved in the browser, it asks you to connect a sandbox. After that, it says the credentials are connected.

The browser keeps those credentials while any docs tab is open, and clears them when the last one closes. Connect and Edit open the same popover.

`TutorialFrame` sits to the right of that step. Anything inside the frame goes in that container. Several frames in one step stack down the right side.

```mdx
<TutorialSteps>
  <TutorialStep title="Design your money movement">
    Describe the balances before you create them.

    <TutorialFrame>
      The map for this step.
    </TutorialFrame>
  </TutorialStep>
</TutorialSteps>
```

| Component | Prop | Type | |
| --- | --- | --- | --- |
| `TutorialSteps` | | | Wraps the sections and numbers them |
| `TutorialStep` | `title` | `string` | Required. The section heading |
| `TutorialFrame` | | | One container on the right of its step |
| `TutorialFrame` | `plain` | `boolean` | Removes the border, background, and padding |
| `TutorialCode` | | | Wraps the code for one step. `{{name}}` fills from a `TutorialInput` with that name |
| `TutorialInput` | `name` | `string` | Required. Matches `{{name}}` in the step |
| `TutorialInput` | `label` | `string` | Required |
| `TutorialInput` | `value` | `string` | Starting value |
| `TutorialForm` | `label` | `string` | Submit button. Defaults to `Submit` |
| `TutorialForm` | `id` | `string` | Request name the server looks up on this page |
| `TutorialForm` | `method` | `string` | Core method, such as `POST` |
| `TutorialForm` | `path` | `string` | Core path, such as `/ledgers`. `{transaction_id}` is filled from a field of that name and left out of the body |
| `TutorialForm` | `save` | `string` | Name kept for a later step. Defaults to the response key, such as `ledger_id` |
| `TutorialForm` | `response` | `string` | Response key to store under `save`, when a later step needs a second `balance_id` or `identity_id` |
| `TutorialInput` | `from` | `string` | Fills this field from a saved key when that step succeeds |
| `TutorialInput` | `group` | `string` | Nests the field, such as `meta_data` |
| `TutorialInput` | `list` | `string` | Puts the field on an array, such as `transactions` |
| `TutorialInput` | `index` | `string` | Position in that array. Required with `list` |
| `TutorialInput` | `as` | `string` | JSON name when it differs from `name`, so two legs can both send `reference` |
| `TutorialInput` | `type` | `string` | `string`, `number`, `boolean`, or `amount`. Defaults to `string` |
| `TutorialInput` | `precision` | `string` | With `type="amount"`, multiplies the decimal into `precise_amount`. Another input name fills `{{that_name_precise}}` |
| `TutorialValue` | `name` | `string` | Request field set before the form, such as `reference` |
| `TutorialValue` | `value` | `string` | The fixed value sent to Core |
| `TutorialValue` | `list` | `string` | Puts the fixed field on an array, such as `transactions` |
| `TutorialValue` | `index` | `string` | Position in that array. Required with `list` |
| `TutorialValue` | `as` | `string` | JSON name when it differs from `name` |
| `TutorialResponse` | | | Stays hidden until the form in that frame is submitted. Then it shows the Core response |

Connect your sandbox is the first `Step`. Use `Connect` for the URL, the key, and the result. The reader can read every step without running one.

Each later step explains the decision, then an `Action`, then a `Result`. `Result` stays hidden until **Run on your sandbox** succeeds. `{{name}}` in a code sample, and `<Saved name="name" />` in prose, fill from the form or from an earlier step.

`id` is the name the route looks up in this page. `save` is the name stored for later steps. `response` is the response field, and it defaults to `save`. A `Field` `value` of `{{ledger_id}}` reads that saved name. `type` is `string`, `number`, or `boolean`.

````mdx
<Steps titleSize="h3">
  <Step title="Connect your sandbox">
    <Connect />
  </Step>
  <Step title="Create a customer ledger">
    <Action id="create-ledger" method="POST" path="/ledgers" save="ledger_id">
      <Field name="name" label="Ledger name" value="Customer Wallets Ledger" />

```bash cURL
curl -X POST "{{base}}/ledgers" \
  -H "X-blnk-key: {{api_key}}" \
  -d '{"name":"{{name}}"}'
```

    </Action>
    <Result>
      Core returns `ledger_id` <Saved name="ledger_id" />.
    </Result>
  </Step>
</Steps>
````

| Component | Prop | Type | |
| --- | --- | --- | --- |
| `Connect` | | | Sandbox URL, API key, and the result of reading ledgers |
| `Action` | `id` | `string` | Required. The route finds this action on the page |
| `Action` | `method` | `"GET"` \| `"POST"` \| `"PUT"` \| `"PATCH"` \| `"DELETE"` | Required. The route reads this from the file |
| `Action` | `path` | `string` | Required. A path on the reader's sandbox, such as `/ledgers` |
| `Action` | `save` | `string` | Name stored for later steps |
| `Action` | `response` | `string` | Response field to store. Defaults to `save` |
| `Field` | `name` | `string` | Required. JSON key sent to Core |
| `Field` | `label` | `string` | Required |
| `Field` | `value` | `string` | Optional. `{{ledger_id}}` reads a saved id |
| `Field` | `type` | `"string"` \| `"number"` \| `"boolean"` | Defaults to `string` |
| `Saved` | `name` | `string` | Required. Prints a saved value after a run |
| `Result` | | | Shown after that action has run |

`{{base}}` and `{{api_key}}` in a code sample come from Connect your sandbox. The visible sample masks the key. Copy includes it.

## Adding a component

1. Add the Astro file under `src/ui/mdx/`.
2. Export it from `src/ui/mdx/components.ts`.
3. Add the tag, its props, and a sample to this file.
4. Put component styles in `src/styles/mdx.css`.

Content pages can use the tag on the next render. A snippet still imports the component file directly.
