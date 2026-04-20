import z from 'zod';

export const optionTypeSchema = z.enum(['grid', 'select', 'list']);

export type OptionType = z.infer<typeof optionTypeSchema>;

const baseOptionSchema = z.object({
	id: z.number(),
	name: z.string(),
	type: optionTypeSchema,
	required: z.boolean(),
	labels: z.array(z.string()),
	prices: z.array(z.number()),
});

export const gridOptionSchema = baseOptionSchema.extend({
	type: z.literal('grid'),
	col: z.number(),
	icons: z.array(z.string()),
});

export type GridOption = z.infer<typeof gridOptionSchema>;

export const selectOptionSchema = baseOptionSchema.extend({
	type: z.literal('select'),
});

export type SelectOption = z.infer<typeof selectOptionSchema>;

export const listOptionSchema = baseOptionSchema.extend({
	type: z.literal('list'),
	minCount: z.number(),
	maxCount: z.number(),
});

export type ListOption = z.infer<typeof listOptionSchema>;

export const menuOptionSchema = z.discriminatedUnion('type', [
	gridOptionSchema,
	selectOptionSchema,
	listOptionSchema,
]);

export type MenuOption = z.infer<typeof menuOptionSchema>;

export const menuItemSchema = z.object({
	id: z.string(),
	category: z.string(),
	title: z.string(),
	description: z.string(),
	price: z.number(),
	iconImg: z.string(),
	optionIds: z.array(z.number()),
});

export type MenuItem = z.infer<typeof menuItemSchema>;

export const categoriesResponseSchema = z.object({
	categories: z.array(menuItemSchema.shape.category),
});

export type CategoriesResponse = z.infer<typeof categoriesResponseSchema>;

export const menuItemsResponseSchema = z.object({
	items: z.array(menuItemSchema),
});

export type MenuItemsResponse = z.infer<typeof menuItemsResponseSchema>;

export const menuItemResponseSchema = z.object({
	item: menuItemSchema,
});

export type MenuItemResponse = z.infer<typeof menuItemResponseSchema>;

export const optionsResponseSchema = z.object({
	options: z.array(menuOptionSchema),
});

export type OptionsResponse = z.infer<typeof optionsResponseSchema>;
