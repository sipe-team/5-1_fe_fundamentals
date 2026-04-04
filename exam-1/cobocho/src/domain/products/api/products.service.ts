import type {
	AutoCompleteRequest,
	AutoCompleteResponse,
	ProductsResponse,
	ProductsRequest,
} from './products.types';

import { kyInstance } from '../../../libs/http';

export const productsService = {
	getProducts: async (params: ProductsRequest) => {
		const searchParams: Record<string, string | number> = {
			page: params.page,
			size: params.size,
		};
		if (params.categories) searchParams.categories = params.categories.join(',');
		if (params.keyword) searchParams.keyword = params.keyword;
		if (params.sort) searchParams.sort = params.sort;

		return kyInstance.get('api/products', { searchParams }).json<ProductsResponse>();
	},
	getAutoComplete: async (params: AutoCompleteRequest) => {
		return kyInstance
			.get('api/autocomplete', { searchParams: { keyword: params.keyword } })
			.json<AutoCompleteResponse>();
	},
};
