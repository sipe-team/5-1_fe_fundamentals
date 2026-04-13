import { motion } from 'framer-motion';
import { type KeyboardEvent, useEffect, useRef } from 'react';

export function OrderPendingOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    overlayRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;

    event.preventDefault();
    overlayRef.current?.focus();
  };

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-pending-title"
      aria-describedby="order-pending-description"
      aria-busy="true"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/25 px-6 backdrop-blur-sm"
    >
      <motion.div
        className="w-full max-w-sm rounded-lg border border-gray-100 bg-white p-6 text-center shadow-lg"
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
      >
        <div
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-blue-50"
          aria-hidden="true"
        >
          <motion.div
            className="h-8 w-8 rounded-full border-4 border-blue-200 border-t-blue-600"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <h2
          id="order-pending-title"
          className="mt-5 text-base font-bold text-gray-950"
        >
          주문을 접수하고 있어요
        </h2>
        <p
          id="order-pending-description"
          className="mt-2 text-sm text-gray-500"
        >
          잠시만 기다려주세요.
        </p>

        <div
          className="mt-5 h-1.5 overflow-hidden rounded bg-gray-100"
          aria-hidden="true"
        >
          <motion.div
            className="h-full w-1/2 rounded bg-blue-600"
            animate={{ x: ['-120%', '240%'] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
