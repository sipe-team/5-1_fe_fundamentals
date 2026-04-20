export const queryKeys = {
  catalog: {
    categories: ['catalog', 'categories'] as const,
    items: ['catalog', 'items'] as const,
    item: (itemId: string) => ['catalog', 'items', itemId] as const,
    options: ['catalog', 'options'] as const,
  },
  orders: {
    detail: (orderId: string) => ['orders', orderId] as const,
  },
};
