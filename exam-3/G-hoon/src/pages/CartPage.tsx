import { ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ApiError } from '@/api/error';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { OrderPendingOverlay } from '@/components/cart/OrderPendingOverlay';
import { BottomCTA, BottomCTASpacer } from '@/components/common/BottomCTA';
import { EmptyState } from '@/components/common/EmptyState';
import { useCreateOrder } from '@/hooks/useCreateOrder';
import { formatPrice } from '@/lib/formatters';
import {
  selectCartTotalCount,
  selectCartTotalPrice,
  useCartStore,
} from '@/stores/cartStore';

export function CartPage() {
  const navigate = useNavigate();

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalCount = useCartStore(selectCartTotalCount);
  const totalPrice = useCartStore(selectCartTotalPrice);

  const { mutate, isPending } = useCreateOrder();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleOrder = () => {
    if (isPending || items.length === 0) return;

    const orderItems = items.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      options: item.options.map(({ optionId, labels }) => ({
        optionId,
        labels,
      })),
    }));
    const orderTotalPrice = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    mutate(
      {
        customerName: '김민수',
        totalPrice: orderTotalPrice,
        items: orderItems,
      },
      {
        onSuccess: (data) => {
          clearCart();
          navigate(`/orders/${data.orderId}`);
        },
        onError: (error) => {
          const message =
            error instanceof ApiError
              ? error.message
              : '주문에 실패했습니다. 다시 시도해주세요.';
          toast.error(message);
        },
      },
    );
  };

  const isEmpty = items.length === 0;

  const ctaLabel = isEmpty
    ? '메뉴판으로 돌아가기'
    : isPending
      ? '주문 중...'
      : `${totalCount}개 · ${formatPrice(totalPrice)}원 주문하기`;

  const handleBottomCTAClick = () => {
    if (isPending) return;

    if (isEmpty) {
      navigate('/');
      return;
    }
    handleOrder();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-10 flex h-[60px] items-center border-b border-gray-100 bg-white/95 px-2 py-2 backdrop-blur">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="이전 화면으로 돌아가기"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="flex-1 text-center text-sm font-semibold text-gray-900">
          장바구니
        </h2>
        <div className="h-10 w-10" aria-hidden="true" />
      </nav>

      <section aria-label="장바구니 목록" className="px-4 py-4">
        {isEmpty ? (
          <EmptyState message="장바구니가 비어있습니다." />
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                disabled={isPending}
                onChangeQuantity={(qty) => updateQuantity(item.id, qty)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </ul>
        )}
      </section>

      <BottomCTASpacer />
      <BottomCTA
        label={ctaLabel}
        onClick={handleBottomCTAClick}
        disabled={isPending}
      />
      {isPending && <OrderPendingOverlay />}
    </main>
  );
}
