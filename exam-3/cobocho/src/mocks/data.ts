import menuJson from '@/shared/menu';
import optionsJson from '@/shared/options';
import ordersJson from '@/shared/orders';
import type { MenuItem, MenuOption, Order } from '@/types/order';

export const initialMenu: MenuItem[] = menuJson as MenuItem[];
export const initialOptions: MenuOption[] = optionsJson as MenuOption[];
export const initialOrders: Order[] = ordersJson as Order[];
