import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
	AutoComplete,
	AutoCompleteInput,
	AutoCompleteContent,
	AutoCompleteItem,
} from '@/components/auto-complete/auto-complete';
import { productsQuery } from '../../api/products.query';
import { useDebouncedState } from '@/hooks/use-debounced-state';
import { useState } from 'react';

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
	const { value: inputValue, debouncedValue, handleChange, handleSelect } =
		useDebouncedState(value, onChange, debounceMs);
	const [open, setOpen] = useState(false);

	const { data, isFetching } = useQuery({
		...productsQuery.getAutoCompleteQueryOptions({ keyword: debouncedValue }),
		enabled: open && debouncedValue.length > 0,
		placeholderData: keepPreviousData,
	});

	const suggestions = debouncedValue.length > 0 ? (data?.suggestions ?? []) : [];

	return (
		<AutoComplete
			value={inputValue}
			onChange={handleChange}
			onSelect={handleSelect}
			onOpenChange={setOpen}
		>
			<AutoCompleteInput loading={isFetching} />
			<AutoCompleteContent>
				{suggestions.map((suggestion) => (
					<AutoCompleteItem
						key={suggestion}
						value={suggestion}
					/>
				))}
			</AutoCompleteContent>
		</AutoComplete>
	);
};
