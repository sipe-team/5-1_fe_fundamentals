import { client } from "@/shared/apis";
import type { MenuResponse } from "@/shared/types";

export default function getMenus() {
  return client.get("catalog/items").json<MenuResponse>();
}
