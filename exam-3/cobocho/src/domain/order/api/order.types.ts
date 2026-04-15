import z from 'zod';

export const optionSelectionSchema = z.object({
	optionId: z.number(),
	labels: z.array(z.string()),
});

export type OptionSelection = z.infer<typeof optionSelectionSchema>;

export const orderItemSchema = z.object({
	itemId: z.string(),
	title: z.string(),
	quantity: z.number(),
	basePrice: z.number(),
	options: z.array(optionSelectionSchema),
	unitPrice: z.number(),
});

export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderStatusSchema = z.enum([
	'pending',
	'preparing',
	'completed',
	'cancelled',
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderSchema = z.object({
	id: z.string(),
	totalPrice: z.number(),
	items: z.array(orderItemSchema),
	status: orderStatusSchema,
	customerName: z.string(),
	createdAt: z.string(),
});

export type Order = z.infer<typeof orderSchema>;

export const createOrderRequestSchema = z.object({
	totalPrice: z.number(),
	customerName: z.string(),
	items: z.array(
		z.object({
			itemId: z.string(),
			quantity: z.number(),
			options: z.array(optionSelectionSchema),
		}),
	),
});

export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;

export const ordersResponseSchema = z.object({
	orders: z.array(orderSchema),
});

export type OrdersResponse = z.infer<typeof ordersResponseSchema>;

export const orderResponseSchema = z.object({
	order: orderSchema,
});

export type OrderResponse = z.infer<typeof orderResponseSchema>;

export const createOrderResponseSchema = z.object({
	orderId: z.string(),
});

export type CreateOrderResponse = z.infer<typeof createOrderResponseSchema>;

export const cancelOrderResponseSchema = z.object({
	message: z.string(),
});

export type CancelOrderResponse = z.infer<typeof cancelOrderResponseSchema>;
