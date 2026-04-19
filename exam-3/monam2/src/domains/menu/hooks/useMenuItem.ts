import { useSuspenseQuery } from "@tanstack/react-query";

import { getItem } from "@/domains/menu/apis";

const QUERY_KEY = ["menu", "item"] as const;

interface UseMenuItemProps {
  id: string;
}

export default function useMenuItem({ id }: UseMenuItemProps) {
  return useSuspenseQuery({
    queryKey: useMenuItem.getQueryKeys(id),
    queryFn: () => getItem(id),
    select: (data) => data.item,
  });
}

useMenuItem.getQueryKeys = (id?: string) =>
  id ? [...QUERY_KEY, id] : QUERY_KEY;
