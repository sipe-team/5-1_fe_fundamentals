export type MenuCategory = '커피' | '음료' | '디저트';

export interface MenuItem {
  id: string;
  category: MenuCategory;
  title: string;
  description: string;
  price: number;
  iconImg: string;
  optionIds: number[];
}

export type OptionType = 'grid' | 'select' | 'list';

export interface BaseOption {
  id: number;
  name: string;
  type: OptionType;
  required: boolean;
  labels: string[];
  prices: number[];
}

export interface GridOption extends BaseOption {
  type: 'grid';
  col: number;
  icons: string[];
}

export interface SelectOption extends BaseOption {
  type: 'select';
}

export interface ListOption extends BaseOption {
  type: 'list';
  minCount: number;
  maxCount: number;
}

export type MenuOption = GridOption | SelectOption | ListOption;

export interface OptionSelection {
  optionId: number;
  labels: string[];
}

export interface MenuResponse {
  menu: MenuItem[];
}

export interface MenuItemResponse {
  item: MenuItem;
}

export interface CategoriesResponse {
  categories: MenuCategory[];
}

export interface OptionsResponse {
  options: MenuOption[];
}
