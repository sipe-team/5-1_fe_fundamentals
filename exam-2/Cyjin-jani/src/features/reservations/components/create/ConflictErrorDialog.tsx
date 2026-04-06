import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import type { ConflictError } from '@/features/reservations/types';

interface ConflictErrorDialogProps {
  conflictError: ConflictError | null;
  onClose: () => void;
}

export function ConflictErrorDialog({ conflictError, onClose }: ConflictErrorDialogProps) {
  return (
    <Dialog open={conflictError !== null} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>예약 시간 충돌</DialogTitle>
          <DialogDescription>{conflictError?.message}</DialogDescription>
        </DialogHeader>
        {conflictError?.conflictWith && (
          <div className="rounded-md bg-muted px-4 py-3 text-sm">
            <p className="font-medium">{conflictError.conflictWith.title}</p>
            <p className="text-muted-foreground">
              {conflictError.conflictWith.startTime} ~ {conflictError.conflictWith.endTime}
            </p>
          </div>
        )}
        <DialogFooter>
          <Button onClick={onClose}>확인</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
