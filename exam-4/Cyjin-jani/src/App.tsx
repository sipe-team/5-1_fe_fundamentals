import { MembersSidebar } from '@/components/MembersSidebar';

function App() {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="flex w-64 shrink-0 flex-col border-r border-neutral-200 bg-white">
        <header className="border-b border-neutral-200 px-3 py-3">
          <h2 className="text-sm font-semibold text-neutral-900">스터디원</h2>
        </header>
        <MembersSidebar />
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-lg font-semibold text-neutral-900">대시보드</h1>
        <p className="mt-2 text-sm text-neutral-600">
          우측 영역은 이후 단계에서 구성합니다.
        </p>
      </main>
    </div>
  );
}

export default App;
