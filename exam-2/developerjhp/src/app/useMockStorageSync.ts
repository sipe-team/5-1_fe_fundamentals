import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { subscribeMockStorage } from '@/mocks/storage';

export function useMockStorageSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    return subscribeMockStorage(() => {
      queryClient.invalidateQueries();
    });
  }, [queryClient]);
}
