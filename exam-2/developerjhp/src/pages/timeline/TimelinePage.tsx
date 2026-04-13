import { SuspenseQueries } from "@suspensive/react-query-5";
import { css } from "@emotion/react";
import { useQueryStates } from "nuqs";
import { useNavigate } from "react-router";
import { RoomFilter } from "@/pages/timeline/RoomFilter";
import { Timeline } from "@/pages/timeline/Timeline";
import { roomsQueryOptions } from "@/reservation/api/rooms";
import { reservationsQueryOptions } from "@/reservation/api/reservations";
import {
  normalizeTimelineSearch,
  serializeCreateReservationSearch,
  serializeTimelineSearch,
  timelineSearchParsers,
} from "@/reservation/searchParams";
import type { Equipment } from "@/reservation/types";
import { filterRooms } from "@/reservation/utils/room";
import { todayString } from "@/reservation/utils/time";
import { AsyncBoundary } from "@/components/AsyncBoundary";
import { spacing } from "@/styles/tokens";

export function TimelinePage() {
  const navigate = useNavigate();
  const [timelineSearch, setTimelineSearch] = useQueryStates(
    timelineSearchParsers,
  );
  const normalizedTimelineSearch = normalizeTimelineSearch(timelineSearch);
  const date = normalizedTimelineSearch.date ?? todayString();
  const minCapacity = normalizedTimelineSearch.minCapacity ?? 0;
  const equipment = normalizedTimelineSearch.equipment ?? "";
  const selectedEquipment = normalizedTimelineSearch.selectedEquipment;
  const timelinePath = serializeTimelineSearch("/", {
    date,
    minCapacity: minCapacity > 0 ? minCapacity : null,
    equipment: equipment || null,
  });

  return (
    <div>
      <h1
        css={css`
          margin-bottom: ${spacing.md};
        `}
      >
        회의실 예약 현황
      </h1>
      <div
        css={css`
          margin-bottom: ${spacing.md};
        `}
      >
        <label>
          날짜:
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setTimelineSearch({ date: e.target.value });
            }}
            css={css`
              margin-left: ${spacing.sm};
            `}
          />
        </label>
      </div>
      <RoomFilter
        minCapacity={minCapacity}
        onMinCapacityChange={(nextMinCapacity) => {
          setTimelineSearch({ minCapacity: nextMinCapacity || null });
        }}
        selectedEquipment={selectedEquipment}
        onEquipmentChange={(nextEquipment: Equipment[]) => {
          setTimelineSearch({
            equipment:
              nextEquipment.length > 0 ? nextEquipment.join(",") : null,
          });
        }}
      />
      <AsyncBoundary pendingFallback={<p>회의실 예약 현황을 불러오는 중입니다.</p>}>
        <SuspenseQueries
          queries={[roomsQueryOptions(), reservationsQueryOptions(date)]}
        >
          {([{ data: { rooms } }, { data: { reservations } }]) => (
            <Timeline
              rooms={filterRooms(rooms, minCapacity, selectedEquipment)}
              reservations={reservations}
              onReservationClick={(id) =>
                navigate(`/reservations/${id}`, {
                  state: { from: timelinePath },
                })
              }
              onEmptySlotClick={(roomId, startTime) => {
                navigate(
                  serializeCreateReservationSearch("/reservations/new", {
                    date,
                    minCapacity: minCapacity > 0 ? minCapacity : null,
                    equipment: equipment || null,
                    roomId,
                    startTime,
                  }),
                );
              }}
            />
          )}
        </SuspenseQueries>
      </AsyncBoundary>
    </div>
  );
}
