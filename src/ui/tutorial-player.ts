const CORE_KEY = 'blnk.core';
const WEEK = 7 * 24 * 60 * 60 * 1000;

type CoreRecord = {
	baseUrl: string;
	apiKey: string;
	savedAt: number;
	expiresAt: number;
};

type Progress = {
	completed: string[];
	fields: Record<string, Record<string, string>>;
	saved: Record<string, string>;
};

type Session = {
	root: HTMLElement;
	progress: Progress;
};

const sessions = new Map<HTMLElement, Session>();
let listening = false;

function progressKey(id: string): string {
	return `blnk.tutorial.${id}`;
}

function readCore(): CoreRecord | null {
	try {
		const raw = localStorage.getItem(CORE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<CoreRecord>;
		if (typeof parsed.baseUrl !== 'string' || typeof parsed.apiKey !== 'string') return null;
		if (typeof parsed.expiresAt !== 'number' || typeof parsed.savedAt !== 'number') return null;
		return parsed as CoreRecord;
	} catch {
		return null;
	}
}

function coreValid(record: CoreRecord | null): record is CoreRecord {
	return !!record && record.expiresAt > Date.now() && record.apiKey.trim() !== '';
}

function readProgress(id: string): Progress {
	const empty: Progress = { completed: [], fields: {}, saved: {} };
	try {
		const raw = localStorage.getItem(progressKey(id));
		if (!raw) return empty;
		const parsed = JSON.parse(raw) as Partial<Progress>;
		return {
			completed: Array.isArray(parsed.completed) ? parsed.completed.filter((item) => typeof item === 'string') : [],
			fields: parsed.fields && typeof parsed.fields === 'object' ? parsed.fields : {},
			saved: parsed.saved && typeof parsed.saved === 'object' ? parsed.saved : {},
		};
	} catch {
		return empty;
	}
}

function writeProgress(id: string, progress: Progress) {
	localStorage.setItem(progressKey(id), JSON.stringify(progress));
}

function forms(root: HTMLElement): HTMLFormElement[] {
	return [...root.querySelectorAll<HTMLFormElement>('form[data-action]')];
}

function scopeOf(form: HTMLFormElement): HTMLElement {
	const step = form.closest('.step');
	return step instanceof HTMLElement ? step : form;
}

function coreMessage(body: unknown, status: number): string {
	if (body && typeof body === 'object') {
		const record = body as Record<string, unknown>;
		const detail = record.error_detail;
		if (detail && typeof detail === 'object' && typeof (detail as { message?: unknown }).message === 'string') {
			return (detail as { message: string }).message;
		}
		if (typeof record.error === 'string') return record.error;
		if (typeof record.errors === 'string') return record.errors;
		if (typeof record.message === 'string') return record.message;
	}
	if (typeof body === 'string' && body.trim()) return body.trim().slice(0, 500);
	return `Core returned ${status}.`;
}

function stepTitleForSave(root: HTMLElement, name: string): string | undefined {
	const host = root.querySelector(`[data-save="${CSS.escape(name)}"]`);
	const step = host?.closest('.step');
	const title = step?.querySelector('.step-title');
	return title?.textContent?.trim() || undefined;
}

function fieldValue(input: HTMLInputElement): string {
	if (input.type === 'checkbox') return input.checked ? 'true' : 'false';
	return input.value;
}

function valueFor(name: string, revealKey: boolean, step: HTMLElement, progress: Progress): string {
	if (name === 'api_key') {
		const record = readCore();
		if (!coreValid(record)) return '{{api_key}}';
		return revealKey ? record.apiKey : '••••••••';
	}
	if (name === 'base') return readCore()?.baseUrl || '{{base}}';
	if (progress.saved[name]) return progress.saved[name];
	const input = step.querySelector<HTMLInputElement>(`input[name="${CSS.escape(name)}"]`);
	if (input && fieldValue(input).trim()) return fieldValue(input);
	return `{{${name}}}`;
}

function applyFills(scope: HTMLElement, revealKey: boolean, progress: Progress) {
	const step = scope.closest('.step');
	const host = step instanceof HTMLElement ? step : scope;
	scope.querySelectorAll<HTMLElement>('[data-fill]').forEach((node) => {
		const name = node.dataset.fill;
		if (!name) return;
		node.textContent = valueFor(name, revealKey, host, progress);
	});
}

function showError(scope: HTMLElement, message: string) {
	const error = scope.querySelector<HTMLElement>('[data-tutorial-error]');
	if (!error) return;
	error.hidden = false;
	error.textContent = message;
}

function hideError(scope: HTMLElement) {
	const error = scope.querySelector<HTMLElement>('[data-tutorial-error]');
	if (!error) return;
	error.hidden = true;
	error.textContent = '';
}

function updateHint(root: HTMLElement, input: HTMLInputElement) {
	const hint = input.parentElement?.querySelector<HTMLElement>('.tutorial-hint');
	if (!hint) return;
	const from = input.dataset.from;
	if (!from || input.value.trim()) {
		hint.hidden = true;
		hint.textContent = '';
		return;
	}
	const title = stepTitleForSave(root, from);
	hint.hidden = false;
	hint.textContent = title ? `Filled when you run ${title}.` : 'Filled from an earlier step.';
}

function fillForm(root: HTMLElement, form: HTMLFormElement, progress: Progress) {
	const id = form.dataset.action ?? '';
	const scope = scopeOf(form);
	const record = readCore();
	if (id === 'connect') {
		const base = form.querySelector<HTMLInputElement>('input[name="baseUrl"]');
		const key = form.querySelector<HTMLInputElement>('input[name="apiKey"]');
		if (base && document.activeElement !== base) base.value = record?.baseUrl ?? '';
		if (key && document.activeElement !== key && coreValid(record)) key.value = record.apiKey;
		const clear = form.querySelector<HTMLButtonElement>('[data-clear]');
		if (clear) clear.hidden = !record?.baseUrl;
	}
	scope.querySelectorAll<HTMLInputElement>('input[name]').forEach((input) => {
		if (id === 'connect' || document.activeElement === input) return;
		if (input.type === 'checkbox') {
			const stored = progress.fields[id]?.[input.name];
			const value = stored === 'true' || stored === 'false' ? stored : input.dataset.default;
			input.checked = value === 'true';
			return;
		}
		const stored = progress.fields[id]?.[input.name];
		if (input.dataset.from) input.value = progress.saved[input.dataset.from] || '';
		else input.value = stored != null ? stored : (input.dataset.default ?? '');
		updateHint(root, input);
	});
	applyFills(scope, false, progress);
	const done = progress.completed.includes(id) && (id !== 'connect' || coreValid(record));
	scope.querySelectorAll<HTMLElement>('.tutorial-result').forEach((result) => {
		result.hidden = !done;
	});
	const expiry = scope.querySelector<HTMLElement>('[data-expiry]');
	if (expiry && coreValid(record)) {
		const date = new Date(record.expiresAt).toLocaleDateString(undefined, { dateStyle: 'medium' });
		expiry.textContent = `Saved in this browser until ${date}.`;
	}
	const button = form.querySelector<HTMLButtonElement>('[data-run]');
	if (button && !button.disabled) button.textContent = done ? 'Run again' : 'Run on your sandbox';
}

function fillRoot(root: HTMLElement, progress: Progress) {
	forms(root).forEach((form) => fillForm(root, form, progress));
}

async function postTutorial(body: Record<string, unknown>): Promise<{ status: number; body: unknown }> {
	let response: Response;
	try {
		response = await fetch('/api/tutorial', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
		});
	} catch {
		throw new Error('Could not reach the docs server.');
	}
	let payload: { status?: number; body?: unknown; error?: string };
	try {
		payload = (await response.json()) as { status?: number; body?: unknown; error?: string };
	} catch {
		throw new Error('Could not read the response.');
	}
	if (!response.ok) throw new Error(payload.error || 'Could not reach that sandbox.');
	if (typeof payload.status !== 'number') throw new Error('Could not read the response.');
	if (payload.status < 200 || payload.status >= 300) throw new Error(coreMessage(payload.body, payload.status));
	return { status: payload.status, body: payload.body };
}

function bind(root: HTMLElement) {
	const tutorial = root.dataset.tutorial ?? '';
	const progress = readProgress(tutorial);
	const record = readCore();
	if (record && record.expiresAt <= Date.now()) {
		localStorage.setItem(CORE_KEY, JSON.stringify({ ...record, apiKey: '', expiresAt: 0 }));
		progress.completed = progress.completed.filter((id) => id !== 'connect');
	}
	sessions.set(root, { root, progress });

	root.addEventListener('input', (event) => {
		const input = event.target;
		if (!(input instanceof HTMLInputElement) || !input.name) return;
		const form = input.closest<HTMLFormElement>('form[data-action]');
		const scope = form ? scopeOf(form) : null;
		if (!form?.dataset.action || !scope) return;
		if (form.dataset.action === 'connect') {
			root.querySelectorAll<HTMLElement>('.step').forEach((step) => applyFills(step, false, progress));
			return;
		}
		const fields = progress.fields[form.dataset.action] ?? {};
		fields[input.name] = fieldValue(input);
		progress.fields[form.dataset.action] = fields;
		writeProgress(tutorial, progress);
		updateHint(root, input);
		applyFills(scope, false, progress);
	});

	root.addEventListener('click', (event) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const view = target.closest<HTMLButtonElement>('[data-tutorial-view]');
		if (view) {
			const action = view.closest<HTMLElement>('.tutorial-action');
			if (!action || !view.dataset.tutorialView) return;
			action.dataset.view = view.dataset.tutorialView;
			action.querySelectorAll<HTMLButtonElement>('[data-tutorial-view]').forEach((button) => {
				button.setAttribute('aria-selected', button === view ? 'true' : 'false');
			});
			return;
		}
		if (!target.closest('[data-clear]')) return;
		localStorage.removeItem(CORE_KEY);
		progress.saved = {};
		progress.completed = [];
		progress.fields = {};
		writeProgress(tutorial, progress);
		fillRoot(root, progress);
	});

	root.addEventListener('submit', (event) => {
		const form = event.target;
		if (!(form instanceof HTMLFormElement) || !form.dataset.action) return;
		event.preventDefault();
		void run(form);
	});

	async function run(form: HTMLFormElement) {
		const id = form.dataset.action ?? '';
		const scope = scopeOf(form);
		const button = form.querySelector<HTMLButtonElement>('[data-run]');
		hideError(scope);
		if (id !== 'connect') {
			const saved = readCore();
			if (!coreValid(saved)) {
				showError(scope, 'Connect your sandbox on the first step. Open Connect your sandbox and save a public URL and key.');
				return;
			}
			for (const input of form.querySelectorAll<HTMLInputElement>('input[name]')) {
				if (input.type === 'checkbox') continue;
				if (input.value.trim()) {
					if (input.type === 'number' && !/^\d+$/.test(input.value.trim())) {
						showError(scope, 'Enter a whole number.');
						return;
					}
					continue;
				}
				if (input.dataset.from) {
					const title = stepTitleForSave(root, input.dataset.from);
					showError(scope, title ? `Filled when you run ${title}.` : 'Run the earlier step first.');
				} else {
					const label = input.closest('label')?.querySelector('span')?.textContent?.trim() || 'This field';
					showError(scope, `Enter ${label.charAt(0).toLowerCase()}${label.slice(1)}.`);
				}
				return;
			}
		} else {
			const base = form.querySelector<HTMLInputElement>('input[name="baseUrl"]');
			const key = form.querySelector<HTMLInputElement>('input[name="apiKey"]');
			let origin = base?.value.trim() ?? '';
			try {
				const url = new URL(origin);
				if (url.protocol !== 'https:') throw new Error('Use a public https URL for a sandbox.');
				if (url.pathname !== '/' && url.pathname !== '') throw new Error('Use the sandbox origin, without a path.');
				origin = url.origin;
			} catch (error) {
				showError(scope, error instanceof TypeError ? 'Use a public https URL for a sandbox.' : error instanceof Error ? error.message : 'Use a public https URL for a sandbox.');
				return;
			}
			if (!key?.value.trim()) {
				showError(scope, 'Enter the API key.');
				return;
			}
			if (base) base.value = origin;
		}

		const previous = readCore();
		if (button) {
			button.disabled = true;
			button.textContent = 'Running…';
		}
		try {
			if (id === 'connect') {
				const baseUrl = form.querySelector<HTMLInputElement>('input[name="baseUrl"]')?.value.trim() ?? '';
				const apiKey = form.querySelector<HTMLInputElement>('input[name="apiKey"]')?.value.trim() ?? '';
				await postTutorial({ baseUrl, apiKey, tutorial, step: 'connect' });
				const now = Date.now();
				localStorage.setItem(CORE_KEY, JSON.stringify({ baseUrl, apiKey, savedAt: now, expiresAt: now + WEEK }));
				if (previous && previous.baseUrl !== baseUrl) {
					progress.saved = {};
					progress.completed = [];
					progress.fields = {};
				}
				if (!progress.completed.includes('connect')) progress.completed.push('connect');
			} else {
				const saved = readCore();
				if (!coreValid(saved)) return;
				const fields: Record<string, string> = {};
				form.querySelectorAll<HTMLInputElement>('input[name]').forEach((input) => {
					fields[input.name] = fieldValue(input).trim();
				});
				const result = await postTutorial({
					baseUrl: saved.baseUrl,
					apiKey: saved.apiKey,
					tutorial,
					step: id,
					fields,
				});
				const save = form.dataset.save;
				const responseKey = form.dataset.response || save;
				if (save && responseKey) {
					const value = result.body && typeof result.body === 'object' ? (result.body as Record<string, unknown>)[responseKey] : undefined;
					if (typeof value !== 'string' || !value) throw new Error(`Core did not return ${responseKey}.`);
					progress.saved[save] = value;
				}
				if (!progress.completed.includes(id)) progress.completed.push(id);
			}
			writeProgress(tutorial, progress);
		} catch (error) {
			showError(scope, error instanceof Error ? error.message : 'Could not reach that sandbox.');
		} finally {
			if (button) button.disabled = false;
			fillRoot(root, progress);
		}
	}

	fillRoot(root, progress);
}

function armCopy() {
	document.addEventListener(
		'click',
		(event) => {
			const button = event.target instanceof Element ? event.target.closest('.tutorial .code-copy') : null;
			const pre = button?.closest('pre');
			const step = pre?.closest<HTMLElement>('.step');
			const session = step ? [...sessions.values()].find((item) => item.root.contains(step)) : undefined;
			if (pre instanceof HTMLElement && session) applyFills(pre, true, session.progress);
		},
		true,
	);
	document.addEventListener('click', (event) => {
		const button = event.target instanceof Element ? event.target.closest('.tutorial .code-copy') : null;
		const pre = button?.closest('pre');
		const step = pre?.closest<HTMLElement>('.step');
		const session = step ? [...sessions.values()].find((item) => item.root.contains(step)) : undefined;
		if (pre instanceof HTMLElement && session) applyFills(pre, false, session.progress);
	});
}

export function bootTutorial() {
	if (!listening) {
		listening = true;
		armCopy();
	}
	document.querySelectorAll<HTMLElement>('.tutorial').forEach((root) => {
		if (root.dataset.ready === 'true') return;
		root.dataset.ready = 'true';
		bind(root);
	});
}
