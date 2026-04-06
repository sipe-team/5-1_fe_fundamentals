import { css } from '@emotion/react';
import {
  ALL_EQUIPMENT,
  EQUIPMENT_LABELS,
  MIN_CAPACITY_OPTIONS,
} from '@/reservation/constants';
import type { Equipment } from '@/reservation/types';

interface RoomFilterProps {
  minCapacity: number;
  onMinCapacityChange: (value: number) => void;
  selectedEquipment: Equipment[];
  onEquipmentChange: (equipment: Equipment[]) => void;
}

export function RoomFilter({
  minCapacity,
  onMinCapacityChange,
  selectedEquipment,
  onEquipmentChange,
}: RoomFilterProps) {
  const handleEquipmentToggle = (eq: Equipment) => {
    if (selectedEquipment.includes(eq)) {
      onEquipmentChange(selectedEquipment.filter((e) => e !== eq));
    } else {
      onEquipmentChange([...selectedEquipment, eq]);
    }
  };

  return (
    <div
      css={css`
        display: flex;
        gap: 16px;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 12px;
      `}
    >
      <label>
        최소 수용인원:
        <select
          value={minCapacity}
          onChange={(e) => onMinCapacityChange(Number(e.target.value))}
          css={css`
            margin-left: 4px;
          `}
        >
          {MIN_CAPACITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <div
        css={css`
          display: flex;
          gap: 8px;
          align-items: center;
        `}
      >
        장비:
        {ALL_EQUIPMENT.map((eq) => (
          <label
            key={eq}
            css={css`
              display: flex;
              align-items: center;
              gap: 2px;
            `}
          >
            <input
              type="checkbox"
              checked={selectedEquipment.includes(eq)}
              onChange={() => handleEquipmentToggle(eq)}
            />
            {EQUIPMENT_LABELS[eq]}
          </label>
        ))}
      </div>
    </div>
  );
}
