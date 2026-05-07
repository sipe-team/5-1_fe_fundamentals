import { useMemo } from 'react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { catalogQuery, type MenuOption } from '@/domain/catalog/api';

export function useMenuOptions(itemId: string) {
	const [{ data: itemData }, { data: optionsData }] = useSuspenseQueries({
		queries: [catalogQuery.item(itemId), catalogQuery.options()],
	});

	const item = itemData.item;

	const options = useMemo(
		() =>
			item.optionIds
				.map((id) => optionsData.options.find((o) => o.id === id))
				.filter((o): o is MenuOption => o != null),
		[item.optionIds, optionsData.options],
	);

	return { item, options };
}
