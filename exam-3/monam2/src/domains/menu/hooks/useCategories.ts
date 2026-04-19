import { useSuspenseQuery } from "@tanstack/react-query";

import { getCategories } from "@/domains/menu/apis";

const QUERY_KEY = ["catalog", "categories"] as const;

export default function useCategories() {
  return useSuspenseQuery({
    queryKey: QUERY_KEY,
    queryFn: getCategories,
    select: (data) => data.categories,
  });
}

useCategories.getQueryKeys = () => QUERY_KEY;
