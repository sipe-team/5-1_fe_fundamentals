import { CoffeeIcon } from 'lucide-react';
import { Link } from 'wouter';

export function MenuItemNotFound() {
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
          메뉴를 찾을 수 없어요
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          주소가 맞는지 확인해 주세요.
          <br />
          아래에서 메뉴판으로 돌아갈 수 있어요.
        </p>
        <Link
          href="/"
          className="mt-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          메뉴판으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
