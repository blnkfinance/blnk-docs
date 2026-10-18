import blnk from '../../skills/blnk/SKILL.md?raw';
import design from '../../skills/blnk-design/SKILL.md?raw';
import mapJson from '../../skills/blnk-design/references/map-json.md?raw';
import shorten from '../../skills/blnk-design/scripts/shorten-map-url.mjs?raw';
import shortenPackage from '../../skills/blnk-design/scripts/package.json?raw';
import implement from '../../skills/blnk-implement/SKILL.md?raw';
import decide from '../../skills/blnk-implement/references/decide.md?raw';
import version from '../../skills/blnk-implement/references/version.md?raw';

type SkillFile = { path: string; body: string };

const groups: { dir: string; files: SkillFile[] }[] = [
	{ dir: 'blnk', files: [{ path: 'SKILL.md', body: blnk }] },
	{
		dir: 'blnk-design',
		files: [
			{ path: 'SKILL.md', body: design },
			{ path: 'references/map-json.md', body: mapJson },
			{ path: 'scripts/shorten-map-url.mjs', body: shorten },
			{ path: 'scripts/package.json', body: shortenPackage },
		],
	},
	{
		dir: 'blnk-implement',
		files: [
			{ path: 'SKILL.md', body: implement },
			{ path: 'references/decide.md', body: decide },
			{ path: 'references/version.md', body: version },
		],
	},
];

function frontmatter(markdown: string): { name: string; description: string } {
	const block = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	const name = block?.[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
	const description = block?.[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
	if (!name || !description) throw new Error('A skill needs name and description in its frontmatter.');
	return { name, description: description.slice(0, 1024) };
}

export function skillIndex(): { skills: { name: string; description: string; files: string[] }[] } {
	return {
		skills: groups.map((group) => {
			const skill = group.files.find((file) => file.path === 'SKILL.md');
			if (!skill) throw new Error(`${group.dir} is missing SKILL.md`);
			const meta = frontmatter(skill.body);
			if (meta.name !== group.dir) throw new Error(`${group.dir} frontmatter name is ${meta.name}`);
			return { name: meta.name, description: meta.description, files: group.files.map((file) => file.path) };
		}),
	};
}

export function skillFile(name: string, path: string): { body: string; type: string } | undefined {
	const group = groups.find((item) => item.dir === name);
	const file = group?.files.find((item) => item.path === path);
	if (!file) return undefined;
	if (path.endsWith('.json')) return { body: file.body, type: 'application/json; charset=utf-8' };
	if (path.endsWith('.mjs')) return { body: file.body, type: 'text/javascript; charset=utf-8' };
	return { body: file.body, type: 'text/markdown; charset=utf-8' };
}
