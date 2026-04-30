import { useEffect, useState } from 'react';
import { useAutoComplete, useDebounce } from '@/hooks';

interface UseSearchProps {
  appliedKeyword?: string;
  onSearch: (keyword?: string) => void;
}

export default function useSearch({
  appliedKeyword,
  onSearch,
}: UseSearchProps) {
  const [keyword, setKeyword] = useState(appliedKeyword ?? '');
  const debouncedKeyword = useDebounce(keyword.trim(), 500);

  const { data: autocompletedData } = useAutoComplete({
    keyword: debouncedKeyword,
  });

  useEffect(() => {
    setKeyword(appliedKeyword ?? '');
  }, [appliedKeyword]);

  const options =
    autocompletedData?.suggestions.map((suggestion) => ({
      label: suggestion,
      value: suggestion,
    })) ?? [];

  const onChangeKeyword = (value: string) => {
    setKeyword(value);
  };

  const submitSearch = (nextKeyword = keyword) => {
    const trimmedKeyword = nextKeyword.trim();

    setKeyword(trimmedKeyword);
    onSearch(trimmedKeyword || undefined);
  };

  return {
    keyword,
    options,
    onChangeKeyword,
    submitSearch,
  };
}
