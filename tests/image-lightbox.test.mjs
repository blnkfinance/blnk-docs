import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const source = await readFile(new URL('../src/ui/image-lightbox.ts', import.meta.url), 'utf8');
const script = ts.transpileModule(source, {
	compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const layout = await readFile(new URL('../src/ui/DocsLayout.astro', import.meta.url), 'utf8');
const dialogMarkup = layout.match(/<dialog class="image-lightbox"[\s\S]*?<\/dialog>/)?.[0];
assert.ok(dialogMarkup, 'Use the dialog markup shipped in DocsLayout');

function setup(t, images = '<img id="image" src="large.png" alt="Fund lineage">') {
	const dom = new JSDOM(`<article class="article">${images}</article>${dialogMarkup}`, {
		url: 'https://docs.example.test/transactions/lineage',
		runScripts: 'outside-only',
	});
	t.after(() => dom.window.close());
	const { window } = dom;
	const { document } = window;
	// jsdom has no native dialog API. Model open/close and the asynchronous close
	// event here; native modal focus trapping and Escape are checked in a browser.
	window.HTMLDialogElement.prototype.showModal = function () {
		this.open = true;
		this.querySelector('button')?.focus();
	};
	window.HTMLDialogElement.prototype.close = function () {
		if (!this.open) return;
		this.open = false;
		window.setTimeout(() => this.dispatchEvent(new window.Event('close')), 0);
	};
	const boot = () => window.eval(`(() => { const exports = {}; ${script}\n})();`);
	boot();
	const click = (element) => element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
	const key = (element, value) => {
		const event = new window.KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true });
		element.dispatchEvent(event);
		return event;
	};
	const settle = () => new Promise((resolve) => window.setTimeout(resolve, 10));
	return { window, document, boot, click, key, settle,
		image: document.querySelector('article img'),
		dialog: document.querySelector('dialog'),
	};
}

test('decorative images stay out of the tab order and cannot open a preview', (t) => {
	const { document, dialog, click, key } = setup(t, `
		<img src="empty.png" alt=""><img src="missing.png"><img src="blank.png" alt="  \n ">
		<img src="hidden.png" alt="Hidden" aria-hidden="true">
		<img src="presentational.png" alt="Decoration" role="presentation">
		<span aria-hidden="true"><img src="hidden-parent.png" alt="Hidden parent"></span>
		<span inert><img src="inert.png" alt="Inert"></span>`);
	for (const image of document.querySelectorAll('article img')) {
		assert.equal(image.hasAttribute('tabindex'), false);
		assert.notEqual(image.getAttribute('role'), 'button');
		assert.equal(image.hasAttribute('aria-label'), false);
		assert.equal(image.hasAttribute('data-image-lightbox'), false);
		click(image);
		key(image, 'Enter');
		key(image, ' ');
		assert.equal(dialog.open, false);
	}
});

test('linked images, button images, icons, and images outside articles keep their behavior', (t) => {
	const { document, dialog, click } = setup(t, `
		<a href="original.png"><img alt="Linked" src="original.png"></a>
		<button><img alt="Button icon" src="icon.png"></button>
		<span class="icon"><img alt="Icon" src="icon.png"></span>`);
	const outside = document.createElement('img');
	outside.alt = 'Outside the article';
	document.body.append(outside);
	for (const image of document.querySelectorAll('img:not(dialog img)')) {
		assert.equal(image.hasAttribute('tabindex'), false);
		click(image);
		assert.equal(dialog.open, false);
	}
});

for (const activation of ['mouse', 'Enter', ' ']) {
	test(`${JSON.stringify(activation)} opens a named image with a caption`, (t) => {
		const { image, dialog, click, key, document } = setup(t);
		assert.equal(image.tabIndex, 0);
		assert.equal(image.getAttribute('role'), 'button');
		assert.equal(image.getAttribute('aria-label'), 'Enlarge image: Fund lineage');
		if (activation === 'mouse') click(image);
		else assert.equal(key(image, activation).defaultPrevented, true);
		assert.equal(dialog.open, true);
		assert.equal(dialog.querySelector('img').alt, 'Fund lineage');
		assert.equal(dialog.querySelector('.image-lightbox-caption').textContent, 'Fund lineage');
		assert.equal(document.activeElement, dialog.querySelector('button'));
	});
}

for (const closing of ['button', 'backdrop', 'dialog-close']) {
	test(`${closing} closes the preview and restores focus`, async (t) => {
		const { image, dialog, click, settle, document } = setup(t);
		image.focus();
		click(image);
		if (closing === 'button') click(dialog.querySelector('button'));
		else if (closing === 'backdrop') click(dialog);
		else dialog.close();
		await settle();
		assert.equal(dialog.open, false);
		assert.equal(document.activeElement, image);
	});
}

test('Escape is left to native dialog handling and clicks on preview content do not close it', (t) => {
	const { image, dialog, click, key } = setup(t);
	click(image);
	assert.equal(key(dialog.querySelector('button'), 'Escape').defaultPrevented, false);
	click(dialog.querySelector('img'));
	assert.equal(dialog.open, true);
});

test('picture sources and srcset survive, using the preview viewport instead of inline sizes', (t) => {
	const { image, dialog, click } = setup(t, `<picture>
		<source id="source" media="(min-width: 800px)" type="image/webp"
			srcset="small.webp 400w, full.webp 2000w" sizes="400px">
		<img id="image" alt="Responsive diagram" src="fallback.png"
			srcset="small.png 400w, full.png 2000w" sizes="400px" loading="lazy">
	</picture>`);
	click(image);
	const preview = dialog.querySelector('img');
	const previewSource = dialog.querySelector('source');
	assert.equal(preview.getAttribute('src'), 'fallback.png');
	assert.equal(preview.srcset, image.srcset);
	assert.equal(preview.sizes, '96vw');
	assert.equal(previewSource.srcset, 'small.webp 400w, full.webp 2000w');
	assert.equal(previewSource.media, '(min-width: 800px)');
	assert.equal(previewSource.type, 'image/webp');
	assert.equal(previewSource.sizes, '96vw');
	assert.equal(image.sizes, '400px');
	assert.equal(preview.loading, 'eager');
	for (const attribute of ['id', 'tabindex', 'role', 'aria-label', 'aria-haspopup', 'data-image-lightbox']) {
		assert.equal(preview.hasAttribute(attribute), false, attribute);
	}
	assert.equal(previewSource.hasAttribute('id'), false);
});

test('standalone srcset images retain all candidates', (t) => {
	const { image, dialog, click } = setup(t, '<img alt="Diagram" src="full.png" srcset="small.png 400w, full.png 2000w" sizes="400px">');
	click(image);
	assert.equal(dialog.querySelector('img').srcset, image.srcset);
	assert.equal(dialog.querySelector('img').sizes, '96vw');
});

test('Astro swaps dismiss the old dialog and enhance images on the new page', async (t) => {
	const { document, window, image, dialog, click, key, settle } = setup(t);
	click(image);
	document.dispatchEvent(new window.Event('astro:before-swap'));
	assert.equal(dialog.open, false);
	document.querySelector('article').innerHTML = '<img alt="Next page" src="next.png"><img alt="" src="decoration.png">';
	dialog.outerHTML = dialogMarkup;
	document.dispatchEvent(new window.Event('astro:page-load'));
	const nextImage = document.querySelector('article img');
	const nextDialog = document.querySelector('dialog');
	assert.equal(nextImage.tabIndex, 0);
	assert.equal(document.querySelector('article img[alt=""]').hasAttribute('tabindex'), false);
	key(nextImage, 'Enter');
	await settle();
	assert.equal(nextDialog.open, true);
	assert.equal(document.activeElement, nextDialog.querySelector('button'));
	click(nextDialog.querySelector('button'));
	await settle();
	assert.equal(document.activeElement, nextImage);
});

test('repeated initialization does not duplicate listeners or preview images', async (t) => {
	const { boot, image, dialog, click, settle, document } = setup(t);
	boot();
	click(image);
	assert.equal(dialog.querySelectorAll('img').length, 1);
	dialog.close();
	// A queued close event must not steal focus from a newly opened preview.
	click(image);
	await settle();
	assert.equal(dialog.open, true);
	assert.equal(document.activeElement, dialog.querySelector('button'));
});
