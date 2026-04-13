import { useMutation } from '@tanstack/react-query';
import { createOrder } from '@/api/createOrder';

export function useCreateOrder() {
  return useMutation({
    mutationFn: createOrder,
  });
}
