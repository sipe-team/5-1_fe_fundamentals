import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ApiError } from '@/api/error';
import { AsyncQueryBoundary } from '@/components/common/AsyncQueryBoundary';
import { BottomCTA, BottomCTASpacer } from '@/components/common/BottomCTA';
import { QuantitySelector } from '@/components/common/QuantitySelector';
import { OptionGrid } from '@/components/detail/OptionGrid';
import { OptionList } from '@/components/detail/OptionList';
import { OptionSelect } from '@/components/detail/OptionSelect';
import { OrderDetailSkeleton } from '@/components/detail/OrderDetailSkeleton';
import { useMenuItemDetail } from '@/hooks/useMenuItemDetail';
import { useMenuItemOptions } from '@/hooks/useMenuItemOptions';
import { useOptionSelections } from '@/hooks/useOptionSelections';
import { useOrderPrice } from '@/hooks/useOrderPrice';
import { formatPrice } from '@/lib/formatters';
import { validateOptionSelections } from '@/lib/optionValidation';
import { useCartStore } from '@/stores/cartStore';
import type { MenuOption } from '@/types/order';


export function OrderDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-10 h-[60px] flex items-center border-b border-gray-100 bg-white/95 px-2 py-2 backdrop-blur">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="이전 화면으로 돌아가기"
          className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="flex-1 text-center text-sm font-semibold text-gray-900">
          메뉴 상세
        </h2>
        <div className="h-10 w-10" aria-hidden="true" />
      </nav>
      <AsyncQueryBoundary
        fallback={<OrderDetailSkeleton />}
        errorFallback={(reset, error) => (
          <OrderDetailErrorFallback error={error} onReset={reset} />
        )}
      >
        <OrderDetailContent itemId={itemId ?? ''} />
      </AsyncQueryBoundary>
    </main>
  );
}

function OrderDetailContent({ itemId }: { itemId: string }) {
  const navigate = useNavigate();
  const { data: item } = useMenuItemDetail(itemId);
  const { data: itemOptions } = useMenuItemOptions(item.optionIds);
  const addItem = useCartStore((s) => s.addItem);

  const [quantity, setQuantity] = useState(1);

  const {
    selections,
    currentSelections,
    getSingleSelection,
    getListSelection,
    selectGridOption,
    changeSelectOption,
    toggleListOption,
  } = useOptionSelections(itemOptions);

  const { unitPrice, totalPrice } = useOrderPrice({
    basePrice: item.price,
    quantity,
    selections: currentSelections,
    options: itemOptions,
  });

  const validateAndAddToCart = () => {
    const validationMessage = validateOptionSelections(itemOptions, selections);

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    addItem({
      itemId: item.id,
      title: item.title,
      basePrice: item.price,
      options: currentSelections,
      quantity,
      unitPrice,
    });

    toast.success('장바구니에 담았습니다');
    navigate('/');
  };

  const renderOption = (option: MenuOption) => {
    switch (option.type) {
      case 'grid':
        return (
          <OptionGrid
            key={option.id}
            option={option}
            selected={getSingleSelection(option.id)}
            onSelect={(label) => selectGridOption(option.id, label)}
          />
        );
      case 'select':
        return (
          <OptionSelect
            key={option.id}
            option={option}
            selected={getSingleSelection(option.id)}
            onSelect={(label) => changeSelectOption(option.id, label)}
          />
        );
      case 'list':
        return (
          <OptionList
            key={option.id}
            option={option}
            selected={getListSelection(option.id)}
            onToggle={(label) => toggleListOption(option.id, label)}
          />
        );
    }
  };

  return (
    <>
      <header className="bg-white px-4 pb-4 pt-5">
        <div className="flex items-start gap-4">
          <img
            src={item.iconImg}
            alt={item.title}
            className="h-24 w-24 shrink-0 rounded-xl bg-gray-100 object-cover"
          />
          <div className="min-w-0 flex-1 py-1">
            <h1 className="text-xl font-bold text-gray-950">{item.title}</h1>
            <p className="mt-1 text-sm text-gray-500">{item.description}</p>
            <p className="mt-2 text-lg font-bold text-blue-600">
              {formatPrice(item.price)}원
            </p>
          </div>
        </div>
      </header>

      <section aria-label="옵션 선택" className="flex flex-col gap-5 px-4 py-5">
        {itemOptions.map(renderOption)}
      </section>

      <section
        aria-label="수량 선택"
        className="flex items-center justify-between border-t border-gray-100 px-4 py-4"
      >
        <span className="text-sm font-medium text-gray-700">수량</span>
        <QuantitySelector value={quantity} onChange={setQuantity} />
      </section>

      <BottomCTASpacer />
      <BottomCTA
        label={`${formatPrice(totalPrice)}원 담기`}
        onClick={validateAndAddToCart}
      />
    </>
  );
}

function OrderDetailErrorFallback({
  error,
  onReset,
}: {
  error: unknown;
  onReset: () => void;
}) {
  const isNotFound = error instanceof ApiError && error.status === 404;

  return (
    <section
      className="flex flex-col items-center justify-center gap-4 px-4 py-24"
      role="alert"
    >
      <p className="text-sm text-gray-500">
        {isNotFound
          ? '메뉴를 찾을 수 없습니다.'
          : '메뉴 정보를 불러오는데 실패했습니다.'}
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
  );
}
