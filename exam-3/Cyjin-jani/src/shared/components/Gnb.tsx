import type { ReactNode } from 'react';
import { ChevronLeftIcon, HomeIcon } from 'lucide-react';

import { PageHeader } from '@/shared/components/PageHeader';

export type GnbVariant = 'brand' | 'back' | 'home';

export type GnbProps = {
  variant: GnbVariant;
  title: string;
  onLeftClick?: () => void;
  leftAriaLabel?: string;
};

export function Gnb(props: GnbProps) {
  const isBrand = props.variant === 'brand';
  const leftSide: ReactNode = isBrand ? (
    <a
      href="https://sipe.team/"
      target="_blank"
      rel="noopener noreferrer"
      className="shrink-0 text-lg font-bold tracking-tight text-orange-500"
    >
      SIPE
    </a>
  ) : (
    <button
      type="button"
      onClick={() => props.onLeftClick?.()}
      className="inline-flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
      aria-label={props.leftAriaLabel ?? '메뉴 화면으로 돌아가기'}
    >
      {props.variant === 'home' ? (
        <HomeIcon className="size-5" />
      ) : (
        <ChevronLeftIcon className="size-5" />
      )}
    </button>
  );

  return (
    <PageHeader
      className={isBrand ? 'static px-4 py-4' : undefined}
      leftSide={leftSide}
      title={props.title}
    />
  );
}
