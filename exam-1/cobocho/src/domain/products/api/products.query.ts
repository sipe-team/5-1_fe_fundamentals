import { productsService } from './products.service';

import type { AutoCompleteRequest, ProductsRequest } from './products.types';

export const productsQuery = {
	all: () => ['products'] as const,
	lists: () => [...productsQuery.all(), 'lists'] as const,
	getProductsQueryOptions: (params: ProductsRequest) => ({
		queryKey: [...productsQuery.lists(), params],
		queryFn: () => productsService.getProducts(params),
	}),
	getAutoCompleteQueryOptions: (params: AutoCompleteRequest) => ({
		queryKey: [...productsQuery.all(), 'autoComplete', params],
		queryFn: () => productsService.getAutoComplete(params),
	}),
};
