import { Card } from "@/shared/components";
import { css } from "@emotion/react";

export default function CustomerNameInputBox({
  customerName,
  onCustomerNameChange,
}: {
  customerName: string;
  onCustomerNameChange: (value: string) => void;
}) {
  return (
    <Card.Root css={customerCardStyle}>
      <div css={customerHeaderStyle}>
        <Card.Title>주문자명</Card.Title>
        <Card.Meta css={customerMetaStyle}>
          주문 완료 페이지에 표시됩니다.
        </Card.Meta>
      </div>
      <input
        css={customerInputStyle}
        placeholder="주문자명을 입력해주세요"
        type="text"
        value={customerName}
        onChange={(event) => onCustomerNameChange(event.target.value)}
      />
    </Card.Root>
  );
}

const customerCardStyle = css({
  gap: "12px",
});

const customerHeaderStyle = css({
  display: "grid",
  gap: "4px",
});

const customerMetaStyle = css({
  color: "#6b7280",
  fontSize: "0.875rem",
});

const customerInputStyle = css({
  width: "100%",
  height: "48px",
  padding: "0 14px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  color: "#111827",
  fontSize: "1rem",
});
