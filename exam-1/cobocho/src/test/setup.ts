import '@testing-library/jest-dom/vitest';

let intersectionCallback: IntersectionObserverCallback | null = null;
let observerInstance: MockIntersectionObserver | null = null;

class MockIntersectionObserver implements IntersectionObserver {
	readonly root = null;
	readonly rootMargin = '';
	readonly thresholds: readonly number[] = [];

	constructor(
		callback: IntersectionObserverCallback,
		_options?: IntersectionObserverInit,
	) {
		intersectionCallback = callback;
		observerInstance = this;
	}

	observe() {}
	unobserve() {}
	disconnect() {
		intersectionCallback = null;
		observerInstance = null;
	}
	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
}

globalThis.IntersectionObserver = MockIntersectionObserver;

export function simulateIntersection(isIntersecting: boolean) {
	if (intersectionCallback && observerInstance) {
		intersectionCallback(
			[{ isIntersecting } as IntersectionObserverEntry],
			observerInstance,
		);
	}
}
