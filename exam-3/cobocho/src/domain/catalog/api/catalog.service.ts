import { api } from '@/shared/lib/ky';
import type {
	CategoriesResponse,
	MenuItemResponse,
	MenuItemsResponse,
	OptionsResponse,
} from './catalog.types';

export const catalogService = {
	getCategories: async () => {
		return api.get('catalog/categories').json<CategoriesResponse>();
	},
	getItems: async () => {
		return api.get('catalog/items').json<MenuItemsResponse>();
	},
	getItem: async (itemId: string) => {
		return api.get(`catalog/items/${itemId}`).json<MenuItemResponse>();
	},
	getOptions: async () => {
		return api.get('catalog/options').json<OptionsResponse>();
	},
};
