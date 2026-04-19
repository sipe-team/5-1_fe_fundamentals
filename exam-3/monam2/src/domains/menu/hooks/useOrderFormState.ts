import { useState } from 'react';
import { toast } from 'sonner';
import {
  clampQuantity,
  type GridSelections,
  getSelectedOptions,
  type ListSelections,
  type OrderFormSelections,
  type SelectSelections,
} from '@/domains/menu/utils/orderForm';
import type { ListOption, MenuOption, SelectOption } from '@/shared/types';

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

  const selections: OrderFormSelections = {
    gridSelections,
    selectSelections,
    listSelections,
  };

  const openedSelectOption =
    visibleOptions.find(
      (option): option is SelectOption =>
        option.type === 'select' && option.id === bottomSheetSelection,
    ) ?? null;

  const selectedOptions = getSelectedOptions(visibleOptions, selections);

  const changeQuantity = (nextQuantity: number) => {
    setQuantity(clampQuantity(nextQuantity));
  };

  const selectGridOption = (optionId: number, label: string) => {
    setGridSelections((current) => ({
      ...current,
      [optionId]: label,
    }));
  };

  const openSelectOption = (optionId: number) => {
    setBottomSheetSelection(optionId);
  };

  const closeSelectOption = () => {
    setBottomSheetSelection(null);
  };

  const selectOption = (optionId: number, label: string | undefined) => {
    setSelectSelections((current) => ({
      ...current,
      [optionId]: label,
    }));
    closeSelectOption();
  };

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
    selections,
    quantity,
    openedSelectOption,
    selectedOptions,
    changeQuantity,
    selectGridOption,
    openSelectOption,
    closeSelectOption,
    selectOption,
    toggleListOption,
  };
}
