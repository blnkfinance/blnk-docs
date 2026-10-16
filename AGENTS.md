# Agents

Read [README.md](README.md) for the layout and for how to edit a page. Read [COMPONENTS.md](COMPONENTS.md) before using or adding an MDX tag. Follow those files. Do not invent a second structure beside them.

## Server

Do not start the dev server. That includes `astro dev`, `pnpm dev`, `npm run dev`, and `astro dev --background`.

If a server is already running, leave it. Do not start a second one, and do not stop or restart it.

If the work needs a server and none is running, ask the user to start it. Wait for them to say it is up.

## Before you write about Blnk

Check the current product before you write an endpoint, a field, or an SDK method. Use the Blnk docs MCP (`search_blnk_finance`, `query_docs_filesystem_blnk_finance`) and the Blnk skills: `blnk-lookup` for product facts, `blnk-design` for a money movement map, `blnk-implement` for an integration, `blnk-fintech` for a flow review.

Query collections with the Filter API. Use Typesense for full-text search. A money movement map is a shortened `map.blnkfinance.com` URL inside `<Map>`.

## Pages

Keep the original path. A tag that is not in `src/ui/mdx/components.ts` is a stop: ask, and do not add a component to get past it.

Copy, samples, images, and spacing already decided for this site are in `.cursor/skills/migrate-docs/SKILL.md` under **Decisions already on the site**. Follow that section on any page edit, including ones that are not a migration.

## Skills

**migrate-docs.** The user asked to migrate a chunk, a group, or a section, or said `next`. Read the skill, `status.md`, and `sections.md`. Post the plan and wait. Write nothing until they accept. One group, then stop.

**expert.** The user tagged the prompt with `expert`. It does not run on its own.
