export const productsQuery = {
  all: () => ['products'] as const,
  lists: () => [...productsQuery.all(), 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...productsQuery.lists(), params] as const,
} as const;

export const autocompleteQuery = {
  all: () => ['autocomplete'] as const,
  suggestions: (keyword: string) =>
    [...autocompleteQuery.all(), keyword] as const,
} as const;
