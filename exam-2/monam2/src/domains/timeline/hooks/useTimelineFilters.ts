import {
  useQueryStates,
  parseAsInteger,
  parseAsStringLiteral,
  parseAsNativeArrayOf,
} from "nuqs";

import { EQUIPMENT_FILTER_OPTIONS } from "@/shared/constants";
import type { Equipment, Room } from "@/shared/types";

type TimelineFilters = {
  capacity: number | null;
  equipment: Equipment[];
};

// 장비 종류 리터럴 리스트
const EQUIPMENT_VALUES = EQUIPMENT_FILTER_OPTIONS.map((option) => option.value);

export default function useTimelineFilters() {
  const [filters, setFilters] = useQueryStates({
    capacity: parseAsInteger,
    equipment: parseAsNativeArrayOf(parseAsStringLiteral(EQUIPMENT_VALUES)),
  });

  const toggleEquipment = (eqItem: Equipment) => {
    const hasEqItem = filters.equipment.includes(eqItem);
    let nextEquipment: Equipment[];

    if (hasEqItem) {
      nextEquipment = filters.equipment.filter((value) => value !== eqItem);
    } else {
      nextEquipment = [...filters.equipment, eqItem];
    }

    setFilters({
      equipment: nextEquipment.length > 0 ? nextEquipment : null,
    });
  };

  const updateCapacity = (value: string) => {
    const newCapacity = value ? Number(value) : null;

    setFilters({
      capacity: newCapacity,
    });
  };

  const clearFilters = () => {
    setFilters({
      capacity: null,
      equipment: null,
    });
  };

  /**
   *  필터 활성화 상태
   *  - 수용인원이 선택되었거나 장비가 하나라도 선택되었을 때 활성
   */
  const isActiveFilter =
    filters.capacity !== null || filters.equipment.length > 0;

  return {
    filters,
    toggleEquipment,
    updateCapacity,
    clearFilters,
    isActiveFilter,
  };
}

/**
 * 타임라인 필터가 적용된 Room 목록
 * @param rooms 전체 회의실 목록
 * @param filters 필터 조건
 * @returns 필터링된 회의실 목록
 */
export function filterRoomsByTimelineFilters(
  rooms: Room[],
  filters: TimelineFilters,
) {
  return rooms.filter((room) => {
    // 수용인원 필터
    const matchesCapacity =
      filters.capacity === null || room.capacity >= filters.capacity;

    // 장비 필터
    const matchesEquipment = filters.equipment.every((equipment) =>
      room.equipment.includes(equipment),
    );

    return matchesCapacity && matchesEquipment;
  });
}
