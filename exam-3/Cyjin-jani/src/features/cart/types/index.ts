import type { OptionSelection } from '@/features/menu/types';

export interface CartItem {
  itemId: string;
  title: string;
  iconImg?: string;
  basePrice: number;
  options: OptionSelection[];
  quantity: number;
  unitPrice: number;
}
