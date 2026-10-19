# Page patterns

Shapes for the page types on this site. Voice and rules are in [SKILL.md](SKILL.md).

## Guide

A concept or a task under Core, Cloud, Watch, or operating. The opening defines the thing, then says what the reader does.

```mdx
---
title: "Identities overview"
sidebarTitle: "Overview"
icon: "user-3"
description: "Create an identity for a customer and connect it to their balances."
---

An identity is a customer on your ledger, either an individual or an organization. Create one, then link it to a balance so the transactions on that balance belong to the same customer.

## Create an identity

Blnk stores two identity types, `individual` and `organization`. Fields that are specific to your application go in `meta_data`.

### Using the API

Call [Create identity](/reference/create-identity).

<Tabs>
  <Tab title="Create identity">
    <CodeGroup>
    ```bash cURL
    curl -X POST "http://localhost:5001/identities" \
      -H "X-blnk-key: <api-key>" \
      -H "Content-Type: application/json" \
      -d '{ "identity_type": "individual", "first_name": "Alice" }'
    ```
    </CodeGroup>

    | Field | Description | Required |
    | :--- | :--- | :--- |
    | `identity_type` | `individual` or `organization`. | Yes |
  </Tab>
  <Tab title="Response">
    ```json 201 Created
    { "identity_id": "idt_8cc22560-5ace-4989-8953-fcbad7947d48" }
    ```

    | Field | Description |
    | :--- | :--- |
    | `identity_id` | Id of the identity. |
  </Tab>
</Tabs>

### Using the Dashboard

<Steps titleSize="h3">
  <Step title="Open Identities">
    Select **Identities**, then **Create identity**.
  </Step>
</Steps>
```

Name a tab by the choice, such as `On your machine` or `Default queue`. A tab title is a table-of-contents child of the heading it follows. Do not add a heading only to list a tab.

## API reference

One operation. The title is the action: `Create ledger`. The right rail holds the samples. The article holds authorization, fields, and the response.

```mdx
---
title: "Create ledger"
description: "Create a ledger to group balances."
method: "POST"
path: "/ledgers"
---

<Key />

### Body

<ParamField body="name" type="string" required>
  Name of the ledger.
</ParamField>

### Response

<ResponseField name="ledger_id" type="string" required>
  Id of the created ledger.
</ResponseField>

<RequestExample>

```bash cURL
curl -X POST "http://localhost:5001/ledgers" \
  -H "X-blnk-key: <api-key>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "Customer wallets" }'
```

</RequestExample>

<ResponseExample>

```json 201 Created
{ "ledger_id": "ldg_049495fe-6f03-4e7b-b3b4-7b0466c127c7", "name": "Customer wallets" }
```

```json 409 Conflict
{ "error": "Ledger with this name or ID already exists" }
```

</ResponseExample>
```

A second response fence is a sibling inside the same `ResponseExample`. Its title is the status, or which case when the status is shared.

## Tutorial

`tutorial: true`. The opening says what the product concept is, then what this tutorial builds. Sections are `TutorialStep`s. A sample the reader fills in uses `TutorialCode` and `{{placeholders}}`. A money movement map sits in `TutorialFrame`.

The step title is the action: `Create a ledger`, `Record a deposit`. A design aside is a `Tip` inside the step, not a new page.

## SDK and CLI

The title names the language or the command, not a slogan. `TypeScript quick start`. `Install the Blnk CLI`.

`Steps` when the reader installs, writes a file, then runs it. The fence title is the file or the command: `index.js`, `Install the SDK`. A prerequisite that blocks the command is a `Note` inside that step.

Show the call the SDK actually makes. Do not invent a method. Match the current SDK page.

## Quick start

`/` is the Core quick start. Two sections, with no numbers: Install Blnk, then Record your first transaction. Nothing else.

Install Blnk has two tabs, `On your machine` and `Using Blnk Cloud`. On your machine is one step: clone the repo and `docker compose up` in one code block. The result is a paragraph: the reader finds the instance at `http://localhost:5001`.

Record your first transaction has two tabs, `Using API` and `Using the Dashboard`. Both are `Steps`. The API sample sends `skip_queue: true`, and the response status is `APPLIED`.

Other quick starts follow the guide shape. They do not copy the Core page's two-tab install.

## Changelog

`{Product} changelog`. `sidebarTitle` is `Changelog`. Each release is an `Update`. `label` is the version. `description` is the date, `Sep 24, 2026`.

The first heading inside the entry is the change a reader must know. Fixes are a numbered list. Each item names the behavior, then links to the guide or the migration. A breaking change is a `Warning` with what to change before upgrading.

## Migration

The opening says which release, what to review, and who can upgrade without code changes. `## At a glance` is a table: Change, Who is affected, What changed.

Each correction is an h2. Show the new error or field in a fenced sample. End the section with **What to do:** and the one change in the reader's code.

A version line in the guide is `Version`. The migration page itself does not repeat "available in version" for the release it is about.

## When to choose

A short page that routes the reader. The opening names the ways, in one or two sentences. A table maps the question to the page. Do not explain the other page in full. `RelatedTopics` lists those pages.
