import { useQueryStates } from "nuqs";
import {
  getTimelineSearchValues,
  normalizeTimelineSearch,
  serializeCreateReservationSearch,
  serializeTimelineSearch,
  timelineSearchParsers,
} from "@/reservation/searchParams";
import type { Equipment } from "@/reservation/types";
import { todayString } from "@/reservation/utils/reservationTime";

export function useTimelineSearch() {
  const [timelineSearch, setTimelineSearch] = useQueryStates(
    timelineSearchParsers,
  );
  const normalizedTimelineSearch = normalizeTimelineSearch(timelineSearch);

  const date = normalizedTimelineSearch.date ?? todayString();
  const minCapacity = normalizedTimelineSearch.minCapacity ?? 0;
  const equipment = normalizedTimelineSearch.equipment ?? "";
  const selectedEquipment = normalizedTimelineSearch.selectedEquipment;
  const values = getTimelineSearchValues({
    date,
    minCapacity,
    equipment,
  });

  return {
    date,
    minCapacity,
    selectedEquipment,
    timelinePath: serializeTimelineSearch("/", values),
    setDate(date: string) {
      setTimelineSearch({ date });
    },
    setMinCapacity(minCapacity: number) {
      setTimelineSearch({ minCapacity: minCapacity || null });
    },
    setEquipment(equipment: Equipment[]) {
      setTimelineSearch({
        equipment: equipment.length > 0 ? equipment.join(",") : null,
      });
    },
    buildCreateReservationPath(roomId: string, startTime: string) {
      return serializeCreateReservationSearch("/reservations/new", {
        ...values,
        roomId,
        startTime,
      });
    },
  };
}
