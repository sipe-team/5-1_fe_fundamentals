import z from 'zod';

export const categorySchema = z.enum([
	'shoes',
	'tops',
	'bottoms',
	'accessories',
]);

export type Category = z.infer<typeof categorySchema>;

export const CATEGORY_LABELS: Record<Category, string> = {
	shoes: '신발',
	tops: '상의',
	bottoms: '하의',
	accessories: '악세서리',
};

export const productSchema = z.object({
	id: z.number(),
	name: z.string(),
	price: z.number(),
	category: categorySchema,
	imageUrl: z.string(),
	createdAt: z.string(),
	rating: z.number(),
});

export type Product = z.infer<typeof productSchema>;

export const productsSortOptionSchema = z.enum([
	'price_asc',
	'price_desc',
	'newest',
	'rating',
]);

export type ProductsSortOption = z.infer<typeof productsSortOptionSchema>;

export const SORT_OPTION_LABELS: Record<ProductsSortOption, string> = {
	price_asc: '가격 낮은순',
	price_desc: '가격 높은순',
	newest: '최신순',
	rating: '평점순',
};

export const productsRequestSchema = z.object({
	categories: z.array(categorySchema).nullable().default(null),
	keyword: z.string().nullable().default(null),
	sort: productsSortOptionSchema.nullable().default(null),
	page: z.number().default(1),
	size: z.number().default(20),
});

export type ProductsRequest = z.infer<typeof productsRequestSchema>;

export const productsResponseSchema = z.object({
	products: z.array(productSchema),
	total: z.number(),
	page: z.number(),
	size: z.number(),
	totalPages: z.number(),
});

export type ProductsResponse = z.infer<typeof productsResponseSchema>;

export const autoCompleteRequestSchema = z.object({
	keyword: z.string(),
});

export type AutoCompleteRequest = z.infer<typeof autoCompleteRequestSchema>;

export const autoCompleteResponseSchema = z.object({
	suggestions: z.array(z.string()),
});

export type AutoCompleteResponse = z.infer<typeof autoCompleteResponseSchema>;
