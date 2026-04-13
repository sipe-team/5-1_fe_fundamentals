import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import type {Equipment} from '@/types/reservation.ts'
import { getTodayString } from '@/utils/time.ts'
import { useReservations, useRooms } from '@/hooks/useRooms.ts'
import { CAPACITY_OPTIONS, EQUIPMENT_OPTIONS } from '@/constants/filterOptions.ts'
import Layout from '@/components/layout/Layout.tsx'
import ErrorFallback from '@/components/common/ErrorFallback.tsx'
import LoadingFallback from '@/components/common/LoadingFallback.tsx'
import TimelineGrid from '@/components/timeline/TimelineGrid.tsx'

interface TimelineContentProps {
  date: string
  minCapacity: number
  equipment: Equipment | ''
}

function TimelineContent({ date, minCapacity, equipment }: TimelineContentProps) {
  const { data: roomsData } = useRooms()
  const { data: reservationsData } = useReservations(date)

  const filteredRooms = roomsData.rooms.filter(room => {
    if (minCapacity > 0 && room.capacity < minCapacity) {
      return false
    }

    return !(equipment && !room.equipment.includes(equipment));
  })

  return (
    <div className="overflow-x-auto">
      <TimelineGrid
        rooms={filteredRooms}
        reservations={reservationsData.reservations}
        date={date}
      />
    </div>
  )
}

function TimelinePage() {
  const [date, setDate] = useState(getTodayString)
  const [minCapacity, setMinCapacity] = useState(0)
  const [equipment, setEquipment] = useState<Equipment | ''>('')

  return (
    <Layout title="타임라인 페이지">

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={minCapacity}
          onChange={e => setMinCapacity(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          {CAPACITY_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <select
          value={equipment}
          onChange={e => setEquipment(e.target.value as Equipment | '')}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          {EQUIPMENT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <QueryErrorResetBoundary>
        {({reset}) => (
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
            <Suspense fallback={<LoadingFallback/>}>
              <TimelineContent date={date} minCapacity={minCapacity} equipment={equipment} />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Layout>
  );
}

export default TimelinePage
