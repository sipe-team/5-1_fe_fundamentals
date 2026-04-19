import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelOrder } from '@/domains/orders/apis';
import useOrder from '@/domains/orders/hooks/useOrder';
import useOrders from '@/domains/orders/hooks/useOrders';

export default function useCancelOrderMutation(orderId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelOrder(orderId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: useOrders.getQueryKeys(),
      });
      void queryClient.invalidateQueries({
        queryKey: useOrder.getQueryKeys(orderId),
      });
    },
  });
}
