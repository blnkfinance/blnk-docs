/**
 * Size a MingCute icon without touching its 24×24 viewBox.
 * Line artwork is optically centered on that grid. A cropped viewBox
 * or a non-square box shifts one icon against the others.
 */
export function prepareSvg(source: string, size: number, attrs: Record<string, string> = {}): string {
	const extra = Object.entries(attrs)
		.map(([key, value]) => ` ${key}="${value.replaceAll('"', '&quot;')}"`)
		.join('');
	return source.replace(/<!--[\s\S]*?-->/g, '').replace(/<svg\b([^>]*)>/, (_match, rest: string) => {
		const cleaned = rest.replace(/\s(?:width|height|aria-hidden|focusable)="[^"]*"/g, '');
		return `<svg${cleaned} width="${size}" height="${size}" aria-hidden="true" focusable="false"${extra}>`;
	});
}
