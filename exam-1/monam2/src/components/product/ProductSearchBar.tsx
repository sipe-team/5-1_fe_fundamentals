import { css } from '@emotion/react';
import { Autocomplete, Button, Flex } from '@/components';
import { useRouteParams, useSearch } from '@/hooks';

export default function ProductSearchBar() {
  const { currentQuery, updateQuery, resetQuery } = useRouteParams();
  const { keyword, options, onChangeKeyword, submitSearch } = useSearch({
    appliedKeyword: currentQuery.search,
    onSearch: (search) => updateQuery({ search }),
  });

  return (
    <Flex
      direction="row"
      align="start"
      gap={8}
      wrap
      css={css`
        width: 100%;
      `}
    >
      <div
        css={css`
          flex: 1;
          min-width: min(18rem, 100%);
        `}
      >
        <Autocomplete
          value={keyword}
          onChange={onChangeKeyword}
          onSelect={(option) => submitSearch(option.value)}
          options={options}
          aria-label="상품명 검색"
          placeholder="상품명을 입력하세요."
        />
      </div>
      <Button onClick={() => submitSearch()}>검색</Button>
      <Button onClick={resetQuery} variant="secondary">
        전체 초기화
      </Button>
    </Flex>
  );
}
