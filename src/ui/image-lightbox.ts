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
		const preview = dialog?.querySelector<HTMLImageElement>('img');
		const caption = dialog?.querySelector<HTMLElement>('.image-lightbox-caption');
		if (!dialog || !preview || !caption) return;

		trigger = image;
		preview.src = image.currentSrc || image.src;
		preview.alt = image.alt;
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
		if (event.target === dialog) dialog.close();
	});
	enhanceImages();
}
