export const reservationsQueryKeys = {
  allByDate: (date: string) => ['reservations', date] as const,
  detailById: (id: string) => ['reservations', 'detail', id] as const,
};
