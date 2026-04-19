import { client } from "@/shared/apis";
import type { MenuItemResponse } from "@/shared/types";

export default function getMenuItem(id: string) {
  return client.get(`catalog/items/${id}`).json<MenuItemResponse>();
}
