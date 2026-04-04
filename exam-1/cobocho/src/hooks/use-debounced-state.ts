import { useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'es-toolkit';

export const useDebouncedState = <T>(
	externalValue: T,
	onChange: (value: T) => void,
	debounceMs: number,
) => {
	const [value, setValue] = useState(externalValue);
	const [debouncedValue, setDebouncedValue] = useState(externalValue);
	const isInitialMount = useRef(true);
	const isExternalUpdate = useRef(false);
	const isSelectUpdate = useRef(false);

	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	const debouncedValueRef = useRef(debouncedValue);
	debouncedValueRef.current = debouncedValue;

	const debouncedSetKeyword = useMemo(
		() => debounce((v: T) => setDebouncedValue(v), debounceMs),
		[debounceMs],
	);

	useEffect(() => {
		return () => debouncedSetKeyword.cancel();
	}, [debouncedSetKeyword]);

	useEffect(() => {
		if (externalValue !== debouncedValueRef.current) {
			isExternalUpdate.current = true;
		}
		setValue(externalValue);
		setDebouncedValue(externalValue);
	}, [externalValue]);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			isExternalUpdate.current = false;
			return;
		}
		if (isExternalUpdate.current) {
			isExternalUpdate.current = false;
			return;
		}
		if (isSelectUpdate.current) {
			isSelectUpdate.current = false;
			return;
		}
		onChangeRef.current(debouncedValue);
	}, [debouncedValue]);

	const handleChange = (v: T) => {
		setValue(v);
		debouncedSetKeyword(v);
	};

	const handleSelect = (v: T) => {
		debouncedSetKeyword.cancel();
		isSelectUpdate.current = true;
		setValue(v);
		setDebouncedValue(v);
		onChangeRef.current(v);
	};

	return { value, debouncedValue, handleChange, handleSelect };
};
