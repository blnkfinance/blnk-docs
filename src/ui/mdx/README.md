# MDX components

The tags a page can use, such as `Note`, `Steps`, and `ParamField`. `components.ts` registers them, and a page in `src/content` can use a tag without importing it.

Shared blocks from `src/content/snippets` are registered beside these. Drop `.mdx`, capitalize the first letter of each word, and join the words. `api-key.mdx` is `<ApiKey />`.

Props and examples are in [COMPONENTS.md](../../../COMPONENTS.md). Styles are in `src/styles/mdx.css`.
