import { useState } from "react";
import type { ListOption, MenuOption, SelectOption } from "@/shared/types";
import {
  getSelectedLabels,
  type GridSelections,
  type ListSelections,
  type SelectSelections,
} from "@/domains/menu/utils/orderForm";
import { toast } from "sonner";

export default function useOrderFormState(visibleOptions: MenuOption[]) {
  const [gridSelections, setGridSelections] = useState<GridSelections>({});
  const [selectSelections, setSelectSelections] = useState<SelectSelections>(
    {},
  );
  const [listSelections, setListSelections] = useState<ListSelections>({});
  const [bottomSheetSelection, setBottomSheetSelection] = useState<
    number | null
  >(null);
  const [quantity, setQuantity] = useState(1);

  const updateQuantity = (nextQuantity: number) => {
    setQuantity(Math.min(99, Math.max(1, nextQuantity)));
  };

  const openedSelectOption =
    visibleOptions.find(
      (option): option is SelectOption =>
        option.type === "select" && option.id === bottomSheetSelection,
    ) ?? null;

  const selectedOptions = visibleOptions.flatMap((option) => {
    const labels = getSelectedLabels(
      option,
      gridSelections,
      selectSelections,
      listSelections,
    );

    if (labels.length === 0) {
      return [];
    }

    return [
      {
        optionId: option.id,
        labels,
      },
    ];
  });

  const toggleListOption = (option: ListOption, label: string) => {
    const currentLabels = listSelections[option.id] ?? [];
    const isSelected = currentLabels.includes(label);

    // 리스트옵션 최대 개수 초과 시 에러
    if (!isSelected && currentLabels.length >= option.maxCount) {
      toast.error(`최대 ${option.maxCount}개까지 선택할 수 있어요`);
      return;
    }

    const nextLabels = isSelected
      ? currentLabels.filter((currentLabel) => currentLabel !== label)
      : option.labels.filter(
          (currentLabel) =>
            currentLabels.includes(currentLabel) || currentLabel === label,
        );

    setListSelections((current) => ({
      ...current,
      [option.id]: nextLabels,
    }));
  };

  return {
    gridSelections,
    selectSelections,
    listSelections,
    bottomSheetSelection,
    quantity,

    openedSelectOption,
    selectedOptions,

    updateQuantity,
    setGridSelections,
    setSelectSelections,
    setListSelections,
    setBottomSheetSelection,
    setQuantity,

    toggleListOption,
  };
}
