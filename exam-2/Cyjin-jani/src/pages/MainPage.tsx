import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSearchParams } from 'react-router-dom';
import { QueryErrorResetBoundary } from '@tanstack/react-query';

import { DateNavigator } from '@/features/reservations/components/DateNavigator';
import { TimelineTable } from '@/features/reservations/components/TimelineTable';
import { RoomsFilter } from '@/features/rooms/components/RoomsFilter';
import type { Equipment } from '@/features/rooms/types';
import { formatLocalDate } from '@/lib/dateFormat';
import { LoadingFallback } from '@/shared/components/LoadingFallback';
import { QueryErrorFallback } from '@/shared/components/QueryErrorFallback';

export function MainPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const today = formatLocalDate(new Date());
  const selectedDate = searchParams.get('date') ?? today;

  const capacityParam = searchParams.get('capacity');
  const selectedCapacity = capacityParam !== null ? Number(capacityParam) : null;
  const selectedEquipment = searchParams.getAll('equipment') as Equipment[];

  const updateParams = (updates: Record<string, string | string[]>) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      next.delete(key);
      if (Array.isArray(value)) {
        value.forEach((v) => next.append(key, v));
      } else if (value !== '') {
        next.set(key, value);
      }
    });

    setSearchParams(next);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateParams({ date: e.target.value });
  };

  const moveDate = (offset: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + offset);
    updateParams({ date: formatLocalDate(next) });
  };

  const handleCapacityChange = (value: number | null) => {
    updateParams({ capacity: value !== null ? String(value) : '' });
  };

  const handleEquipmentChange = (value: Equipment[]) => {
    updateParams({ equipment: value });
  };

  return (
    <main className="flex flex-col items-center w-full h-dvh overflow-hidden mx-auto max-w-[1600px] px-6 py-6">
      <h1 className="mb-6 text-2xl font-bold">회의실 예약 현황</h1>

      <DateNavigator date={selectedDate} onDateChange={handleDateChange} onMove={moveDate} />

      <div className="mb-4 w-full flex justify-center">
        <RoomsFilter
          capacity={selectedCapacity}
          equipment={selectedEquipment}
          onCapacityChange={handleCapacityChange}
          onEquipmentChange={handleEquipmentChange}
        />
      </div>

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary
            resetKeys={[selectedDate]}
            onReset={reset}
            FallbackComponent={QueryErrorFallback}
          >
            <Suspense fallback={<LoadingFallback />}>
              <TimelineTable
                date={selectedDate}
                capacity={selectedCapacity}
                equipment={selectedEquipment}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </main>
  );
}
