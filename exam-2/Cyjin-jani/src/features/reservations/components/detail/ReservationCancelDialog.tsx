import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';

interface ReservationCancelDialogProps {
  open: boolean;
  isPending: boolean;
  reservationTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ReservationCancelDialog({
  open,
  isPending,
  reservationTitle,
  onClose,
  onConfirm,
}: ReservationCancelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>예약을 취소하시겠습니까?</DialogTitle>
          <DialogDescription>
            <span className="font-medium text-foreground">{reservationTitle}</span> 예약을 취소하면
            되돌릴 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            닫기
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
            {isPending ? '취소 중...' : '예약 취소'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
