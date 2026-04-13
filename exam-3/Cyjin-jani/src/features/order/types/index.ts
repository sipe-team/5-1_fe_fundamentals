import type { OptionSelection } from '@/features/menu/types';

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

export interface CreateOrderRequest {
  totalPrice: number;
  customerName: string;
  items: {
    itemId: string;
    quantity: number;
    options: OptionSelection[];
  }[];
}

export interface OrdersResponse {
  orders: Order[];
}

export interface OrderResponse {
  order: Order;
}
