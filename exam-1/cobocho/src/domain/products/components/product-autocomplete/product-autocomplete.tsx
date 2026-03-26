import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
	AutoComplete,
	AutoCompleteItem,
} from '@/components/auto-complete/auto-complete';
import { debounce } from 'es-toolkit';
import { productsQuery } from '../../api/products.query';

interface ProductAutoCompleteProps {
	value: string;
	onChange: (value: string) => void;
	debounceMs?: number;
}

export const ProductAutoComplete = ({
	value,
	onChange,
	debounceMs = 500,
}: ProductAutoCompleteProps) => {
	const [keyword, setKeyword] = useState(value);
	const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

	const debouncedSetKeyword = useMemo(
		() => debounce((v: string) => setDebouncedKeyword(v), debounceMs),
		[debounceMs],
	);

	const handleChange = (v: string) => {
		setKeyword(v);
		debouncedSetKeyword(v);
	};

	useEffect(() => {
		setKeyword(value);
	}, [value]);

	const onChangeRef = useRef(onChange);
	onChangeRef.current = onChange;

	useEffect(() => {
		onChangeRef.current(debouncedKeyword);
	}, [debouncedKeyword]);

	const { data, isFetching } = useQuery({
		...productsQuery.getAutoCompleteQueryOptions({ keyword: debouncedKeyword }),
		enabled: debouncedKeyword.length > 0,
		placeholderData: { suggestions: [] },
	});

	const suggestions = data?.suggestions ?? [];

	return (
		<AutoComplete
			value={keyword}
			onChange={handleChange}
			loading={isFetching}
			onSelect={(selected) => {
				setKeyword(selected);
				onChange(selected);
			}}
		>
			{suggestions.map((suggestion) => (
				<AutoCompleteItem
					key={suggestion}
					value={suggestion}
				/>
			))}
		</AutoComplete>
	);
};
