import { css } from '@emotion/react';
import { Flex } from '@/components';
import ProductCategoryFilter from './ProductCategoryFilter';
import ProductSortSelect from './ProductSortSelect';

export default function ProductFilterBar() {
  return (
    <Flex
      align="stretch"
      css={css`
        width: 100%;
      `}
    >
      <ProductCategoryFilter />
      <ProductSortSelect />
    </Flex>
  );
}
