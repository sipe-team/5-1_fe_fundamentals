import type { MenuCategory, MenuOption } from "@/shared/types";

export function isMenuCategory(value: string | null): value is MenuCategory {
  return value === "커피" || value === "음료" || value === "디저트";
}

export function calculateOptionPrice(
  option: MenuOption,
  selectedLabels: string[],
) {
  let total = 0;

  for (const label of selectedLabels) {
    const index = option.labels.indexOf(label);

    if (index !== -1) {
      total += option.prices[index] ?? 0;
    }
  }

  return total;
}

export * from "./orderForm";
