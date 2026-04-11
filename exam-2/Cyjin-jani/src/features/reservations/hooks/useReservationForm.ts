import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useQueryClient } from '@tanstack/react-query';
import { HTTPError } from 'ky';
import { toast } from 'sonner';
import { useCreateReservation } from '@/features/reservations/hooks/queries/useCreateReservation';
import { reservationsQueryKeys } from '@/features/reservations/hooks/queries/querykeys';
import type { ConflictError } from '@/features/reservations/types';
import { reservationFormSchema } from '../components/create/reservationFormSchema';
import type { ReservationFormValues } from '../components/create/reservationFormSchema';
import { myQueryKeys } from '@/features/my/hooks/queries/querykeys';

interface UseReservationFormParams {
  defaultRoomId: string;
  defaultDate: string;
  defaultStartTime: string;
}

export function useReservationForm({
  defaultRoomId,
  defaultDate,
  defaultStartTime,
}: UseReservationFormParams) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [conflictError, setConflictError] = useState<ConflictError | null>(null);

  const { mutate: createReservation, isPending } = useCreateReservation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: reservationsQueryKeys.allByDate(data.reservation.date),
      });
      queryClient.invalidateQueries({ queryKey: myQueryKeys.reservations() });
      toast.success('예약이 생성되었습니다.');
      navigate(`/?date=${data.reservation.date}`);
    },
    onError: async (error) => {
      if (error instanceof HTTPError && error.response.status === 409) {
        const conflict = await error.response.json<ConflictError>();
        setConflictError(conflict);
        return;
      }
      toast.error('예약 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      roomId: defaultRoomId,
      date: defaultDate,
      startTime: defaultStartTime,
      endTime: '',
      title: '',
      organizer: '',
      attendees: 1,
    },
  });

  const onSubmit = (data: ReservationFormValues) => {
    createReservation(data);
  };

  const clearConflictError = () => setConflictError(null);

  return {
    register,
    handleSubmit,
    control,
    errors,
    onSubmit,
    isPending,
    conflictError,
    clearConflictError,
  };
}
