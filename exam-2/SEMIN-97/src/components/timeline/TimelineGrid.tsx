import { useNavigate } from 'react-router-dom'
import type { Reservation, Room } from '@/types/reservation.ts'
import { timeToMinutes } from '@/utils/time.ts'

const TIMELINE_START = 9 * 60
const TIMELINE_TOTAL = 9 * 60
const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => {
  const hour = Math.floor(i / 2) + 9
  const minute = i % 2 === 0 ? '00' : '30'
  return `${String(hour).padStart(2, '0')}:${minute}`
})

function getPositionPercent(time: string): number {
  return ((timeToMinutes(time) - TIMELINE_START) / TIMELINE_TOTAL) * 100
}

function getDurationPercent(startTime: string, endTime: string): number {
  return ((timeToMinutes(endTime) - timeToMinutes(startTime)) / TIMELINE_TOTAL) * 100
}

interface Props {
  rooms: Room[]
  reservations: Reservation[]
  date: string
}

function TimelineGrid({ rooms, reservations, date }: Props) {
  const navigate = useNavigate()

  return (
    <div>
      {/* 타임라인 헤더 */}
      <div className="flex">
        <div className="min-w-30" />
        <div className="relative flex">
          {TIME_SLOTS.map(slot => (
            <div key={slot} className="min-w-20">
              {slot.endsWith(':00') && (
                <span className="flex justify-center w-0 text-xs text-gray-500">
                  {slot}
                </span>
              )}
            </div>
          ))}
          <span className="flex justify-center w-0 text-xs text-gray-500">
            18:00
          </span>
        </div>
      </div>

      {/* 타임라인 바디 */}
      <div className="w-fit border border-gray-200 rounded-lg">
        {rooms.map(room => {
          const roomReservations = reservations.filter(r => r.roomId === room.id)

          return (
            <div key={room.id} className="flex border-b border-gray-200 last:border-b-0">
              {/* 회의실 이름 */}
              <div className="flex flex-col justify-center min-w-30 px-3 py-2 border-r border-gray-200 bg-gray-50">
                <span className="text-sm font-medium text-gray-800">{room.name}</span>
                <span className="text-xs text-gray-400">{room.floor}F · {room.capacity}인</span>
              </div>

              <div className="relative flex flex-1">
                {/* 빈 셀들 */}
                {TIME_SLOTS.map((slot, i) => (
                  <div
                    key={slot}
                    onClick={() => navigate(`/reservations/new?roomId=${room.id}&date=${date}&startTime=${slot}`)}
                    className={`min-w-20 flex-1 cursor-pointer ${i < TIME_SLOTS.length - 1 ? 'border-r border-gray-200' : ''}`}
                  />
                ))}

                {/* 예약 블록 */}
                {roomReservations.map(reservation => (
                  <div
                    key={reservation.id}
                    onClick={() => navigate(`/reservations/${reservation.id}`)}
                    className="absolute top-1 bottom-1 rounded bg-blue-500 hover:bg-blue-600 cursor-pointer transition-colors flex items-center px-2 overflow-hidden"
                    style={{
                      left: `${getPositionPercent(reservation.startTime)}%`,
                      width: `${getDurationPercent(reservation.startTime, reservation.endTime)}%`,
                    }}
                  >
                    <span className="text-white text-xs font-medium truncate">
                      {reservation.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TimelineGrid
