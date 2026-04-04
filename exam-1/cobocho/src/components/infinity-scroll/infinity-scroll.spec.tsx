import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InfinityScroll from './infinity-scroll';

const mockIntersectionObserver = (isIntersecting: boolean) => {
	const observe = vi.fn();
	const disconnect = vi.fn();

	window.IntersectionObserver = class MockIntersectionObserver {
		constructor(callback: IntersectionObserverCallback) {
			callback(
				[{ isIntersecting }] as IntersectionObserverEntry[],
				this as unknown as IntersectionObserver,
			);
		}
		observe = observe;
		disconnect = disconnect;
		unobserve = vi.fn();
		takeRecords = vi.fn().mockReturnValue([]);
		root = null;
		rootMargin = '';
		thresholds = [];
	} as unknown as typeof IntersectionObserver;

	return { observe, disconnect };
};

describe('InfinityScroll', () => {
	it('children을 렌더링한다', () => {
		mockIntersectionObserver(false);
		render(
			<InfinityScroll onFetchMore={vi.fn()}>
				<p>아이템</p>
			</InfinityScroll>,
		);

		expect(screen.getByText('아이템')).toBeInTheDocument();
	});

	it('sentinel이 뷰포트에 들어오면 onFetchMore를 호출한다', () => {
		const onFetchMore = vi.fn();
		mockIntersectionObserver(true);

		render(
			<InfinityScroll onFetchMore={onFetchMore}>
				<p>아이템</p>
			</InfinityScroll>,
		);

		expect(onFetchMore).toHaveBeenCalled();
	});

	it('loading 중이면 onFetchMore를 호출하지 않는다', () => {
		const onFetchMore = vi.fn();
		mockIntersectionObserver(true);

		render(
			<InfinityScroll onFetchMore={onFetchMore} loading>
				<p>아이템</p>
			</InfinityScroll>,
		);

		expect(onFetchMore).not.toHaveBeenCalled();
	});

	it('disabled이면 onFetchMore를 호출하지 않는다', () => {
		const onFetchMore = vi.fn();
		mockIntersectionObserver(true);

		render(
			<InfinityScroll onFetchMore={onFetchMore} disabled>
				<p>아이템</p>
			</InfinityScroll>,
		);

		expect(onFetchMore).not.toHaveBeenCalled();
	});

	it('loading 중이면 스피너를 렌더링한다', () => {
		mockIntersectionObserver(false);

		const { container } = render(
			<InfinityScroll onFetchMore={vi.fn()} loading>
				<p>아이템</p>
			</InfinityScroll>,
		);

		expect(container.querySelector('.animate-spin')).toBeInTheDocument();
	});

	it('error가 있으면 다시 시도 버튼을 렌더링한다', () => {
		mockIntersectionObserver(false);

		render(
			<InfinityScroll onFetchMore={vi.fn()} error>
				<p>아이템</p>
			</InfinityScroll>,
		);

		expect(screen.getByText('다시 시도')).toBeInTheDocument();
	});

	it('다시 시도 버튼을 클릭하면 onFetchMore를 호출한다', async () => {
		mockIntersectionObserver(false);
		const onFetchMore = vi.fn();

		render(
			<InfinityScroll onFetchMore={onFetchMore} error>
				<p>아이템</p>
			</InfinityScroll>,
		);

		await userEvent.click(screen.getByText('다시 시도'));

		expect(onFetchMore).toHaveBeenCalledTimes(1);
	});

	it('error가 없으면 다시 시도 버튼을 렌더링하지 않는다', () => {
		mockIntersectionObserver(false);

		render(
			<InfinityScroll onFetchMore={vi.fn()}>
				<p>아이템</p>
			</InfinityScroll>,
		);

		expect(screen.queryByText('다시 시도')).not.toBeInTheDocument();
	});
});
