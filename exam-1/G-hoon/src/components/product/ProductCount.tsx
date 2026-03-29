import { useProductCount } from '@/hooks/useProductCount';

function ProductCount() {
  const { totalCount, hasError, isPending } = useProductCount();

  const countText = hasError
    ? '-'
    : totalCount === null && isPending
      ? '...'
      : String(totalCount ?? '-');

  return (
    <p className="text-xs text-gray-500 md:text-sm" aria-live="polite">
      <span className="font-medium text-black">{countText}</span>개
    </p>
  );
}

export default ProductCount;
