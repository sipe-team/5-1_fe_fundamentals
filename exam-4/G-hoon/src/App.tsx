import { QueryClientProvider } from '@tanstack/react-query';
import { NuqsAdapter } from 'nuqs/adapters/react';
import { queryClient } from '@/app/queryClient';
import { DashboardPage } from '@/pages/DashboardPage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NuqsAdapter>
        <DashboardPage />
      </NuqsAdapter>
    </QueryClientProvider>
  );
}

export default App;
