import { api } from '@/shared/lib/ky';
import type {
  CategoriesResponse,
  MenuItem,
  MenuItemResponse,
  OptionsResponse,
} from '@/features/menu/types';

export interface MenuItemsResponse {
  items: MenuItem[];
}

export async function getCategories(): Promise<CategoriesResponse> {
  return api.get('catalog/categories').json<CategoriesResponse>();
}

export async function getMenuItems(): Promise<MenuItemsResponse> {
  return api.get('catalog/items').json<MenuItemsResponse>();
}

export async function getMenuDetail(itemId: string): Promise<MenuItemResponse> {
  return api.get(`catalog/items/${itemId}`).json<MenuItemResponse>();
}

export async function getOptions(): Promise<OptionsResponse> {
  return api.get('catalog/options').json<OptionsResponse>();
}
