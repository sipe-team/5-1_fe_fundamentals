import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useNavigate, useParams } from 'react-router-dom'
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { useDeleteReservation, useReservation } from '@/hooks/useRooms.ts'
import Layout from '@/components/layout/Layout.tsx'
import LoadingFallback from '@/components/common/LoadingFallback.tsx'
import ErrorFallback from '@/components/common/ErrorFallback.tsx'

function ReservationDetailContent() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data } = useReservation(id!)
  const { reservation } = data
  const { mutateAsync, isPending } = useDeleteReservation()

  async function handleCancel() {
    const confirmed = window.confirm('예약을 취소하시겠어요?')
    if (!confirmed) return

    await mutateAsync({ id: reservation.id, date: reservation.date })
    navigate(-1)
  }

  return (
    <div className="max-w-lg flex flex-col gap-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">회의 제목</span>
          <span className="text-lg font-semibold text-gray-900">{reservation.title}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">회의실</span>
          <span className="text-sm text-gray-700">{reservation.roomId}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">날짜</span>
          <span className="text-sm text-gray-700">{reservation.date}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">시간</span>
          <span className="text-sm text-gray-700">{reservation.startTime} ~ {reservation.endTime}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">예약자</span>
          <span className="text-sm text-gray-700">{reservation.organizer}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-400">참석 인원</span>
          <span className="text-sm text-gray-700">{reservation.attendees}명</span>
        </div>
      </div>

      <button
        onClick={handleCancel}
        disabled={isPending}
        className="bg-red-500 hover:enabled:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        예약 취소
      </button>
    </div>
  )
}

function ReservationDetailPage() {
  return (
    <Layout title="예약 상세">
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
            <Suspense fallback={<LoadingFallback />}>
              <ReservationDetailContent />
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </Layout>
  )
}

export default ReservationDetailPage
