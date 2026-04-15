import { useSuspenseQuery } from "@tanstack/react-query";

import { getItems } from "@/domains/menu/apis";
import type { MenuCategory } from "@/shared/types";

const QUERY_KEY = ["menu", "items"] as const;

export default function useMenus(category?: MenuCategory) {
  return useSuspenseQuery({
    queryKey: useMenus.getQueryKeys(category),
    queryFn: getItems,
    select: (
      data, // 카테고리 일치 or 전체
    ) =>
      category
        ? data.items.filter((menu) => menu.category === category)
        : data.items,
  });
}

useMenus.getQueryKeys = (category?: MenuCategory) =>
  category ? [QUERY_KEY, category] : QUERY_KEY;
