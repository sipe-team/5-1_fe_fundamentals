import { client } from '@/shared/apis';
import type { CategoriesResponse } from '@/shared/types';

export default function getCategories() {
  return client.get('catalog/categories').json<CategoriesResponse>();
}
