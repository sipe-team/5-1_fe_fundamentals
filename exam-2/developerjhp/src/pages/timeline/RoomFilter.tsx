import { css } from "@emotion/react";
import {
  ALL_EQUIPMENT,
  EQUIPMENT_LABELS,
  MIN_CAPACITY_OPTIONS,
} from "@/reservation/constants";
import type { Equipment } from "@/reservation/types";
import { CheckboxGroup } from "@/components/CheckboxGroup";
import { spacing } from "@/styles/tokens";

interface RoomFilterProps {
  minCapacity: number;
  onMinCapacityChange: (value: number) => void;
  selectedEquipment: Equipment[];
  onEquipmentChange: (equipment: Equipment[]) => void;
}

const equipmentOptions = ALL_EQUIPMENT.map((eq) => ({
  value: eq,
  label: EQUIPMENT_LABELS[eq],
}));

export function RoomFilter({
  minCapacity,
  onMinCapacityChange,
  selectedEquipment,
  onEquipmentChange,
}: RoomFilterProps) {
  return (
    <div
      css={css`
        display: flex;
        gap: ${spacing.lg};
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: ${spacing.md};
      `}
    >
      <label>
        최소 수용인원:
        <select
          value={minCapacity}
          onChange={(e) => onMinCapacityChange(Number(e.target.value))}
          css={css`margin-left: ${spacing.xs};`}
        >
          {MIN_CAPACITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div css={css`display: flex; align-items: center; gap: ${spacing.sm};`}>
        장비:
        <CheckboxGroup
          options={equipmentOptions}
          selected={selectedEquipment}
          onChange={onEquipmentChange}
        />
      </div>
    </div>
  );
}
