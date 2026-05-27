import { css } from '@emotion/react';
import { Checkbox } from '@/components';
import { CATEGORY_OPTIONS } from '@/constants';
import { useCategory, useRouteParams } from '@/hooks';
import { type Category, isCategory } from '@/types';

export default function ProductCategoryFilter() {
  const { currentQuery, updateQuery } = useRouteParams();
  const selectedCategories = parseCategories(currentQuery.categories);
  const { onChangeCategory } = useCategory({
    selectedCategories,
    onChangeCategories: (categories) =>
      updateQuery({
        categories: serializeCategories(categories),
      }),
  });

  return (
    <div css={categoryFilterStyle}>
      {CATEGORY_OPTIONS.map(({ value, label }) => (
        <Checkbox
          key={value}
          label={label}
          value={value}
          checked={selectedCategories.includes(value)}
          onChange={onChangeCategory}
        />
      ))}
    </div>
  );
}

function parseCategories(categories?: string) {
  return categories?.split(',').filter(isCategory) ?? [];
}

function serializeCategories(categories: Category[]) {
  return categories.length > 0 ? categories.join(',') : undefined;
}

const categoryFilterStyle = css`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    min-width: 280px;
  }
`;
