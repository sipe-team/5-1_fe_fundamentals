export const queryKeys = {
  rooms: ['rooms'] as const,
  reservations: {
    byDate: (date: string) => ['reservations', date] as const,
    detail: (id: string) => ['reservations', 'detail', id] as const,
    my: ['reservations', 'my'] as const,
  },
};
