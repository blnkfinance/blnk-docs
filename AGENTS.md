# Agents

Read [README.md](README.md) for the layout and for how to edit a page. Read [COMPONENTS.md](COMPONENTS.md) before using or adding an MDX tag. Follow those files. Do not invent a second structure beside them.

## Server

Do not start the dev server. That includes `astro dev`, `pnpm dev`, `npm run dev`, and `astro dev --background`.

If a server is already running, leave it. Do not start a second one, and do not stop or restart it.

If the work needs a server and none is running, ask the user to start it. Wait for them to say it is up.

## Before you write about Blnk

Check the current product before you write an endpoint, a field, or an SDK method. Use the Blnk docs MCP (`blnk-docs`: `orient`, then `search`, `list_pages`, or `get_operation`, then `read_page`) and the Blnk skills: `blnk-lookup` for product facts, `blnk-design` for a money movement map, `blnk-implement` for an integration, `blnk-fintech` for a flow review.

Query collections with the Filter API. Use Typesense for full-text search. A money movement map is a shortened `map.blnkfinance.com` URL inside `<Map>`.

## Pages

When you write or edit a page, read and follow `.cursor/skills/docs-writer/SKILL.md`. That includes a new page, a rewrite, and a small copy edit.

Keep the original path. A tag that is not in `src/ui/mdx/components.ts` and not a file in `src/content/snippets` is a stop: ask, and do not add a component to get past it.

## Skills

**docs-writer.** Any write or edit of a page in `src/content`. Read the skill before changing copy, layout, samples, or frontmatter. Follow it.

**migrate-docs.** The user asked to migrate a chunk, a group, or a section, or said `next`. Read the skill, `status.md`, and `sections.md`. Post the plan and wait. Write nothing until they accept. One group, then stop. The page you write still follows docs-writer.

**expert.** The user tagged the prompt with `expert`. It does not run on its own.

**publish.** The user said `publish`. Commit this chat's work, push `main`, then confirm the Brimble deploy. Follow `.cursor/rules/publish.mdc`.
