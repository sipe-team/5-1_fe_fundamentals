export function OrderDetailSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      {/* 메뉴 정보 헤더 */}
      <div className="bg-white px-4 pb-4 pt-5">
        <div className="flex items-start gap-4">
          <div className="h-24 w-24 shrink-0 rounded-xl bg-gray-200" />
          <div className="min-w-0 flex-1 space-y-3 py-1">
            <div className="h-6 w-32 rounded bg-gray-200" />
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-6 w-20 rounded bg-gray-200" />
          </div>
        </div>
      </div>

      {/* 옵션 영역 */}
      <div className="flex flex-col gap-5 px-4 py-5">
        {/* grid 옵션 */}
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-20 rounded-lg bg-gray-100" />
            <div className="h-20 rounded-lg bg-gray-100" />
          </div>
        </div>

        {/* grid 옵션 2 */}
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-20 rounded-lg bg-gray-100" />
            <div className="h-20 rounded-lg bg-gray-100" />
            <div className="h-20 rounded-lg bg-gray-100" />
          </div>
        </div>

        {/* select 옵션 */}
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-12 rounded-lg bg-gray-100" />
        </div>

        {/* list 옵션 */}
        <div className="space-y-2">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="divide-y divide-gray-50 rounded-lg border border-gray-200">
            <div className="h-12 px-4 py-3" />
            <div className="h-12 px-4 py-3" />
            <div className="h-12 px-4 py-3" />
          </div>
        </div>
      </div>

      {/* 수량 영역 */}
      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-4">
        <div className="h-4 w-10 rounded bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-100" />
          <div className="h-4 w-8 rounded bg-gray-200" />
          <div className="h-8 w-8 rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
