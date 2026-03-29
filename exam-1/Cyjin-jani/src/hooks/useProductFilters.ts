import { useTransition } from "react";
import { useSearchParams } from "react-router-dom";
import type { Category, SortOption } from "@/types/product";

interface ProductFiltersReturn {
  filters: {
    categories: Category[];
    keyword: string;
    sort: SortOption;
  };
  isPending: boolean;
  setKeyword: (keyword: string) => void;
  toggleCategory: (category: Category) => void;
  setSort: (sort: SortOption) => void;
}

const DEFAULT_SORT = 'newest';

export const useProductFilters = (): ProductFiltersReturn => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isPending, startTransition] = useTransition();
  
    const filters = {
      categories: searchParams.getAll('category') as Category[],
      keyword: searchParams.get('keyword') ?? '',
      sort: searchParams.get('sort') as SortOption ?? DEFAULT_SORT,
    };
  
    const setKeyword = (keyword: string) => {
      startTransition(() => {
        setSearchParams((params) => {
          const trimmed = keyword.trim();
          if (trimmed) {
            params.set('keyword', trimmed);
          } else {
            params.delete('keyword');
          }
          return params;
        });
      });
    };
  
    const toggleCategory = (category: Category) => {
      startTransition(() => {
        setSearchParams((params) => {
          const current = params.getAll('category');
          
          if (current.includes(category)) {
            params.delete('category');
            current.filter((cur) => cur !== category).forEach((c) => {
              params.append('category', c);
            });
          } else {
            params.append('category', category);
          }

          return params;
        });
      });
    };

    const setSort = (sort: SortOption) => {
      startTransition(() => {
        setSearchParams((params) => {
          params.set('sort', sort);
          return params;
        });
      });
    };
  
    return { filters, isPending, setKeyword, toggleCategory, setSort };
  };