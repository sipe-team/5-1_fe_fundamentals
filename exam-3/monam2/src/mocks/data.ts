import menuJson from "@/data/menu";
import optionsJson from "@/data/options";
import ordersJson from "@/data/orders";
import type { MenuItem, MenuOption, Order } from "@/shared/types";

export const initialMenu: MenuItem[] = menuJson as MenuItem[];
export const initialOptions: MenuOption[] = optionsJson as MenuOption[];
export const initialOrders: Order[] = ordersJson as Order[];
