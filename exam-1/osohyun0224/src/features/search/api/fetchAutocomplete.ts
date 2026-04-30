import { http } from '@/shared/api/http';
import type { AutocompleteResponse } from '@/types';

export async function fetchAutocomplete(keyword: string): Promise<string[]> {
  const data = await http.get<AutocompleteResponse>(
    `/api/autocomplete?keyword=${encodeURIComponent(keyword)}`,
  );
  return data.suggestions;
}
