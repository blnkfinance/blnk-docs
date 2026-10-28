export {};

declare global {
	interface Window {
		__blnkImageLightbox?: boolean;
	}
}

if (!window.__blnkImageLightbox) {
	window.__blnkImageLightbox = true;

	const imageSelector = 'article img:not(.icon img):not(a img):not(button img)';
	const triggers = new WeakMap<HTMLDialogElement, HTMLImageElement>();
	const boundDialogs = new WeakSet<HTMLDialogElement>();

	function isPreviewable(image: HTMLImageElement) {
		return image.matches(imageSelector)
			&& image.alt.trim().length > 0
			&& !image.matches('[role="none"], [role="presentation"]')
			&& !image.closest('[aria-hidden="true"], [inert]');
	}

	function enhanceImages() {
		document.querySelectorAll<HTMLImageElement>(imageSelector).forEach((image) => {
			if (!isPreviewable(image)) return;
			image.dataset.imageLightbox = 'true';
			image.tabIndex = 0;
			image.setAttribute('role', 'button');
			image.setAttribute('aria-haspopup', 'dialog');
			image.setAttribute('aria-label', `Enlarge image: ${image.alt.trim()}`);
		});
	}

	function openPreview(image: HTMLImageElement) {
		const dialog = document.querySelector<HTMLDialogElement>('.image-lightbox');
		const previewPicture = dialog?.querySelector<HTMLPictureElement>('.image-lightbox-picture');
		const caption = dialog?.querySelector<HTMLElement>('.image-lightbox-caption');
		if (!dialog || !previewPicture || !caption) return;

		triggers.set(dialog, image);
		const sourcePicture = image.closest('picture');
		const children = sourcePicture ? Array.from(sourcePicture.children) : [image];
		const previewChildren = children.map((child) => {
			const clone = child.cloneNode(true) as HTMLElement;
			clone.removeAttribute('id');
			if (clone instanceof HTMLSourceElement && clone.hasAttribute('srcset')) clone.sizes = '96vw';
			if (clone instanceof HTMLImageElement) {
				clone.alt = image.alt;
				clone.removeAttribute('tabindex');
				clone.removeAttribute('role');
				clone.removeAttribute('aria-haspopup');
				clone.removeAttribute('aria-label');
				clone.removeAttribute('data-image-lightbox');
				clone.loading = 'eager';
				if (clone.hasAttribute('srcset')) clone.sizes = '96vw';
			}
			return clone;
		});
		previewPicture.replaceChildren(...previewChildren);
		caption.textContent = image.alt;
		caption.hidden = !image.alt;
		if (!boundDialogs.has(dialog)) {
			boundDialogs.add(dialog);
			dialog.addEventListener('close', () => {
				if (dialog.open) return;
				const trigger = triggers.get(dialog);
				triggers.delete(dialog);
				if (trigger?.isConnected) trigger.focus();
			});
		}
		if (!dialog.open) dialog.showModal();
	}

	document.addEventListener('astro:page-load', enhanceImages);
	document.addEventListener('astro:before-swap', () => {
		const dialog = document.querySelector<HTMLDialogElement>('.image-lightbox[open]');
		if (!dialog) return;
		triggers.delete(dialog);
		dialog.close();
	});
	document.addEventListener('click', (event) => {
		const target = event.target;
		if (target instanceof Element && target.closest('.image-lightbox-close')) {
			document.querySelector<HTMLDialogElement>('.image-lightbox')?.close();
			return;
		}
		if (!(target instanceof HTMLImageElement) || !isPreviewable(target)) return;
		event.preventDefault();
		openPreview(target);
	});
	document.addEventListener('keydown', (event) => {
		const target = event.target;
		if (!(target instanceof HTMLImageElement) || !isPreviewable(target)) return;
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
