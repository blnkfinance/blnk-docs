function groupKey(field: HTMLElement) {
	return `${field.dataset.kind ?? ''}:${field.dataset.location ?? ''}`;
}

function isSkippable(node: ChildNode) {
	if (node instanceof Element) return node.tagName === 'SCRIPT' || node.tagName === 'STYLE';
	return node.nodeType === Node.TEXT_NODE && !(node.textContent ?? '').trim();
}

function groupFields() {
	const parents = new Set<Element>();
	document.querySelectorAll('.field').forEach((field) => {
		const parent = field.parentElement;
		if (parent && !parent.classList.contains('field-group')) parents.add(parent);
	});

	parents.forEach((parent) => {
		const kids = [...parent.childNodes];
		let run: HTMLElement[] = [];
		let key = '';

		const flush = () => {
			if (run.length === 0) return;
			const group = document.createElement('div');
			group.className = 'field-group';
			run[0].before(group);
			run.forEach((field) => group.append(field));
			run = [];
			key = '';
		};

		for (const node of kids) {
			if (node instanceof HTMLElement && node.classList.contains('field')) {
				const nextKey = groupKey(node);
				if (run.length > 0 && nextKey !== key) flush();
				key = nextKey;
				run.push(node);
				continue;
			}
			if (isSkippable(node)) continue;
			flush();
		}
		flush();
	});
}

function bindFields() {
	document.querySelectorAll('.field').forEach((details) => {
		if (!(details instanceof HTMLDetailsElement) || details.dataset.bound) return;
		details.dataset.bound = 'true';
		const summary = details.querySelector('summary');
		const panel = details.querySelector('.field-panel');
		if (!summary || !(panel instanceof HTMLElement)) return;

		let animation: Animation | undefined;
		summary.addEventListener('click', (event) => {
			event.preventDefault();
			animation?.cancel();
			const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
			const opening = !details.open;
			if (reduce) {
				details.open = opening;
				return;
			}
			const ease = 'cubic-bezier(0.23, 1, 0.32, 1)';
			if (opening) {
				details.open = true;
				const height = panel.scrollHeight;
				animation = panel.animate([{ height: '0px' }, { height: `${height}px` }], {
					duration: 220,
					easing: ease,
				});
				animation.onfinish = () => animation?.cancel();
				return;
			}
			const height = panel.getBoundingClientRect().height;
			animation = panel.animate([{ height: `${height}px` }, { height: '0px' }], {
				duration: 180,
				easing: ease,
				fill: 'forwards',
			});
			animation.onfinish = () => {
				details.open = false;
				animation?.cancel();
			};
		});
	});
}

function enhanceFields() {
	groupFields();
	bindFields();
}

enhanceFields();
document.addEventListener('astro:page-load', enhanceFields);
