import { CoffeeIcon } from 'lucide-react';

export function OrderNotFound() {
  return (
    <div className="flex flex-col items-center gap-6 px-4 py-14 text-center sm:py-16">
      <div
        className="flex size-16 items-center justify-center rounded-full bg-muted/90 ring-1 ring-border/70 dark:bg-muted/50"
        aria-hidden
      >
        <CoffeeIcon className="size-8 text-muted-foreground" strokeWidth={1.5} />
      </div>
      <div className="flex max-w-sm flex-col gap-2">
        <p className="text-base font-semibold tracking-tight text-foreground">
          주문 내역을 찾을 수 없어요
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          주문 번호가 맞는지 확인해 주세요.
          <br />
          하단 버튼을 클릭해 메뉴판으로 돌아갈 수 있어요.
        </p>
      </div>
    </div>
  );
}
