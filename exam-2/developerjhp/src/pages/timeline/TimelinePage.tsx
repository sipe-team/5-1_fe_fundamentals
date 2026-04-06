import { ErrorBoundaryGroup } from "@suspensive/react";
import { SuspenseQuery } from "@suspensive/react-query-5";
import { css } from "@emotion/react";
import { useNavigate } from "react-router";
import { RoomFilter } from "@/pages/timeline/RoomFilter";
import { Timeline } from "@/pages/timeline/Timeline";
import { useTimelineSearch } from "@/pages/timeline/useTimelineSearch";
import { roomsQueryOptions } from "@/reservation/api/rooms";
import { reservationsQueryOptions } from "@/reservation/api/reservations";
import { filterRooms } from "@/reservation/utils/room";
import { AsyncBoundary } from "@/components/AsyncBoundary";
import { spacing } from "@/styles/tokens";

export function TimelinePage() {
  const navigate = useNavigate();
  const {
    date,
    minCapacity,
    selectedEquipment,
    timelinePath,
    setDate,
    setMinCapacity,
    setEquipment,
    buildCreateReservationPath,
  } = useTimelineSearch();

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
            onChange={(e) => setDate(e.target.value)}
            css={css`
              margin-left: ${spacing.sm};
            `}
          />
        </label>
      </div>
      <RoomFilter
        minCapacity={minCapacity}
        onMinCapacityChange={setMinCapacity}
        selectedEquipment={selectedEquipment}
        onEquipmentChange={setEquipment}
      />
      <ErrorBoundaryGroup>
        <AsyncBoundary>
          <SuspenseQuery {...roomsQueryOptions()}>
            {({ data: { rooms } }) => (
              <SuspenseQuery {...reservationsQueryOptions(date)}>
                {({ data: { reservations } }) => (
                  <Timeline
                    rooms={filterRooms(rooms, minCapacity, selectedEquipment)}
                    reservations={reservations}
                    onReservationClick={(id) =>
                      navigate(`/reservations/${id}`, {
                        state: { from: timelinePath },
                      })
                    }
                    onEmptySlotClick={(roomId, startTime) =>
                      navigate(buildCreateReservationPath(roomId, startTime))
                    }
                  />
                )}
              </SuspenseQuery>
            )}
          </SuspenseQuery>
        </AsyncBoundary>
      </ErrorBoundaryGroup>
    </div>
  );
}
