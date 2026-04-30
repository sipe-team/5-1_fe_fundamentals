# 리팩토링 마이그레이션 문서

## 개요

총 **6가지 핵심 영역**에서 리팩토링을 진행했으며, 기존 기능은 모두 유지하면서 코드의 안정성, 타입 안전성, 사용자 경험을 개선했습니다.

---

## 1. URL 상태 관리: `useSyncExternalStore` → `nuqs`

### 기존 방식의 문제점

기존에는 `useSyncExternalStore`를 사용하여 `window.location.search`를 직접 구독하고, `window.history.pushState` + 수동 `PopStateEvent` 디스패치로 URL을 업데이트했습니다.

```typescript
// Before: 수동 URL 동기화 (약 60줄의 보일러플레이트)
function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
}

function getSnapshot() {
  return window.location.search;
}

function setSearchParams(filters: ProductFilters) {
  const search = buildSearch(filters);
  const url = search ? `${window.location.pathname}?${search}` : window.location.pathname;
  window.history.pushState(null, '', url);
  window.dispatchEvent(new PopStateEvent('popstate')); // 수동 이벤트 디스패치
}

const search = useSyncExternalStore(subscribe, getSnapshot);
const filters = useMemo(() => parseFilters(getSearchParams()), [search]);
```

**문제점:**
- `subscribe`, `getSnapshot`, `parseFilters`, `buildSearch`, `setSearchParams` 등 5개의 유틸리티 함수를 직접 구현해야 함
- URL 파라미터의 타입 검증을 수동으로 처리 (`as Category` 같은 타입 단언 필요)
- `PopStateEvent`를 수동으로 디스패치하는 비표준 패턴
- 카테고리 배열의 URL 직렬화/역직렬화를 직접 구현

### 리팩토링 후 (nuqs)

```typescript
// After: nuqs로 선언적 URL 상태 관리
import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from 'nuqs';

const filtersParsers = {
  categories: parseAsArrayOf(parseAsStringLiteral(ALL_CATEGORIES)).withDefault([]),
  keyword: parseAsString.withDefault(''),
  sort: parseAsStringLiteral(SORT_OPTIONS).withDefault('newest'),
};

const [filters, setFilters] = useQueryStates(filtersParsers, {
  shallow: false,
});
```

**개선된 점:**
- `parseAsStringLiteral`로 **URL 파라미터의 타입 검증이 자동으로** 이루어짐 (유효하지 않은 값은 기본값으로 폴백)
- `parseAsArrayOf`로 배열 파라미터의 직렬화/역직렬화가 자동 처리
- 약 60줄의 보일러플레이트 코드가 10줄 이내로 감소
- `shallow: false` 옵션으로 전체 네비게이션 트리거 (React Query와 연동)

---

## 2. `useTransition`을 활용한 비차단 필터 업데이트

### 기존 방식의 문제점

기존에는 필터 변경 시 `useSuspenseQuery`가 새 데이터를 로딩하는 동안 `<Suspense>` fallback(스켈레톤)이 매번 다시 표시되었습니다. 사용자가 카테고리를 클릭할 때마다 전체 화면이 스켈레톤으로 바뀌었다가 다시 렌더링되는 깜빡임이 발생했습니다.

### 리팩토링 후

```typescript
// useTransition으로 모든 필터 setter 래핑
const [isPending, startTransition] = useTransition();

const toggleCategory = useCallback(
  (category: Category) => {
    startTransition(() => {
      setFilters({
        categories: has
          ? filters.categories.filter((cat) => cat !== category)
          : [...filters.categories, category],
      });
    });
  },
  [filters.categories, setFilters],
);
```

```tsx
// ProductListPage.tsx - isPending 상태로 오버레이 표시
<div
  className="product-grid-wrapper"
  style={{
    opacity: isPending ? 0.4 : 1,
    transition: 'opacity 0.2s ease',
    position: 'relative',
  }}
>
  {isPending && (
    <div style={{ position: 'absolute', top: '50%', left: '50%', ... }}>
      <LoadingSpinner message="필터 적용 중..." />
    </div>
  )}
  <ProductGrid products={visibleItems} />
</div>
```

**개선된 점:**
- 필터 변경 시 **기존 UI를 유지하면서** 백그라운드에서 새 데이터를 로드
- `opacity: 0.4` 오버레이 + "필터 적용 중..." 스피너로 로딩 상태를 시각적으로 전달
- Suspense 스켈레톤이 초기 로딩에만 표시되고, 이후 필터 변경에서는 깜빡이지 않음
- 사용자 경험이 훨씬 부드러워짐

---

## 3. ErrorBoundary + TanStack Query 리셋 연동

### 기존 방식의 버그

기존 클래스 컴포넌트 `ErrorBoundary`에서 "다시 시도" 버튼을 클릭하면 `this.setState({ hasError: false })`만 호출했습니다. 이는 **TanStack Query의 캐시를 무효화하지 않기 때문에**, `useSuspenseQuery`가 캐시된 에러를 다시 throw하여 즉시 에러 화면으로 돌아가는 버그가 있었습니다.

```typescript
// Before: 쿼리 캐시를 리셋하지 않는 ErrorBoundary
handleReset = () => {
  this.setState({ hasError: false, error: null });
  // ❌ queryClient.invalidateQueries() 호출 없음
  // → 재시도 시 캐시된 에러가 다시 throw됨
};
```

### 리팩토링 후

```typescript
// After: react-error-boundary + useQueryErrorResetBoundary
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';

export function ProductErrorBoundary({ children }: ProductErrorBoundaryProps) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={reset}>
      {children}
    </ErrorBoundary>
  );
}
```

**개선된 점:**
- `useQueryErrorResetBoundary`의 `reset()`이 `onReset`에 연결되어, "다시 시도" 클릭 시 **TanStack Query의 에러 상태가 함께 리셋**됨
- `useSuspenseQuery`가 자동으로 재요청을 트리거하여 실제로 API를 다시 호출
- `react-error-boundary` 라이브러리 사용으로 `resetKeys`, `onError` 등 추가 기능 활용 가능
- `ErrorFallback` 컴포넌트에서 `HttpError` 인스턴스를 감지하여 에러 종류별 맞춤 메시지 표시

### 미사용 컴포넌트 제거

- `ErrorBoundary.tsx` (클래스 컴포넌트) → 삭제, `ProductErrorBoundary.tsx` (함수 컴포넌트)로 대체
- `ErrorMessage.tsx` → 삭제 (어디에서도 import되지 않는 데드 코드였음)

---

## 4. HTTP 에러 클래스 계층화

### 기존 방식

```typescript
// Before: 모든 에러가 일반 Error
throw new Error(body?.message || `서버 오류가 발생했습니다. (${res.status})`);
```

모든 서버 에러가 일반 `Error` 객체로 throw되어, 에러의 종류(400 vs 500 vs 503)를 구분할 수 없었습니다.

### 리팩토링 후

```typescript
// After: 상태 코드별 타입 에러 클래스 계층
export class HttpError extends Error {
  readonly status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export class BadRequestError extends HttpError { ... }       // 400
export class NotFoundError extends HttpError { ... }         // 404
export class InternalServerError extends HttpError { ... }   // 500
export class ServiceUnavailableError extends HttpError { ... } // 503

export function createHttpError(status: number, message?: string): HttpError {
  switch (status) {
    case 400: return new BadRequestError(message);
    case 500: return new InternalServerError(message);
    case 503: return new ServiceUnavailableError(message);
    // ...
  }
}
```

**개선된 점:**
- `instanceof` 체크로 에러 종류를 구분하여 **UI에서 차별화된 메시지** 표시 가능
- 예: 503은 "서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요."
- `ErrorFallback`에서 `error instanceof HttpError`로 구조화된 에러와 예기치 않은 에러를 구분
- 각 에러 클래스에 한국어 기본 메시지가 내장되어 있어, 서버에서 메시지가 없어도 적절한 안내 제공

---

## 5. Query Key Factory 패턴

### 기존 방식

```typescript
// Before: 단순 객체
export const queryKeys = {
  products: ['products'] as const,
  autocomplete: (keyword: string) => ['autocomplete', keyword] as const,
};
```

### 리팩토링 후

```typescript
// After: 계층적 Query Key Factory
export const productsQuery = {
  all: () => ['products'] as const,
  lists: () => [...productsQuery.all(), 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...productsQuery.lists(), params] as const,
} as const;

export const autocompleteQuery = {
  all: () => ['autocomplete'] as const,
  suggestions: (keyword: string) =>
    [...autocompleteQuery.all(), keyword] as const,
} as const;
```

**개선된 점:**
- **계층적 캐시 무효화** 가능: `queryClient.invalidateQueries({ queryKey: productsQuery.all() })`로 상품 관련 모든 쿼리를 한 번에 무효화
- 쿼리 키가 자기 참조적으로 구성되어, 상위 키를 변경하면 하위 키도 자동으로 영향받음
- TkDodo의 [Effective React Query Keys](https://tkdodo.eu/blog/effective-react-query-keys) 패턴을 따름
- 향후 상품 상세(`productsQuery.detail(id)`) 등 확장이 용이

---

## 6. Autocomplete 에러 전파 방지

### 기존 방식의 잠재적 문제

기존 `useAutocomplete`에서는 `throwOnError` 옵션이 명시되어 있지 않았습니다. 이 경우 자동완성 API 에러가 `ErrorBoundary`로 전파되어 전체 페이지가 에러 화면으로 바뀔 수 있는 잠재적 위험이 있었습니다.

### 리팩토링 후

```typescript
const { data: suggestions = [], isLoading: loading } = useQuery({
  queryKey: autocompleteQuery.suggestions(trimmed),
  queryFn: () => fetchAutocomplete(trimmed),
  enabled: trimmed.length > 0,
  staleTime: 60 * 1000,
  throwOnError: false, // 자동완성 에러는 ErrorBoundary로 전파하지 않음
});
```

**개선된 점:**
- `throwOnError: false`로 자동완성 에러가 `ErrorBoundary`에 도달하지 않음
- 자동완성은 부가 기능이므로, 에러 시 조용히 실패하고 드롭다운만 표시하지 않음
- 상품 목록(`useSuspenseQuery`)과 자동완성(`useQuery`)의 에러 처리 전략을 의도적으로 분리


---

## 추가된 의존성

| 패키지 | 버전 | 선택 이유 |
|--------|------|----------|
| `nuqs` | 2.8.9 | URL 쿼리 파라미터를 React 상태처럼 사용할 수 있는 타입-안전한 라이브러리. `useSyncExternalStore` 기반 수동 구현 대비 보일러플레이트를 대폭 줄이고, `parseAsStringLiteral`, `parseAsArrayOf` 등 타입 파서로 런타임 검증까지 자동 처리 |
| `react-error-boundary` | 6.1.1 | 클래스 컴포넌트 없이 함수 컴포넌트로 ErrorBoundary를 구현할 수 있는 라이브러리. `resetKeys`, `onReset`, `FallbackComponent` 등 선언적 API 제공. TanStack Query의 `useQueryErrorResetBoundary`와 자연스럽게 통합 |

---

## 빌드 검증 결과

```
✓ TypeScript 컴파일: 에러 0개
✓ Vite 빌드: 389 modules transformed, 529ms
✓ Biome 린트: 자동 수정 적용 (import 정렬, 포맷팅)
```