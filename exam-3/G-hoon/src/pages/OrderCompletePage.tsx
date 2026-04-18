import { CheckCircle, SearchX } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@/api/error';
import { AsyncQueryBoundary } from '@/components/common/AsyncQueryBoundary';
import { BottomCTA, BottomCTASpacer } from '@/components/common/BottomCTA';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useOrder } from '@/hooks/useOrder';
import { formatPrice } from '@/lib/formatters';
import type { OrderStatus } from '@/types/order';

const ORDER_STATUS_MESSAGE: Record<OrderStatus, string> = {
  pending: '주문이 접수되었어요',
  preparing: '주문을 준비하고 있어요',
  completed: '주문이 완료되었어요',
  cancelled: '취소된 주문입니다',
};

export function OrderCompletePage() {
  const { orderId } = useParams<{ orderId: string }>();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <AsyncQueryBoundary
        fallback={<LoadingSpinner message="주문 정보를 불러오는 중..." />}
        errorFallback={(reset, error) => (
          <OrderCompleteErrorFallback error={error} onReset={reset} />
        )}
      >
        <OrderCompleteContent orderId={orderId ?? ''} />
      </AsyncQueryBoundary>
    </main>
  );
}

function OrderCompleteContent({ orderId }: { orderId: string }) {
  const navigate = useNavigate();
  const { data: order } = useOrder(orderId);

  const totalCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <section className="flex flex-col items-center gap-4 px-4 pt-16 pb-8">
        <CheckCircle size={56} className="text-blue-500" />
        <h1 className="text-xl font-bold text-gray-950">
          {ORDER_STATUS_MESSAGE[order.status]}
        </h1>
        <p className="text-sm text-gray-500">주문번호: {order.id}</p>
      </section>

      <section
        aria-label="주문 요약"
        className="mx-4 rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
      >
        <ul className="flex flex-col gap-3">
          {order.items.map((item) => (
            <li
              key={`${item.itemId}-${item.options
                .map((o) => `${o.optionId}:${o.labels.join(',')}`)
                .join('|')}`}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-gray-700">
                {item.title} × {item.quantity}
              </span>
              <span className="font-medium text-gray-900">
                {formatPrice(item.unitPrice * item.quantity)}원
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-sm font-semibold text-gray-900">
            총 {totalCount}개
          </span>
          <span className="text-base font-bold text-blue-600">
            {formatPrice(order.totalPrice)}원
          </span>
        </div>
      </section>

      <BottomCTASpacer />
      <BottomCTA label="메뉴판으로 돌아가기" onClick={() => navigate('/')} />
    </>
  );
}

function OrderCompleteErrorFallback({
  error,
  onReset,
}: {
  error: unknown;
  onReset: () => void;
}) {
  const navigate = useNavigate();
  const isNotFound = error instanceof ApiError && error.status === 404;

  return (
    <>
      <section
        className="flex flex-col items-center justify-center gap-4 px-4 py-24"
        role="alert"
      >
        {isNotFound && <SearchX size={56} className="text-gray-300" />}
        <p className="text-sm text-gray-500">
          {isNotFound
            ? '주문을 찾을 수 없습니다.'
            : '주문 정보를 불러오는데 실패했습니다.'}
        </p>
        {!isNotFound && (
          <button
            type="button"
            onClick={onReset}
            className="rounded-lg bg-blue-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600 active:bg-blue-700"
          >
            다시 시도
          </button>
        )}
      </section>

      <BottomCTASpacer />
      <BottomCTA label="메뉴판으로 돌아가기" onClick={() => navigate('/')} />
    </>
  );
}
