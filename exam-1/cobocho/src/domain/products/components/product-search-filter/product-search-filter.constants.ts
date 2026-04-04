import type { ProductsRequest } from '../../api/products.types';

export const DEFAULT_PRODUCTS_REQUEST: ProductsRequest = {
	categories: null,
	keyword: null,
	sort: null,
	page: 1,
	size: 20,
};
