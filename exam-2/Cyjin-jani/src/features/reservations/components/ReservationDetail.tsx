import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CalendarIcon, ClockIcon, UserIcon, UsersIcon, BuildingIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useReservation } from '@/features/reservations/hooks/queries/useReservation';
import { useDeleteReservation } from '@/features/reservations/hooks/queries/useDeleteReservation';
import { reservationsQueryKeys } from '@/features/reservations/hooks/queries/querykeys';
import { useRooms } from '@/features/rooms/hooks/queries/useRooms';

interface ReservationDetailProps {
  id: string;
}

export function ReservationDetail({ id }: ReservationDetailProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: reservation } = useReservation(id);
  const { data: rooms } = useRooms();

  const roomName = rooms.find((r) => r.id === reservation.roomId)?.name ?? reservation.roomId;

  const { mutate: deleteReservation, isPending } = useDeleteReservation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.allByDate(reservation.date),
      });
      queryClient.removeQueries({
        queryKey: reservationsQueryKeys.detailById(id),
      });
      toast.success('예약이 취소되었습니다.');
      navigate(-1);
    },
    onError: () => {
      toast.error('예약 취소에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  const handleConfirmCancel = () => {
    deleteReservation(id);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-lg rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold">{reservation.title}</h2>

        <dl className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <BuildingIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <dt className="w-20 shrink-0 text-sm text-muted-foreground">회의실</dt>
            <dd className="text-sm font-medium">{roomName}</dd>
          </div>

          <div className="flex items-center gap-3">
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <dt className="w-20 shrink-0 text-sm text-muted-foreground">날짜</dt>
            <dd className="text-sm font-medium">{reservation.date}</dd>
          </div>

          <div className="flex items-center gap-3">
            <ClockIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <dt className="w-20 shrink-0 text-sm text-muted-foreground">시간</dt>
            <dd className="text-sm font-medium">
              {reservation.startTime} ~ {reservation.endTime}
            </dd>
          </div>

          <div className="flex items-center gap-3">
            <UserIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <dt className="w-20 shrink-0 text-sm text-muted-foreground">예약자</dt>
            <dd className="text-sm font-medium">{reservation.organizer}</dd>
          </div>

          <div className="flex items-center gap-3">
            <UsersIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <dt className="w-20 shrink-0 text-sm text-muted-foreground">참석 인원</dt>
            <dd className="text-sm font-medium">{reservation.attendees}명</dd>
          </div>
        </dl>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={() => navigate(-1)}>
            뒤로 가기
          </Button>
          <Button variant="destructive" onClick={() => setIsDialogOpen(true)}>
            예약 취소
          </Button>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>예약을 취소하시겠습니까?</DialogTitle>
            <DialogDescription>
              <span className="font-medium text-foreground">{reservation.title}</span> 예약을
              취소하면 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>
              닫기
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel} disabled={isPending}>
              {isPending ? '취소 중...' : '예약 취소'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
