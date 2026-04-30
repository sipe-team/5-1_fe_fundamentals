import { type RefObject, useEffect } from 'react';

const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * 모달/오버레이 내부에 포커스를 가두는 훅.
 * - circular: Tab으로 순환 이동 (BottomSheet 등)
 * - lock: Tab 시 컨테이너에 포커스 고정 (로딩 오버레이 등)
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  options: {
    enabled: boolean;
    mode?: 'circular' | 'lock';
    onEscape?: () => void;
  },
) {
  const { enabled, mode = 'circular', onEscape } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      if (e.key !== 'Tab') return;

      if (mode === 'lock') {
        e.preventDefault();
        ref.current?.focus();
        return;
      }

      const focusableElements =
        ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, mode, onEscape, ref]);
}
