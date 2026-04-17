import { useEffect } from 'react';
import { useSearchParams } from 'wouter';

import type { MenuCategory } from '@/features/menu/types';

interface UseMenuCategoryParamResult {
  selectedCategory: MenuCategory;
  onCategoryChange: (category: MenuCategory) => void;
}

export function useMenuCategoryParam(categories: MenuCategory[]): UseMenuCategoryParamResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryParam = searchParams.get('category');
  const fallbackCategory = categories[0];

  if (fallbackCategory == null) {
    throw new Error('카테고리 정보가 비어 있어요.');
  }

  const selectedCategory = isMenuCategory(selectedCategoryParam, categories)
    ? selectedCategoryParam
    : fallbackCategory;

  useEffect(() => {
    if (selectedCategoryParam === selectedCategory) return;
    setSearchParams((prev) => updateCategorySearchParam(prev, selectedCategory), { replace: true });
  }, [selectedCategory, selectedCategoryParam]);

  const onCategoryChange = (category: MenuCategory) => {
    if (category === selectedCategory) return;
    setSearchParams((prev) => updateCategorySearchParam(prev, category));
  };

  return { selectedCategory, onCategoryChange };
}

function isMenuCategory(value: string | null, categories: MenuCategory[]): value is MenuCategory {
  return value != null && categories.some((category) => category === value);
}

function updateCategorySearchParam(prev: URLSearchParams, category: MenuCategory) {
  const nextParams = new URLSearchParams(prev);
  nextParams.set('category', category);
  return nextParams;
}
