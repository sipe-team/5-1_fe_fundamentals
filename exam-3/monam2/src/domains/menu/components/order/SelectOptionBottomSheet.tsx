import type { SelectOption } from "@/shared/types";
import { formatCurrencyKRW } from "@/shared/utils";
import { css } from "@emotion/react";
import { selectedOptionButtonStyle } from "./styles";

interface SelectOptionBottomSheetProps {
  option: SelectOption;
  selectedLabel?: string;
  onClose: () => void;
  onSelect: (label: string | undefined) => void;
}

export default function SelectOptionBottomSheet({
  option,
  selectedLabel,
  onClose,
  onSelect,
}: SelectOptionBottomSheetProps) {
  return (
    <div css={bottomSheetOverlayStyle}>
      <BackDrop onClose={onClose} />
      <div aria-modal="true" css={bottomSheetStyle} role="dialog">
        <div css={bottomSheetHeaderStyle}>
          <strong>{option.name}</strong>
          <button css={sheetCloseButtonStyle} type="button" onClick={onClose}>
            닫기
          </button>
        </div>
        <OptionList
          option={option}
          selectedLabel={selectedLabel}
          onSelect={onSelect}
        />
        <div css={bottomSheetOptionListStyle}>
          <button
            aria-pressed={selectedLabel === undefined}
            css={[
              bottomSheetOptionButtonStyle,
              selectedLabel === undefined && selectedOptionButtonStyle,
            ]}
            type="button"
            onClick={() => onSelect(undefined)}
          >
            선택 안 함
          </button>
        </div>
      </div>
    </div>
  );
}

function BackDrop({ onClose }: { onClose: () => void }) {
  return (
    <button
      aria-label="옵션 선택 닫기"
      css={bottomSheetOverlayButtonStyle}
      type="button"
      onClick={onClose}
    />
  );
}

function OptionList({
  option,
  selectedLabel,
  onSelect,
}: {
  option: SelectOption;
  selectedLabel?: string;
  onSelect: (label: string | undefined) => void;
}) {
  return (
    <>
      {option.labels.map((label, index) => {
        const optionPrice = option.prices[index] ?? 0;

        return (
          <button
            key={label}
            aria-pressed={selectedLabel === label}
            css={[
              bottomSheetOptionButtonStyle,
              selectedLabel === label && selectedOptionButtonStyle,
            ]}
            type="button"
            onClick={() => onSelect(label)}
          >
            <span>{label}</span>
            <span css={bottomSheetOptionPriceStyle}>
              {optionPrice > 0
                ? `+${formatCurrencyKRW(optionPrice)}`
                : "추가금액 없음"}
            </span>
          </button>
        );
      })}
    </>
  );
}

export const bottomSheetOverlayStyle = css({
  position: "fixed",
  inset: 0,
  zIndex: 30,
  display: "grid",
  alignItems: "end",
});

export const bottomSheetOverlayButtonStyle = css({
  position: "absolute",
  inset: 0,
  border: "none",
  backgroundColor: "rgba(17, 24, 39, 0.42)",
  cursor: "pointer",
});

export const bottomSheetStyle = css({
  position: "relative",
  zIndex: 1,
  display: "grid",
  gap: "16px",
  width: "100%",
  maxHeight: "72dvh",
  padding: "20px 16px 24px",
  borderRadius: "8px 8px 0 0",
  backgroundColor: "#ffffff",
});

export const bottomSheetHeaderStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
});

export const sheetCloseButtonStyle = css({
  border: "none",
  backgroundColor: "transparent",
  color: "#6b7280",
  cursor: "pointer",
});

export const bottomSheetOptionListStyle = css({
  display: "grid",
  gap: "10px",
  overflowY: "auto",
});

export const bottomSheetOptionButtonStyle = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  padding: "14px 16px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#111827",
  cursor: "pointer",
});

export const bottomSheetOptionPriceStyle = css({
  color: "#6b7280",
  fontSize: "0.875rem",
});
