export {};

declare global {
	interface Window {
		__blnkImageLightbox?: boolean;
	}
}

if (!window.__blnkImageLightbox) {
	window.__blnkImageLightbox = true;

	const imageSelector = 'article img:not(.icon img):not(a img)';
	let trigger: HTMLImageElement | null = null;

	function enhanceImages() {
		document.querySelectorAll<HTMLImageElement>(imageSelector).forEach((image) => {
			image.tabIndex = 0;
			image.setAttribute('role', 'button');
			image.setAttribute('aria-haspopup', 'dialog');
			image.setAttribute('aria-label', image.alt ? `Enlarge image: ${image.alt}` : 'Enlarge image');
		});
	}

	function openPreview(image: HTMLImageElement) {
		const dialog = document.querySelector<HTMLDialogElement>('.image-lightbox');
		const previewPicture = dialog?.querySelector<HTMLPictureElement>('.image-lightbox-picture');
		const caption = dialog?.querySelector<HTMLElement>('.image-lightbox-caption');
		if (!dialog || !previewPicture || !caption) return;

		trigger = image;
		const sourcePicture = image.closest('picture');
		const children = sourcePicture ? Array.from(sourcePicture.children) : [image];
		const previewChildren = children.map((child) => {
			const clone = child.cloneNode(true) as HTMLElement;
			if (clone instanceof HTMLSourceElement && clone.hasAttribute('srcset')) clone.sizes = '96vw';
			if (clone instanceof HTMLImageElement) {
				clone.alt = image.alt;
				clone.removeAttribute('tabindex');
				clone.removeAttribute('role');
				clone.removeAttribute('aria-haspopup');
				clone.removeAttribute('aria-label');
				if (clone.hasAttribute('srcset')) clone.sizes = '96vw';
			}
			return clone;
		});
		previewPicture.replaceChildren(...previewChildren);
		caption.textContent = image.alt;
		caption.hidden = !image.alt;
		if (!dialog.dataset.restoreFocusBound) {
			dialog.dataset.restoreFocusBound = 'true';
			dialog.addEventListener('close', () => {
				trigger?.focus();
				trigger = null;
			});
		}
		if (!dialog.open) dialog.showModal();
	}

	document.addEventListener('astro:page-load', enhanceImages);
	document.addEventListener('click', (event) => {
		const target = event.target;
		if (target instanceof Element && target.closest('.image-lightbox-close')) {
			document.querySelector<HTMLDialogElement>('.image-lightbox')?.close();
			return;
		}
		if (!(target instanceof HTMLImageElement) || !target.matches(imageSelector)) return;
		event.preventDefault();
		openPreview(target);
	});
	document.addEventListener('keydown', (event) => {
		const target = event.target;
		if (!(target instanceof HTMLImageElement) || !target.matches(imageSelector)) return;
		if (event.key !== 'Enter' && event.key !== ' ') return;
		event.preventDefault();
		openPreview(target);
	});
	document.addEventListener('click', (event) => {
		const dialog = document.querySelector<HTMLDialogElement>('.image-lightbox');
		if (dialog && event.target === dialog) dialog.close();
	});
	enhanceImages();
}
