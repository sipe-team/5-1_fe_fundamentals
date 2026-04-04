import { act, renderHook } from '@testing-library/react';
import {
	parseAsArrayOf,
	parseAsString,
	useQueryState,
	useQueryStates,
} from './use-query-state';

beforeEach(() => {
	window.history.replaceState({}, '', '/');
});

describe('useQueryState', () => {
	it('기본값을 반환한다', () => {
		const { result } = renderHook(() =>
			useQueryState('keyword', parseAsString, ''),
		);
		expect(result.current[0]).toBe('');
	});

	it('URL에 값이 있으면 해당 값을 반환한다', () => {
		window.history.replaceState({}, '', '/?keyword=나이키');

		const { result } = renderHook(() =>
			useQueryState('keyword', parseAsString, ''),
		);
		expect(result.current[0]).toBe('나이키');
	});

	it('상태를 변경하면 URL 쿼리스트링에 반영된다', () => {
		const { result } = renderHook(() =>
			useQueryState('keyword', parseAsString, ''),
		);

		act(() => result.current[1]('아디다스'));

		expect(result.current[0]).toBe('아디다스');
		expect(new URLSearchParams(window.location.search).get('keyword')).toBe(
			'아디다스',
		);
	});

	it('기본값으로 되돌리면 쿼리스트링에서 제거된다', () => {
		window.history.replaceState({}, '', '/?keyword=나이키');

		const { result } = renderHook(() =>
			useQueryState('keyword', parseAsString, ''),
		);

		act(() => result.current[1](''));

		expect(new URLSearchParams(window.location.search).has('keyword')).toBe(
			false,
		);
	});

	it('다른 쿼리 파라미터에 영향을 주지 않는다', () => {
		window.history.replaceState({}, '', '/?sort=newest&keyword=나이키');

		const { result } = renderHook(() =>
			useQueryState('keyword', parseAsString, ''),
		);

		act(() => result.current[1]('아디다스'));

		const params = new URLSearchParams(window.location.search);
		expect(params.get('sort')).toBe('newest');
		expect(params.get('keyword')).toBe('아디다스');
	});

	it('배열 값을 쉼표로 직렬화하여 저장한다', () => {
		const { result } = renderHook(() =>
			useQueryState('categories', parseAsArrayOf(parseAsString), []),
		);

		act(() => result.current[1](['shoes', 'tops']));

		expect(result.current[0]).toEqual(['shoes', 'tops']);
		expect(new URLSearchParams(window.location.search).get('categories')).toBe(
			'shoes,tops',
		);
	});

	it('빈 배열이면 쿼리스트링에서 제거된다', () => {
		window.history.replaceState({}, '', '/?categories=shoes');

		const { result } = renderHook(() =>
			useQueryState('categories', parseAsArrayOf(parseAsString), []),
		);

		act(() => result.current[1]([]));

		expect(new URLSearchParams(window.location.search).has('categories')).toBe(
			false,
		);
	});
});

describe('useQueryStates', () => {
	it('스키마에 정의된 기본값들을 객체로 반환한다', () => {
		const { result } = renderHook(() =>
			useQueryStates({
				keyword: { parser: parseAsString, default: '' },
				categories: { parser: parseAsArrayOf(parseAsString), default: [] },
			}),
		);

		expect(result.current[0]).toEqual({ keyword: '', categories: [] });
	});

	it('URL에서 여러 값을 한번에 읽어온다', () => {
		window.history.replaceState({}, '', '/?keyword=나이키&categories=shoes,tops');

		const { result } = renderHook(() =>
			useQueryStates({
				keyword: { parser: parseAsString, default: '' },
				categories: { parser: parseAsArrayOf(parseAsString), default: [] },
			}),
		);

		expect(result.current[0]).toEqual({
			keyword: '나이키',
			categories: ['shoes', 'tops'],
		});
	});

	it('일부 값만 업데이트할 수 있다', () => {
		const { result } = renderHook(() =>
			useQueryStates({
				keyword: { parser: parseAsString, default: '' },
				sort: { parser: parseAsString, default: 'newest' },
			}),
		);

		act(() => result.current[1]({ keyword: '아디다스' }));

		expect(result.current[0]).toEqual({ keyword: '아디다스', sort: 'newest' });
		const params = new URLSearchParams(window.location.search);
		expect(params.get('keyword')).toBe('아디다스');
		expect(params.has('sort')).toBe(false);
	});

	it('기본값으로 되돌리면 해당 키가 쿼리스트링에서 제거된다', () => {
		window.history.replaceState({}, '', '/?keyword=나이키&sort=rating');

		const { result } = renderHook(() =>
			useQueryStates({
				keyword: { parser: parseAsString, default: '' },
				sort: { parser: parseAsString, default: 'newest' },
			}),
		);

		act(() => result.current[1]({ keyword: '', sort: 'newest' }));

		const params = new URLSearchParams(window.location.search);
		expect(params.has('keyword')).toBe(false);
		expect(params.has('sort')).toBe(false);
	});
});
