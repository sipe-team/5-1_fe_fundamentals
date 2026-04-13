import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useNavigate } from 'react-router-dom'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { useMyReservations } from '@/hooks/useRooms.ts'
import Layout from '@/components/layout/Layout.tsx'
import LoadingFallback from '@/components/common/LoadingFallback.tsx'
import ErrorFallback from '@/components/common/ErrorFallback.tsx'

function MyReservationsContent() {
  const navigate = useNavigate()
  const { data } = useMyReservations()
  const { reservations } = data

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-gray-400">
        <p className="text-lg font-medium">예약 내역이 없어요</p>

        <button
          onClick={() => navigate('/reservations/new')}
          className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 cursor-pointer"
        >
          예약하러 가기
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg flex flex-col gap-3">
      {reservations.map(reservation => (
        <div
          key={reservation.id}
          onClick={() => navigate(`/reservations/${reservation.id}`)}
          className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-1 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-900">{reservation.title}</span>
          <span className="text-xs text-gray-500">{reservation.date} · {reservation.startTime} ~ {reservation.endTime}</span>
          <span className="text-xs text-gray-400">{reservation.roomId} · {reservation.organizer}</span>
        </div>
      ))}
    </div>
  )
}

function MyReservationsPage() {
  return (
    <Layout title="내 예약 목록">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
            <Suspense fallback={<LoadingFallback />}>
              <MyReservationsContent />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Layout>
  )
}

export default MyReservationsPage
