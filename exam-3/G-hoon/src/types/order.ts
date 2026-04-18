export type MenuCategory = '커피' | '음료' | '디저트';

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

export interface MenuItem {
  id: string;
  category: MenuCategory;
  title: string;
  description: string;
  price: number;
  iconImg: string;
  optionIds: number[];
}

// grid/select: labels.length === 1, list: minCount <= labels.length <= maxCount
export interface OptionSelection {
  optionId: number;
  labels: string[];
}

export interface CartOptionSelection extends OptionSelection {
  name?: string;
}

export interface OrderItem {
  itemId: string;
  title: string;
  quantity: number;
  basePrice: number;
  options: OptionSelection[];
  unitPrice: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  totalPrice: number;
  items: OrderItem[];
  status: OrderStatus;
  customerName: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  itemId: string;
  title: string;
  basePrice: number;
  options: CartOptionSelection[];
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderRequest {
  totalPrice: number;
  customerName: string;
  items: {
    itemId: string;
    quantity: number;
    options: OptionSelection[];
  }[];
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

export interface OrdersResponse {
  orders: Order[];
}

export interface OrderResponse {
  order: Order;
}
