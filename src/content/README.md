# Content

Each `.mdx` file is a page. The URL is the path. `install.mdx` is `/install`. `ledgers/introduction.mdx` is `/ledgers/introduction`. `index.mdx` is `/`.

A folder such as `ledgers` or `reference` is one section of the docs.

`docs.json` is the header tabs, the sidebar, and the enterprise label. When you add a page, add its path there too, without `.mdx`. A page with `enterprise: license` shows `labels.license` in a bar under the header.

[snippets](snippets/README.md) are shared blocks used on more than one page. [img](img/README.md) holds the screenshots. Neither is a page of its own.

The tags you can use in a page are listed in [COMPONENTS.md](../../COMPONENTS.md).
