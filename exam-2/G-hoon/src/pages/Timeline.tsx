import { QueryErrorResetBoundary } from '@tanstack/react-query';
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates,
} from 'nuqs';
import { Suspense, useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  DatePicker,
  RoomFilter,
  TimelineBody,
  TimelineGrid,
} from '@/features/timeline/components';
import { TIME_SLOTS_LENGTH } from '@/features/timeline/constants';
import { useRooms } from '@/features/timeline/hooks';
import { createRoomFilter } from '@/features/timeline/utils/roomFilter';
import type { Equipment } from '@/types/reservation';

const TOTAL_COLUMNS = TIME_SLOTS_LENGTH + 1;

function LoadingBody() {
  return (
    <tbody>
      <tr>
        <td colSpan={TOTAL_COLUMNS} className="py-12">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
          </div>
        </td>
      </tr>
    </tbody>
  );
}

function ErrorBody({ onReset }: { onReset: () => void }) {
  return (
    <tbody>
      <tr>
        <td colSpan={TOTAL_COLUMNS} className="py-12">
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-slate-500">
              데이터를 불러오는데 실패했습니다.
            </p>
            <button
              type="button"
              onClick={onReset}
              className="text-sm px-5 py-2 rounded-md bg-slate-900 text-white font-medium hover:bg-slate-800 transition-colors"
            >
              다시 시도
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  );
}

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

const timelineParams = {
  date: parseAsString.withDefault(getToday()),
  floor: parseAsInteger,
  capacity: parseAsInteger.withDefault(0),
  equipment: parseAsArrayOf(parseAsString).withDefault([]),
};

export default function Timeline() {
  const [filters, setFilters] = useQueryStates(timelineParams, {
    shallow: false,
  });

  const date = filters.date;
  const selectedFloor = filters.floor;
  const minCapacity = filters.capacity;
  const selectedEquipment = filters.equipment as Equipment[];

  const filterRooms = useMemo(
    () =>
      createRoomFilter({
        floor: selectedFloor,
        capacity: minCapacity,
        equipment: selectedEquipment,
      }),
    [selectedFloor, minCapacity, selectedEquipment],
  );

  const { data: rooms } = useRooms();

  const floors = useMemo(() => {
    return [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b);
  }, [rooms]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <DatePicker value={date} onChange={(v) => setFilters({ date: v })} />
        <RoomFilter>
          <RoomFilter.Floor
            floors={floors}
            value={selectedFloor}
            onChange={(v) => setFilters({ floor: v })}
          />
          <RoomFilter.Capacity
            value={minCapacity}
            onChange={(v) => setFilters({ capacity: v })}
          />
          <RoomFilter.Equipment
            value={selectedEquipment}
            onChange={(v) => setFilters({ equipment: v })}
          />
        </RoomFilter>
      </div>

      <TimelineGrid>
        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              onReset={reset}
              resetKeys={[date]}
              fallbackRender={({ resetErrorBoundary }) => (
                <ErrorBody onReset={resetErrorBoundary} />
              )}
            >
              <Suspense fallback={<LoadingBody />}>
                <TimelineBody date={date} filterRooms={filterRooms} />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </TimelineGrid>
    </div>
  );
}
