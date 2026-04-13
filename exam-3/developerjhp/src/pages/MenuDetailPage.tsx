import styled from "@emotion/styled";
import { ErrorBoundary, Suspense } from "@suspensive/react";
import { SuspenseQueries } from "@suspensive/react-query";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  calculateUnitPrice,
  MAX_QUANTITY,
  MIN_QUANTITY,
  useCartStore,
  validateSelection,
} from "@/entities/cart";
import { menuItemQueryOptions, optionsQueryOptions } from "@/entities/menu";
import { createQueryErrorFallback, PageShell, StatusPanel } from "@/shared/ui";
import type {
  GridOption,
  ListOption,
  MenuItem,
  MenuOption,
  OptionSelection,
  SelectOption,
} from "@/types/order";

export function MenuDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();

  if (!itemId) {
    return null;
  }

  return (
    <PageShell>
      <BackLink to="/">← 메뉴판</BackLink>
      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary fallback={menuDetailError} onReset={reset}>
            <Suspense fallback={<StatusPanel>불러오는 중...</StatusPanel>}>
              <SuspenseQueries
                queries={[menuItemQueryOptions(itemId), optionsQueryOptions()]}
              >
                {([{ data: itemData }, { data: optionsData }]) => (
                  <AddToCartForm
                    item={itemData.item}
                    options={optionsData.options.filter((option) =>
                      itemData.item.optionIds.includes(option.id),
                    )}
                  />
                )}
              </SuspenseQueries>
            </Suspense>
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>
    </PageShell>
  );
}

function AddToCartForm({
  item,
  options,
}: {
  item: MenuItem;
  options: MenuOption[];
}) {
  const [selection, setSelection] = useState<Record<number, string[]>>({});
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [error, setError] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const navigate = useNavigate();

  const selectionArray: OptionSelection[] = Object.entries(selection)
    .filter(([, labels]) => labels.length > 0)
    .map(([optionId, labels]) => ({ optionId: Number(optionId), labels }));

  const unitPrice = calculateUnitPrice(item.price, options, selectionArray);
  const totalPrice = unitPrice * quantity;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const result = validateSelection(options, selectionArray);
        if (!result.ok) {
          setError(result.reason);
          return;
        }
        addItem({
          itemId: item.id,
          title: item.title,
          basePrice: item.price,
          options: selectionArray,
          quantity,
          unitPrice,
        });
        navigate("/");
      }}
    >
      <ItemHeader item={item} />

      {options.map((option) => (
        <OptionWrapper key={option.id}>
          <OptionLabel>
            {option.name}
            {option.required && <RequiredBadge>필수</RequiredBadge>}
          </OptionLabel>

          {option.type === "grid" && (
            <OptionGrid
              option={option}
              selected={selection[option.id]?.[0] ?? null}
              onChange={(label) => {
                setError(null);
                setSelection((prev) => ({ ...prev, [option.id]: [label] }));
              }}
            />
          )}

          {option.type === "select" && (
            <OptionSelect
              option={option}
              selected={selection[option.id]?.[0] ?? null}
              onChange={(label) => {
                setError(null);
                setSelection((prev) => ({ ...prev, [option.id]: [label] }));
              }}
            />
          )}

          {option.type === "list" && (
            <OptionList
              option={option}
              selected={selection[option.id] ?? []}
              onChange={(labels) => {
                setError(null);
                setSelection((prev) => ({ ...prev, [option.id]: labels }));
              }}
            />
          )}
        </OptionWrapper>
      ))}

      <QuantityControl value={quantity} onChange={setQuantity} />

      {error && <ErrorBanner>{error}</ErrorBanner>}

      <SubmitButton type="submit">
        {totalPrice.toLocaleString()}원 담기
      </SubmitButton>
    </form>
  );
}

function ItemHeader({ item }: { item: MenuItem }) {
  return (
    <HeaderSection>
      <img src={item.iconImg} alt={item.title} />
      <h2>{item.title}</h2>
      <Description>{item.description}</Description>
      <BasePrice>{item.price.toLocaleString()}원</BasePrice>
    </HeaderSection>
  );
}

function OptionGrid({
  option,
  selected,
  onChange,
}: {
  option: GridOption;
  selected: string | null;
  onChange: (label: string) => void;
}) {
  return (
    <GridButtons $cols={option.col}>
      {option.labels.map((label, i) => (
        <GridCell
          key={label}
          type="button"
          aria-pressed={selected === label}
          onClick={() => onChange(label)}
        >
          <span>{option.icons[i]}</span>
          <span>{label}</span>
          {option.prices[i] > 0 && (
            <PriceHint>+{option.prices[i].toLocaleString()}원</PriceHint>
          )}
        </GridCell>
      ))}
    </GridButtons>
  );
}

function OptionSelect({
  option,
  selected,
  onChange,
}: {
  option: SelectOption;
  selected: string | null;
  onChange: (label: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SelectTrigger type="button" onClick={() => setOpen(true)}>
        {selected ?? "선택해주세요"}
        <span>▾</span>
      </SelectTrigger>
      {open && (
        <SheetBackdrop onClick={() => setOpen(false)}>
          <Sheet onClick={(event) => event.stopPropagation()}>
            <SheetTitle>{option.name}</SheetTitle>
            {option.labels.map((label, i) => (
              <SheetRow
                key={label}
                type="button"
                aria-pressed={selected === label}
                onClick={() => {
                  onChange(label);
                  setOpen(false);
                }}
              >
                <span>{label}</span>
                {option.prices[i] > 0 && (
                  <PriceHint>+{option.prices[i].toLocaleString()}원</PriceHint>
                )}
              </SheetRow>
            ))}
          </Sheet>
        </SheetBackdrop>
      )}
    </>
  );
}

function OptionList({
  option,
  selected,
  onChange,
}: {
  option: ListOption;
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const isMaxReached = selected.length >= option.maxCount;

  return (
    <CheckList>
      {option.labels.map((label, i) => {
        const isOn = selected.includes(label);
        return (
          <CheckRow key={label}>
            <input
              type="checkbox"
              checked={isOn}
              disabled={!isOn && isMaxReached}
              onChange={() => {
                onChange(
                  isOn
                    ? selected.filter(
                        (selectedLabel) => selectedLabel !== label,
                      )
                    : [...selected, label],
                );
              }}
            />
            <span>{label}</span>
            {option.prices[i] > 0 && (
              <PriceHint>+{option.prices[i].toLocaleString()}원</PriceHint>
            )}
          </CheckRow>
        );
      })}
    </CheckList>
  );
}

function QuantityControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <QuantityRow>
      <span>수량</span>
      <QuantityControls>
        <QuantityBtn
          type="button"
          onClick={() => onChange(Math.max(MIN_QUANTITY, value - 1))}
          disabled={value <= MIN_QUANTITY}
        >
          −
        </QuantityBtn>
        <QuantityValue>{value}</QuantityValue>
        <QuantityBtn
          type="button"
          onClick={() => onChange(Math.min(MAX_QUANTITY, value + 1))}
          disabled={value >= MAX_QUANTITY}
        >
          +
        </QuantityBtn>
      </QuantityControls>
    </QuantityRow>
  );
}

const menuDetailError = createQueryErrorFallback({
  message: "메뉴를 불러오지 못했어요.",
  notFoundMessage: "메뉴를 찾을 수 없어요.",
});

const BackLink = styled(Link)`
  display: inline-block;
  margin: 16px 0;
  color: #666;
  text-decoration: none;
  font-size: 14px;
`;

const HeaderSection = styled.section`
  text-align: center;
  padding: 16px 0 24px;
  img {
    width: 140px;
    height: 140px;
    object-fit: contain;
    background: #fafafa;
    border-radius: 12px;
  }
  h2 {
    margin: 12px 0 8px;
  }
`;

const Description = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0 0 8px;
`;

const BasePrice = styled.div`
  font-weight: 700;
  font-size: 18px;
`;

const OptionWrapper = styled.section`
  margin: 24px 0;
`;

const OptionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 10px;
`;

const RequiredBadge = styled.span`
  font-size: 11px;
  padding: 2px 6px;
  background: #fee2e2;
  color: #b91c1c;
  border-radius: 4px;
`;

const GridButtons = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$cols}, 1fr);
  gap: 8px;
`;

const GridCell = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 16px 8px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  &[aria-pressed="true"] {
    background: #111;
    color: #fff;
    border-color: #111;
  }
`;

const PriceHint = styled.span`
  font-size: 12px;
  color: inherit;
  opacity: 0.8;
`;

const SelectTrigger = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
`;

const SheetBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const Sheet = styled.div`
  width: 100%;
  max-width: 480px;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding: 20px 16px 32px;
`;

const SheetTitle = styled.h3`
  margin: 0 0 12px;
  font-size: 16px;
`;

const SheetRow = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 12px;
  border: 0;
  background: transparent;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  &[aria-pressed="true"] {
    color: #111;
    font-weight: 700;
  }
`;

const CheckList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CheckRow = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 4px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  cursor: pointer;
`;

const QuantityRow = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px 0;
  font-weight: 600;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 18px;
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  min-width: 24px;
  text-align: center;
`;

const ErrorBanner = styled.div`
  padding: 12px 16px;
  margin: 16px 0;
  background: #fee2e2;
  color: #b91c1c;
  border-radius: 8px;
  font-size: 14px;
`;

const SubmitButton = styled.button`
  display: block;
  width: 100%;
  padding: 16px;
  background: #111;
  color: #fff;
  border: 0;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  margin-top: 16px;
`;
