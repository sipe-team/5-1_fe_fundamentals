import { css } from "@emotion/react";

import { formatCurrencyKRW } from "@/shared/utils";

export default function CartPageCTA({
  isPending,
  totalQuantity,
  totalPrice,
  submitOrder,
}: {
  isPending: boolean;
  totalQuantity: number;
  totalPrice: number;
  submitOrder: () => void;
}) {
  return (
    <div css={ctaBarStyle}>
      <button
        css={ctaButtonStyle}
        disabled={isPending}
        type="button"
        onClick={submitOrder}
      >
        <span css={ctaLabelStyle}>
          {isPending ? "주문 처리 중..." : "주문하기"}
        </span>
        <span css={ctaPriceStyle}>
          총 {totalQuantity}개 · {formatCurrencyKRW(totalPrice)}
        </span>
      </button>
    </div>
  );
}

const ctaBarStyle = css({
  position: "fixed",
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 25,
  padding: "12px 16px 16px",
  background:
    "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0.94))",
  backdropFilter: "blur(8px)",
});

const ctaButtonStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  maxWidth: "1080px",
  margin: "0 auto",
  padding: "16px 20px",
  border: "none",
  borderRadius: "8px",
  backgroundColor: "#f97316",
  color: "#ffffff",
  cursor: "pointer",
  selectors: {
    "&:disabled": {
      opacity: 0.6,
      cursor: "wait",
    },
  },
});

const ctaLabelStyle = css({
  fontSize: "1rem",
  fontWeight: 700,
});

const ctaPriceStyle = css({
  fontSize: "0.9375rem",
  fontWeight: 600,
});
