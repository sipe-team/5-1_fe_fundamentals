import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchAutocomplete } from '@/features/search/api/fetchAutocomplete';
import { autocompleteQuery } from '@/shared/api/queryKeys';

export function useAutocomplete(keyword: string) {
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  const trimmed = debouncedKeyword.trim();

  const { data: suggestions = [], isLoading: loading } = useQuery({
    queryKey: autocompleteQuery.suggestions(trimmed),
    queryFn: () => fetchAutocomplete(trimmed),
    enabled: trimmed.length > 0,
    staleTime: 60 * 1000,
    throwOnError: false,
  });

  return { suggestions: trimmed ? suggestions : [], loading };
}
