import { css } from "@emotion/react";
import { useQueryState } from "nuqs";

import { useCategories } from "@/domains/menu/hooks";

import { Chip } from "@/shared/components";
import type { AllCategoryFilter, MenuView } from "@/shared/types";

/*
 * 카테고리와 카탈로그(메뉴리스트)를 동시에 useQueries 하지 않는 이유
 * - 카테고리와 카탈로그가 동시에 뜨면 사용자는 아무런 정보도 얻을 수 없다.
 * - 데이터 성격/크기상 카테고리가 먼저 뜬 후 카탈로그가 뜨는 것이 자연스럽고
 * - 카탈로그(메뉴)가 로딩 중이더라도 카테고리는 이미 떠있기 때문에 사용자는 카테고리를 선택할 수 있다.
 */

export default function CategoryFilter() {
  const { data: categories } = useCategories();
  const [category, setCategory] = useQueryState("category");

  const categoryList: AllCategoryFilter[] = ["전체", ...categories];

  const changeFilter = (categoryItem: AllCategoryFilter) => {
    setCategory(categoryItem);
  };

  return (
    <div css={groupStyle}>
      <h2 css={sectionTitleStyle}>카테고리</h2>
      <div css={filterHeaderStyle}>
        <div css={chipListStyle}>
          {categoryList.map((item) => (
            <Chip
              key={item}
              active={category === item || (!category && item === "전체")}
              label={item}
              onClick={() => changeFilter(item)}
            />
          ))}
        </div>
        <ViewModeButton />
      </div>
    </div>
  );
}

const VIEW_OPTIONS: { icon: string; label: string; value: MenuView }[] = [
  { icon: "⊞", label: "그리드 보기", value: "grid" },
  { icon: "☰", label: "리스트 보기", value: "list" },
];

function ViewModeButton() {
  const [view, setView] = useQueryState("view");

  const viewMode: MenuView = view === "list" ? "list" : "grid";

  return (
    <div css={viewToggleStyle}>
      {VIEW_OPTIONS.map(({ label, value, icon }) => (
        <button
          key={value}
          aria-label={label}
          aria-pressed={viewMode === value}
          css={[
            viewToggleButtonStyle,
            viewMode === value && activeViewToggleButtonStyle,
          ]}
          type="button"
          onClick={() => setView(value)}
        >
          {icon}
        </button>
      ))}
    </div>
  );
}

const groupStyle = css({
  display: "grid",
  gap: "16px",
});

const sectionTitleStyle = css({
  margin: 0,
  fontSize: "1.125rem",
  color: "#111827",
});

const filterHeaderStyle = css({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
});

const chipListStyle = css({
  display: "flex",
  flexWrap: "wrap",
  gap: "12px",
});

const viewToggleStyle = css({
  display: "inline-flex",
  alignItems: "center",
  padding: "4px",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
});

const viewToggleButtonStyle = css({
  height: "32px",
  minWidth: "32px",
  padding: "0 10px",
  border: 0,
  borderRadius: "6px",
  backgroundColor: "transparent",
  color: "#6b7280",
  fontSize: "1rem",
  lineHeight: 1,
  fontWeight: 700,
  cursor: "pointer",
});

const activeViewToggleButtonStyle = css({
  backgroundColor: "#fff7ed",
  color: "#c2410c",
});
