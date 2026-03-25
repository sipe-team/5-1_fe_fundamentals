export type Category = 'shoes' | 'tops' | 'bottoms' | 'accessories';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  imageUrl: string;
  createdAt: string; // ISO 8601
  rating: number; // 1.0 ~ 5.0
}

export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'rating';

export interface ProductFilters {
  categories: Category[];
  keyword?: string;
  sort: SortOption;
}
