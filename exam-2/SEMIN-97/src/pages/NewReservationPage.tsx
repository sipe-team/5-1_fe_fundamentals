import { Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getTodayString } from '@/utils/time.ts'
import Layout from '@/components/layout/Layout.tsx'
import LoadingFallback from '@/components/common/LoadingFallback.tsx'
import ReservationForm from '@/components/reservation/ReservationForm.tsx'

export default function NewReservationPage() {
  const [searchParams] = useSearchParams()
  const initialValues = {
    roomId: searchParams.get('roomId') ?? '',
    date: searchParams.get('date') ?? getTodayString(),
    startTime: searchParams.get('startTime') ?? '',
  }

  return (
    <Layout title="회의실 예약">
      <Suspense fallback={<LoadingFallback />}>
        <ReservationForm initialValues={initialValues} />
      </Suspense>
    </Layout>
  )
}
