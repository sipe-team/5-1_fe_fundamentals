import { act, renderHook } from '@testing-library/react';
import { usePersistentStorage } from './use-persistent-storage';

beforeEach(() => {
	window.localStorage.clear();
});

describe('usePersistentStorage', () => {
	it('저장소가 비어있으면 initialValue를 반환한다', () => {
		const { result } = renderHook(() =>
			usePersistentStorage({
				key: 'test:empty',
				version: 1,
				initialValue: { count: 0 },
			}),
		);

		expect(result.current[0]).toEqual({ count: 0 });
	});

	it('setValue 호출 시 localStorage에 버전과 함께 저장한다', () => {
		const { result } = renderHook(() =>
			usePersistentStorage({
				key: 'test:save',
				version: 2,
				initialValue: 0,
			}),
		);

		act(() => {
			result.current[1](42);
		});

		expect(result.current[0]).toBe(42);

		const raw = window.localStorage.getItem('test:save');
		expect(JSON.parse(raw!)).toEqual({ version: 2, state: 42 });
	});

	it('함수형 업데이터를 지원한다', () => {
		const { result } = renderHook(() =>
			usePersistentStorage({
				key: 'test:fn',
				version: 1,
				initialValue: 10,
			}),
		);

		act(() => {
			result.current[1]((prev) => prev + 5);
		});

		expect(result.current[0]).toBe(15);
	});

	it('마운트 시 저장된 동일 버전 값을 복원한다', () => {
		window.localStorage.setItem(
			'test:restore',
			JSON.stringify({ version: 1, state: { n: 99 } }),
		);

		const { result } = renderHook(() =>
			usePersistentStorage({
				key: 'test:restore',
				version: 1,
				initialValue: { n: 0 },
			}),
		);

		expect(result.current[0]).toEqual({ n: 99 });
	});

	it('버전이 다르고 migrate가 없으면 initialValue로 초기화한다', () => {
		window.localStorage.setItem(
			'test:stale',
			JSON.stringify({ version: 1, state: { legacy: true } }),
		);

		const { result } = renderHook(() =>
			usePersistentStorage({
				key: 'test:stale',
				version: 2,
				initialValue: { legacy: false },
			}),
		);

		expect(result.current[0]).toEqual({ legacy: false });
	});

	it('버전이 다르면 migrate 결과를 사용하고 최신 버전으로 다시 저장한다', () => {
		window.localStorage.setItem(
			'test:migrate',
			JSON.stringify({ version: 1, state: { old: 'hello' } }),
		);

		const migrate = vi.fn((state: unknown, version: number) => {
			expect(version).toBe(1);
			return { upgraded: (state as { old: string }).old.toUpperCase() };
		});

		const { result } = renderHook(() =>
			usePersistentStorage({
				key: 'test:migrate',
				version: 2,
				initialValue: { upgraded: '' },
				migrate,
			}),
		);

		expect(migrate).toHaveBeenCalledTimes(1);
		expect(result.current[0]).toEqual({ upgraded: 'HELLO' });

		const raw = window.localStorage.getItem('test:migrate');
		expect(JSON.parse(raw!)).toEqual({
			version: 2,
			state: { upgraded: 'HELLO' },
		});
	});

	it('migrate가 undefined를 반환하면 initialValue로 폴백한다', () => {
		window.localStorage.setItem(
			'test:migrate-fallback',
			JSON.stringify({ version: 1, state: 'bad' }),
		);

		const { result } = renderHook(() =>
			usePersistentStorage({
				key: 'test:migrate-fallback',
				version: 2,
				initialValue: 'default',
				migrate: () => undefined,
			}),
		);

		expect(result.current[0]).toBe('default');
	});

	it('같은 key를 사용하는 두 훅이 상태를 공유한다', () => {
		const opts = {
			key: 'test:shared',
			version: 1,
			initialValue: 0,
		};

		const a = renderHook(() => usePersistentStorage(opts));
		const b = renderHook(() => usePersistentStorage(opts));

		expect(a.result.current[0]).toBe(0);
		expect(b.result.current[0]).toBe(0);

		act(() => {
			a.result.current[1](7);
		});

		expect(a.result.current[0]).toBe(7);
		expect(b.result.current[0]).toBe(7);
	});

	it('다른 탭의 storage 이벤트를 구독하여 값이 갱신된다', () => {
		const { result } = renderHook(() =>
			usePersistentStorage({
				key: 'test:cross-tab',
				version: 1,
				initialValue: 'initial',
			}),
		);

		expect(result.current[0]).toBe('initial');

		act(() => {
			// 다른 탭이 localStorage를 업데이트 후 storage 이벤트 발송
			window.localStorage.setItem(
				'test:cross-tab',
				JSON.stringify({ version: 1, state: 'from-other-tab' }),
			);
			window.dispatchEvent(
				new StorageEvent('storage', {
					key: 'test:cross-tab',
					newValue: JSON.stringify({ version: 1, state: 'from-other-tab' }),
				}),
			);
		});

		expect(result.current[0]).toBe('from-other-tab');
	});

	it('파싱 불가능한 값이 저장돼 있으면 initialValue로 폴백한다', () => {
		window.localStorage.setItem('test:corrupt', 'not-json{');

		const { result } = renderHook(() =>
			usePersistentStorage({
				key: 'test:corrupt',
				version: 1,
				initialValue: 'safe',
			}),
		);

		expect(result.current[0]).toBe('safe');
	});
});
