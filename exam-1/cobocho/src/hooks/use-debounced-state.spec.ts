import { act, renderHook } from '@testing-library/react';
import { useDebouncedState } from './use-debounced-state';

describe('useDebouncedState', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('초기값을 반환한다', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useDebouncedState('initial', onChange, 500),
		);

		expect(result.current.value).toBe('initial');
		expect(result.current.debouncedValue).toBe('initial');
	});

	it('초기 마운트 시 onChange를 호출하지 않는다', () => {
		const onChange = vi.fn();
		renderHook(() => useDebouncedState('initial', onChange, 500));

		expect(onChange).not.toHaveBeenCalled();
	});

	it('handleChange 호출 시 value는 즉시 업데이트된다', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useDebouncedState<string>('', onChange, 500),
		);

		act(() => result.current.handleChange('hello'));

		expect(result.current.value).toBe('hello');
		expect(result.current.debouncedValue).toBe('');
	});

	it('debounceMs 이후 debouncedValue가 업데이트되고 onChange가 호출된다', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useDebouncedState<string>('', onChange, 500),
		);

		act(() => {
			result.current.handleChange('hello');
			vi.advanceTimersByTime(500);
		});

		expect(result.current.debouncedValue).toBe('hello');
		expect(onChange).toHaveBeenCalledWith('hello');
	});

	it('debounceMs 이전에는 onChange가 호출되지 않는다', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useDebouncedState<string>('', onChange, 500),
		);

		act(() => {
			result.current.handleChange('hello');
			vi.advanceTimersByTime(300);
		});

		expect(result.current.debouncedValue).toBe('');
		expect(onChange).not.toHaveBeenCalled();
	});

	it('연속 입력 시 마지막 값만 반영된다', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useDebouncedState<string>('', onChange, 500),
		);

		act(() => {
			result.current.handleChange('h');
			vi.advanceTimersByTime(200);
			result.current.handleChange('he');
			vi.advanceTimersByTime(200);
			result.current.handleChange('hello');
			vi.advanceTimersByTime(500);
		});

		expect(result.current.debouncedValue).toBe('hello');
		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('hello');
	});

	it('handleSelect 호출 시 즉시 모든 값이 동기화되고 onChange가 호출된다', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useDebouncedState<string>('', onChange, 500),
		);

		act(() => result.current.handleSelect('selected'));

		expect(result.current.value).toBe('selected');
		expect(result.current.debouncedValue).toBe('selected');
		expect(onChange).toHaveBeenCalledWith('selected');
	});

	it('handleSelect은 pending된 debounce를 취소한다', () => {
		const onChange = vi.fn();
		const { result } = renderHook(() =>
			useDebouncedState<string>('', onChange, 500),
		);

		act(() => result.current.handleChange('typing'));
		act(() => result.current.handleSelect('selected'));
		act(() => vi.advanceTimersByTime(500));

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith('selected');
	});

	it('externalValue가 변경되면 내부 상태가 동기화된다', () => {
		const onChange = vi.fn();
		const { result, rerender } = renderHook(
			({ value }) => useDebouncedState(value, onChange, 500),
			{ initialProps: { value: 'initial' } },
		);

		rerender({ value: 'updated' });

		expect(result.current.value).toBe('updated');
		expect(result.current.debouncedValue).toBe('updated');
	});

	it('externalValue 변경 시 onChange를 호출하지 않는다', () => {
		const onChange = vi.fn();
		const { rerender } = renderHook(
			({ value }) => useDebouncedState(value, onChange, 500),
			{ initialProps: { value: 'initial' } },
		);

		rerender({ value: 'updated' });

		expect(onChange).not.toHaveBeenCalled();
	});

	it('언마운트 시 pending debounce가 취소된다', () => {
		const onChange = vi.fn();
		const { result, unmount } = renderHook(() =>
			useDebouncedState<string>('', onChange, 500),
		);

		act(() => result.current.handleChange('hello'));
		unmount();
		act(() => vi.advanceTimersByTime(500));

		expect(onChange).not.toHaveBeenCalled();
	});
});
