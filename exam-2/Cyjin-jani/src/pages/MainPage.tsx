import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useSearchParams } from 'react-router-dom';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { TimelineTable } from '@/features/reservations/components/TimelineTable';
import { RoomsFilter } from '@/features/rooms/components/RoomsFilter';
import { formatLocalDate } from '@/lib/dateFormat';
import { LoadingFallback } from '@/shared/components/LoadingFallback';
import { QueryErrorFallback } from '@/shared/components/QueryErrorFallback';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import type { Equipment } from '@/features/rooms/types';

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

      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="icon" onClick={() => moveDate(-1)} aria-label="이전 날짜">
          <ChevronLeft />
        </Button>

        <div className="flex items-center gap-1.5">
          <Label htmlFor="timeline-date" className="sr-only">
            날짜 선택
          </Label>
          <Input
            id="timeline-date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-40 cursor-pointer"
          />
        </div>

        <Button variant="outline" size="icon" onClick={() => moveDate(1)} aria-label="다음 날짜">
          <ChevronRight />
        </Button>
      </div>

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
            <Suspense key={selectedDate} fallback={<LoadingFallback />}>
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
