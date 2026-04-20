import { Dashboard } from '@/components/dashboard/Dashboard';
import { MemberSidePanel } from '@/components/MemberSidePanel';
import { MemberSelectionProvider } from '@/contexts/MemberSelectionContext';

function App() {
  return (
    <MemberSelectionProvider>
      <div className="flex h-dvh overflow-hidden bg-neutral-50">
        <MemberSidePanel />
        <main className="flex min-h-0 flex-1 p-6">
          <Dashboard />
        </main>
      </div>
    </MemberSelectionProvider>
  );
}

export default App;
