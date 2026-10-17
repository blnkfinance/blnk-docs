# Snippets

Shared copy used on more than one page, such as the authorization header. A file here is a tag. Put the file in this folder, not in a subfolder.

The file name is lowercase words separated by hyphens. Drop `.mdx`, capitalize the first letter of each word, and join the words.

| File | Tag |
| --- | --- |
| `api-key.mdx` | `<ApiKey />` |
| `docker-image.mdx` | `<DockerImage />` |
| `key.mdx` | `<Key />` |

These files are compiled on their own, so a snippet imports any component it uses.
