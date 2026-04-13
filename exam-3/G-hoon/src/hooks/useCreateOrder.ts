import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createOrder } from '@/api/createOrder';
import { ApiError } from '@/api/error';

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.status >= 500) {
          toast.error('일시적인 오류입니다. 잠시 후 다시 시도해주세요.');
          return;
        }
        toast.error(error.message);
        return;
      }
      toast.error('주문에 실패했습니다. 다시 시도해주세요.');
    },
  });
}
