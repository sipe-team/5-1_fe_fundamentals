import { type Category, isCategory } from '@/types';

interface UseCategoryProps {
  selectedCategories: Category[];
  onChangeCategories: (categories: Category[]) => void;
}

export default function useCategory({
  selectedCategories,
  onChangeCategories,
}: UseCategoryProps) {
  const onChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const nextCategory = isCategory(value) ? value : undefined;

    if (!nextCategory) {
      return;
    }

    const nextCategories = checked
      ? [...new Set([...selectedCategories, nextCategory])]
      : selectedCategories.filter((category) => category !== nextCategory);

    onChangeCategories(nextCategories);
  };

  return {
    onChangeCategory,
  };
}
