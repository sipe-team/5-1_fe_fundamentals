import { createContext, useContext, type ReactNode } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useQueryState } from 'nuqs';
import { catalogQuery, type MenuItem } from '../../api';

interface CategoryContextValue {
	category: MenuItem['category'];
	categories: MenuItem['category'][];
	setCategory: (category: MenuItem['category'] | null) => void;
}

const CategoryContext = createContext<CategoryContextValue | null>(null);

export function CategoryProvider({ children }: { children: ReactNode }) {
	const { data } = useSuspenseQuery(catalogQuery.categories());

	const [rawCategory, setCategory] = useQueryState('category', {
		defaultValue: data.categories[0],
	});

	const categories = data.categories;

	const resolvedCategory = categories.includes(rawCategory)
		? rawCategory
		: data.categories[0];

	return (
		<CategoryContext.Provider
			value={{ category: resolvedCategory, categories, setCategory }}
		>
			{children}
		</CategoryContext.Provider>
	);
}

export function useCategoryContext() {
	const context = useContext(CategoryContext);
	if (!context) {
		throw new Error('useCategoryContext must be used within CategoryProvider');
	}
	return context;
}
