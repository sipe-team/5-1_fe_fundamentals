import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ConflictError } from '@/types/reservation.ts'
import { useCreateReservation, useRooms } from '@/hooks/useRooms.ts'

interface Props {
  initialValues: {
    roomId: string
    date: string
    startTime: string
  }
}

const schema = z.object({
  roomId: z.string().min(1, '회의실을 선택해주세요'),
  date: z.string().min(1, '날짜를 선택해주세요'),
  startTime: z.string().min(1, '시작 시간을 선택해주세요'),
  endTime: z.string().min(1, '종료 시간을 선택해주세요'),
  title: z.string().trim().min(1, '회의 제목을 입력해주세요'),
  organizer: z.string().trim().min(1, '예약자명을 입력해주세요'),
  attendees: z.number().min(1, '참석 인원은 1명 이상이어야 해요'),
})
  .refine(data => data.startTime < data.endTime, {
    message: '종료 시간은 시작 시간보다 이후여야 해요',
    path: ['endTime'],
  })
  .refine(data => {
    const now = new Date()
    const selected = new Date(`${data.date}T${data.startTime}`)
    return selected > now
  }, {
    message: '과거 시간은 예약할 수 없어요',
    path: ['startTime'],
  })

type FormValues = z.infer<typeof schema>

function ReservationForm({ initialValues }: Props) {
  const navigate = useNavigate()
  const { mutateAsync, isPending } = useCreateReservation()
  const [conflictError, setConflictError] = useState<ConflictError | null>(null)
  const { data: roomsData } = useRooms()

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      roomId: initialValues.roomId,
      date: initialValues.date,
      startTime: initialValues.startTime,
      endTime: '',
      title: '',
      organizer: '',
      attendees: 1,
    }
  })

  async function onSubmit(data: FormValues) {
    setConflictError(null)
    try {
      await mutateAsync(data)
      navigate('/')
    } catch (e: any) {
      if (e.status === 409) setConflictError(e)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg flex flex-col gap-4">

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          회의실 <span className="text-red-500">*</span>
        </label>
        <select {...register('roomId')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
          <option value="" disabled hidden>회의실 선택</option>
          {roomsData.rooms.map(room => (
            <option key={room.id} value={room.id}>{room.name}</option>
          ))}
        </select>
        {errors.roomId && <p className="text-xs text-red-500">{errors.roomId.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          날짜 <span className="text-red-500">*</span>
        </label>
        <input type="date" {...register('date')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          시작 시간 <span className="text-red-500">*</span>
        </label>
        <input type="time" step="1800" min="09:00" max="17:30" {...register('startTime')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <p className="text-xs text-gray-400">30분 단위로 입력해주세요 (예: 09:00, 09:30)</p>
        {errors.startTime && <p className="text-xs text-red-500">{errors.startTime.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          종료 시간 <span className="text-red-500">*</span>
        </label>
        <input type="time" min="09:30" max="18:00" {...register('endTime')} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        <p className="text-xs text-gray-400">30분 단위로 입력해주세요 (예: 09:00, 09:30)</p>
        {errors.endTime && <p className="text-xs text-red-500">{errors.endTime.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          회의 제목 <span className="text-red-500">*</span>
        </label>
        <input type="text" {...register('title')} placeholder="회의 제목 입력" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          예약자명 <span className="text-red-500">*</span>
        </label>
        <input type="text" {...register('organizer')} placeholder="예약자명 입력" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        {errors.organizer && <p className="text-xs text-red-500">{errors.organizer.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          참석 인원 <span className="text-red-500">*</span>
        </label>
        <input type="number" {...register('attendees')} min={1} className="border border-gray-300 rounded-lg px-3 py-2 text-sm" />
        {errors.attendees && <p className="text-xs text-red-500">{errors.attendees.message}</p>}
      </div>

      {conflictError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          <p className="font-medium">{conflictError.message}</p>
          <p className="mt-1 text-xs">
            {conflictError.conflictWith.title} ({conflictError.conflictWith.startTime} ~ {conflictError.conflictWith.endTime})
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 hover:enabled:bg-blue-600 text-white font-medium py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        예약하기
      </button>

    </form>
  )
}

export default ReservationForm
