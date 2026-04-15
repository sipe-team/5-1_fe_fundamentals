import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postOrder } from '@/domains/orders/apis';
import useOrders from '@/domains/orders/hooks/useOrders';

export default function useCreateOrderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: useOrders.getQueryKeys(),
      });
    },
  });
}
