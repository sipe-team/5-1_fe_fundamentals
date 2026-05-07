import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { catalogQuery, type MenuItem } from '../../api';
import { Grid } from '@/shared/components/layout';
import { MenuCard } from '../menu-card';

interface MenuListProps {
	category: MenuItem['category'];
	onClickMenu?: (item: MenuItem) => void;
}

export function MenuList({ category, onClickMenu }: MenuListProps) {
	const { data } = useSuspenseQuery(catalogQuery.items());

	const filtered = useMemo(() => {
		return data.items.filter((item) => item.category === category);
	}, [data.items, category]);

	return (
		<Grid cols={2}>
			{filtered.map((item) => (
				<MenuCard
					key={item.id}
					item={item}
					onClick={onClickMenu}
				/>
			))}
		</Grid>
	);
}
