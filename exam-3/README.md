# Exam 3: 커피 주문 앱

## 문제 설명

카페 **커피 주문 앱**을 구현해주세요.

사용자가 메뉴를 탐색하고, 옵션(온도, 사이즈, 추가 옵션 등)을 선택하여 장바구니에 담은 뒤, 주문을 생성하고 결과를 확인할 수 있어야 합니다.

## 기술 조건

- **TypeScript** 필수
- **React** 사용
- 스타일링 자유 (CSS Modules, Tailwind, styled-components, 순수 CSS 등 — 디자인 평가 아님)
- 추가 라이브러리 사용 자유 (단, 선택한 이유를 PR에 명시)

## 페이지 구성

이 과제는 **4개 페이지**로 구성된 SPA입니다. 적절한 라우팅 라이브러리를 사용해주세요.

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 메뉴판 | `/` | 카테고리별 메뉴 탐색 + CTA에 장바구니 수량/금액 표시 |
| 주문하기 | `/menu/:itemId` | 메뉴 상세 + 옵션 선택 (grid/select/list) + 장바구니 담기 |
| 장바구니 | `/cart` | 담은 메뉴 확인 + 수량 변경 + 주문하기 |
| 주문 완료 | `/orders/:orderId` | 주문 결과 확인 |

> 장바구니 상태는 클라이언트에서 관리합니다 (서버에 장바구니 API는 없습니다).

## API

보일러플레이트에 MSW(Mock Service Worker) 기반 Mock API가 포함되어 있습니다.

`pnpm dev` 실행 시 자동으로 활성화됩니다.

> **주의**: Mock API는 간헐적으로 **느린 응답(최대 ~5초)**과 **에러 응답(500, 503)**을 반환합니다.
> 실제 서비스 환경을 시뮬레이션한 것이므로, 이에 대한 적절한 처리가 필요합니다.

### `GET /api/catalog/categories`

카테고리 목록을 반환합니다.

**응답 (성공):**

```json
{
  "categories": [
    "커피",
    "음료",
    "디저트"
  ]
}
```

### `GET /api/catalog/items`

전체 메뉴 목록을 반환합니다.

**응답 (성공):**

```json
{
  "items": [
    {
      "id": "menu-001",
      "category": "커피",
      "title": "아메리카노",
      "description": "깊고 진한 에스프레소에 물을 더한 클래식 커피",
      "price": 4500,
      "iconImg": "/images/americano.png",
      "optionIds": [1, 2, 3, 4]
    }
  ]
}
```

### `GET /api/catalog/items/:itemId`

특정 메뉴의 상세 정보를 반환합니다. `optionIds`는 해당 메뉴에 적용 가능한 옵션 ID 목록입니다.

**응답 (성공):**

```json
{
  "item": {
    "id": "menu-001",
    "category": "커피",
    "title": "아메리카노",
    "description": "깊고 진한 에스프레소에 물을 더한 클래식 커피",
    "price": 4500,
    "iconImg": "/images/americano.png",
    "optionIds": [1, 2, 3, 4]
  }
}
```

**응답 (404):**

```json
{
  "error": "Not Found",
  "message": "상품을 찾을 수 없어요."
}
```

### `GET /api/catalog/options`

전체 옵션 목록을 반환합니다. 옵션에는 3가지 타입이 있으며, 각 타입에 따라 UI를 다르게 구현해야 합니다.

**응답 (성공):**

```json
{
  "options": [
    {
      "id": 1,
      "name": "온도",
      "type": "grid",
      "required": true,
      "col": 2,
      "labels": ["HOT", "ICE"],
      "icons": ["🔥", "🧊"],
      "prices": [0, 0]
    },
    {
      "id": 3,
      "name": "진하기",
      "type": "select",
      "required": false,
      "labels": ["연하게", "보통", "진하게", "샷 추가"],
      "prices": [0, 0, 0, 500]
    },
    {
      "id": 4,
      "name": "추가옵션",
      "type": "list",
      "required": false,
      "minCount": 0,
      "maxCount": 3,
      "labels": ["바닐라 시럽", "헤이즐넛 시럽", "카라멜 시럽", "휘핑크림", "오트밀크"],
      "prices": [300, 300, 300, 500, 500]
    }
  ]
}
```

### 옵션 타입 설명

| 타입 | 설명 | 필수 여부 | 선택 방식 |
|------|------|-----------|-----------|
| `grid` | 아이콘과 함께 그리드 형태로 노출 | **항상 필수** | 하나만 선택 |
| `select` | 셀렉트박스 + 바텀시트로 선택 | 선택 사항 | 하나만 선택 |
| `list` | 체크리스트 형태로 복수 선택 | `minCount` > 0이면 필수 | `minCount` ~ `maxCount`개 선택 |

> - `grid`: 컬럼 수(`col`), 라벨 목록(`labels`), 아이콘 목록(`icons`), 가격(`prices`)이 내려옵니다.
> - `select`: 라벨 목록(`labels`), 가격(`prices`)이 내려옵니다. 셀렉트박스를 누르면 바텀시트를 출력하고, 항목 선택 시 값을 업데이트합니다.
> - `list`: 라벨 목록(`labels`), 가격(`prices`), 최소 선택 개수(`minCount`), 최대 선택 개수(`maxCount`)가 내려옵니다.

### `POST /api/orders`

새 주문을 생성합니다. **서버에서 옵션 유효성, 필수 옵션, 선택 개수, 총 금액을 검증**합니다.

**요청 바디:**

```json
{
  "totalPrice": 5500,
  "customerName": "김민수",
  "items": [
    {
      "itemId": "menu-001",
      "quantity": 1,
      "options": [
        {
          "optionId": 1,
          "labels": ["HOT"]
        },
        {
          "optionId": 2,
          "labels": ["Medium"]
        },
        {
          "optionId": 3,
          "labels": ["샷 추가"]
        }
      ]
    }
  ]
}
```

> 위 예시 가격 계산: 아메리카노(4500) + Medium(+500) + 샷 추가(+500) = 5500원

**응답 (성공 — 201):**

```json
{
  "orderId": "bd29d8550930876e209fe97d"
}
```

**응답 (에러 — 400):**

```json
{
  "error": "Bad Request",
  "message": "잘못된 주문이에요."
}
```

> 다음 경우에 "잘못된 주문이에요" 에러가 발생합니다:
> - `items` 배열이 비어 있는 경우
> - 상품에 적용 가능한 옵션이 아닌 경우
> - 필수 옵션(`required: true`)인데 적용이 안된 경우
> - 옵션에 적용된 선택의 개수가 유효하지 않은 경우 (list의 minCount/maxCount)
> - grid/select에 2개 이상 선택한 경우

```json
{
  "error": "Bad Request",
  "message": "주문금액이 잘못되었어요."
}
```

> 주문 상품의 총 합계 금액과 `totalPrice`가 일치하지 않는 경우 발생합니다.

### `GET /api/orders`

내 주문 목록을 반환합니다.

**응답 (성공):**

```json
{
  "orders": [
    {
      "id": "ord-001",
      "totalPrice": 11000,
      "items": [
        {
          "itemId": "menu-001",
          "title": "아메리카노",
          "quantity": 2,
          "basePrice": 4500,
          "options": [
            { "optionId": 1, "labels": ["ICE"] },
            { "optionId": 2, "labels": ["Medium"] },
            { "optionId": 3, "labels": ["샷 추가"] }
          ],
          "unitPrice": 5500
        }
      ],
      "status": "completed",
      "customerName": "김민수",
      "createdAt": "2026-04-08T09:15:00Z"
    }
  ]
}
```

### `GET /api/orders/:orderId`

특정 주문의 상세 정보를 반환합니다.

**응답 (성공):**

```json
{
  "order": {
    "id": "ord-001",
    "totalPrice": 11000,
    "items": [
      {
        "itemId": "menu-001",
        "title": "아메리카노",
        "quantity": 2,
        "basePrice": 4500,
        "options": [
          { "optionId": 1, "labels": ["ICE"] },
          { "optionId": 2, "labels": ["Medium"] },
          { "optionId": 3, "labels": ["샷 추가"] }
        ],
        "unitPrice": 5500
      }
    ],
    "status": "completed",
    "customerName": "김민수",
    "createdAt": "2026-04-08T09:15:00Z"
  }
}
```

**응답 (404):**

```json
{
  "error": "Not Found",
  "message": "주문을 찾을 수 없어요."
}
```

### `PATCH /api/orders/:orderId/cancel`

주문을 취소합니다. **이미 완료되거나 취소된 주문은 취소할 수 없습니다.**

**응답 (성공 — 200):**

```json
{
  "message": "주문이 취소되었습니다."
}
```

**응답 (충돌 — 409):**

```json
{
  "error": "Conflict",
  "message": "이미 완료된 주문은 취소할 수 없습니다."
}
```

## 가격 계산

메뉴의 최종 가격은 다음과 같이 계산됩니다:

```
최종 가격 = 기본 가격(price) + 선택한 옵션들의 추가 금액 합계
```

각 옵션의 `prices` 배열은 `labels` 배열과 1:1로 대응됩니다.

### 예시: 아메리카노 (기본 4,500원)

| 옵션 | 선택 | 추가 금액 |
|------|------|-----------|
| 온도 (grid) | ICE | +0원 |
| 사이즈 (grid) | Medium | +500원 |
| 진하기 (select) | 샷 추가 | +500원 |
| 추가옵션 (list) | 휘핑크림 | +500원 |
| **합계** | | **6,000원** |

## 필수 요구사항 (각 사용자는 PR에 해당 내용을 넣어주세요.)

### 1. 메뉴판 화면 (`/`)

- [ ] 메뉴 카테고리를 `GET /api/catalog/categories`로 가져와 탭/버튼으로 표시
- [ ] 메뉴 목록을 `GET /api/catalog/items`로 가져와 카드/리스트 형태로 표시
- [ ] 카테고리 클릭 시 해당하는 메뉴 목록만 화면에 노출
- [ ] 각 메뉴에 `iconImg`을 사용한 이미지, 이름, 가격 표시
- [ ] 메뉴 클릭 시 주문하기 페이지(`/menu/:itemId`)로 이동
- [ ] CTA(하단 버튼)에 장바구니에 담긴 전체 메뉴의 개수와 가격 표시
- [ ] 장바구니가 비어있는 경우 "장바구니 보기" 만 출력

### 2. 주문하기 화면 (`/menu/:itemId`)

- [ ] `GET /api/catalog/items/:itemId`로 메뉴 상세 정보 가져오기
- [ ] `GET /api/catalog/options`로 옵션 정보 가져오기
- [ ] 해당 메뉴의 `optionIds`에 해당하는 옵션만 표시
- [ ] 옵션 노출은 서버에서 내려온 순서대로 표시
- [ ] **`grid` 타입**: 그리드 형태로 아이콘과 함께 노출, **필수 선택**, 하나만 선택 가능
- [ ] **`select` 타입**: 셀렉트박스로 노출, 클릭 시 바텀시트 출력, 바텀시트에서 항목 선택 시 값 업데이트, **선택 사항**
- [ ] **`list` 타입**: 체크리스트로 노출, `minCount` ~ `maxCount` 범위 내에서 복수 선택 가능
- [ ] `list`에서 최소 선택 개수 미만으로 선택하고 CTA 클릭 시 Toast 등으로 안내 (예: "온도를 선택해주세요")
- [ ] `list`에서 최대 선택 개수 초과 시도 시 Toast 등으로 안내 (예: "최대 N개까지 선택할 수 있어요")
- [ ] 수량 선택 (1~99)
- [ ] 선택한 옵션에 따른 실시간 가격 계산 표시 (CTA에 `수량 * 가격` 노출)
- [ ] CTA 클릭 시 장바구니에 추가 후 메뉴판 화면으로 이동
- [ ] 존재하지 않는 메뉴 ID 접근 시 적절한 처리 (404)

### 3. 장바구니 화면 (`/cart`)

- [ ] 장바구니에 담은 메뉴 이름, 옵션 목록, 가격 노출
- [ ] 같은 메뉴 + 같은 옵션끼리 묶어서 수량 표기 (예: 아메리카노 HOT 2잔, ICE 1잔)
- [ ] 담은 수량을 반영한 총 가격 표기 (예: 아메리카노 2잔 = 4,500 * 2 = 9,000원)
- [ ] `x` 버튼으로 해당 메뉴-옵션 삭제
- [ ] 수량 변경 가능 (증가/감소)
- [ ] 장바구니가 비었을 때 빈 상태 안내
- [ ] CTA에 전체 주문 개수와 금액 노출
- [ ] CTA 클릭 시 `POST /api/orders` API를 호출하여 주문 생성
- [ ] 주문 API 실행 중 버튼이 중복 클릭되지 않도록 처리
- [ ] `POST /api/orders`에서 에러 응답 시 Toast로 에러 메시지 안내
- [ ] 주문 성공 시 장바구니 비우기 + 주문 완료 페이지(`/orders/:orderId`)로 이동

### 4. 주문 완료 화면 (`/orders/:orderId`)

- [ ] `GET /api/orders/:orderId`로 주문 정보 가져오기
- [ ] 총 개수와 금액을 화면에 노출
- [ ] CTA 버튼 클릭 시 메뉴판 화면으로 이동
- [ ] 존재하지 않는 주문 ID 접근 시 적절한 처리 (404)

### 상태 처리

- [ ] 로딩 중 표시
- [ ] API 에러 시 사용자 안내 + 재시도 가능
- [ ] 빈 데이터일 때 적절한 안내

## 선택 요구사항 (보너스)

- [ ] 장바구니 아이콘에 담긴 수량 배지 표시 (네비게이션 바)
- [ ] 메뉴 검색 기능 (이름으로 검색)
- [ ] 장바구니 데이터를 localStorage에 저장하여 새로고침 후에도 유지
- [ ] 반응형 레이아웃 (모바일 대응)
- [ ] URL 동기화 (선택된 카테고리를 쿼리스트링에 반영)
- [ ] 주문 내역 페이지 (`/orders`) 추가 — 내 전체 주문 리스트 표시
- [ ] 주문 취소 기능 (`PATCH /api/orders/:orderId/cancel`)
- [ ] 주문 완료 후 애니메이션 또는 토스트 메시지
- [ ] 키보드 접근성 (Tab 이동, Enter 선택)

## PR 작성 가이드

PR 본문에 아래 항목들을 포함해주세요. 코드만큼이나 **설계 판단의 근거**가 중요합니다.

### 1. 장바구니 상태 관리 전략
> 장바구니 데이터를 어떻게 관리했는지? (Context, useState, 전역 store 등)
> 같은 메뉴인데 옵션이 다른 경우 어떻게 구분했는지?
> 같은 메뉴 + 같은 옵션인 경우 수량 합산은 어떻게 처리했는지?

### 2. 옵션 선택 UI 설계
> grid / select / list 각 타입을 어떻게 UI로 구현했는지?
> select 타입의 바텀시트는 어떻게 구현했는지?
> 실시간 가격 계산은 어떻게 구현했는지?

### 3. 주문 플로우
> 메뉴 선택 → 옵션 선택 → 장바구니 → 주문 → 완료까지의 흐름을 어떻게 설계했는지?
> 주문 API의 에러 처리(400, 500)는 어떻게 대응했는지?
> 주문 중 중복 클릭 방지는 어떻게 처리했는지?

### 4. 컴포넌트 구조
> 어떤 기준으로 컴포넌트를 나눴나요?
> 폴더 구조는 어떻게 잡았고, 왜 그렇게 했나요?

### 5. 과제를 수행하는데 어려움은 없었나요?
> 어려웠던 부분이 있다면 말씀해주세요~! 추후 과제때 개선해보겠습니다.

### 6. 추가 라이브러리 (optional)
> 추가로 설치한 라이브러리가 있다면, 각각 왜 선택했는지 설명해주세요.

### 7. 아쉬운 점 / 개선하고 싶은 점 (optional)
> 시간이 더 있었다면 어떤 부분을 개선했을지 자유롭게 적어주세요.

## 제한시간

- 약 **6~8시간** (한 번에 할 필요 없음, 평일 저녁 + 주말 활용)
- **제출 마감**: 4월 12일 (일) 23시 59분 전까지 PR 제출

## 시작하기

```bash
# 본인 폴더로 이동
cd exam-3/{your-github-username}

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 브라우저에서 http://localhost:5173 열기
# 개발자 도구 > Console에서 "[MSW] Mocking enabled." 확인
# fetch('/api/catalog/items').then(r => r.json()).then(console.log) 으로 메뉴 조회 테스트
# fetch('/api/catalog/options').then(r => r.json()).then(console.log) 으로 옵션 조회 테스트
# 좌하단 Dev 버튼으로 Mock DevTool Panel을 열 수 있습니다.
# DevTool Panel에서 데이터 초기화, 초기 데이터 재생성, 강제 에러/지연 테스트가 가능합니다.
```

## 데이터 참고

### 메뉴 목록

Mock 데이터에는 총 **16개 메뉴**가 포함되어 있습니다.

| 카테고리 | 메뉴 수 | 예시 |
|----------|---------|------|
| 커피 | 8개 | 아메리카노, 카페라떼, 카푸치노, 바닐라 라떼, 카라멜 마키아또, 콜드브루, 에스프레소, 카페모카 |
| 음료 | 4개 | 녹차 라떼, 초콜릿 라떼, 유자차, 딸기 스무디 |
| 디저트 | 4개 | 크로와상, 치즈케이크, 초코 브라우니, 마들렌 |

전체 메뉴 목록은 [shared/menu.json](./shared/menu.json)에서 확인할 수 있습니다.

### 옵션 목록

총 **8개 옵션**이 정의되어 있습니다. 각 메뉴마다 적용 가능한 옵션이 `optionIds`로 지정됩니다.

| ID | 이름 | 타입 | 필수 | 설명 |
|---|---|---|---|---|
| 1 | 온도 | grid | O | HOT / ICE |
| 2 | 사이즈 | grid | O | Small / Medium(+500) / Large(+1,000) |
| 3 | 진하기 | select | X | 연하게 / 보통 / 진하게 / 샷 추가(+500) |
| 4 | 추가옵션 | list | X | 바닐라 시럽(+300) / 헤이즐넛(+300) / 카라멜(+300) / 휘핑크림(+500) / 오트밀크(+500), 최대 3개 |
| 5 | 사이즈 | grid | O | Medium / Large(+500) |
| 6 | 토핑 | list | X | 버터 / 잼 / 초콜릿소스(+300) / 아이스크림(+1,000), 최대 2개 |
| 7 | 당도 | select | X | 덜 달게 / 보통 / 달게 |
| 8 | 샷 | grid | O | 싱글 / 더블(+500) |

전체 옵션 목록은 [shared/options.json](./shared/options.json)에서 확인할 수 있습니다.

### 주문 상태

| 상태 | 설명 |
|------|------|
| `pending` | 주문 접수됨 (취소 가능) |
| `preparing` | 준비 중 (취소 가능) |
| `completed` | 완료 (취소 불가) |
| `cancelled` | 취소됨 (취소 불가) |

### 초기 주문 데이터

Mock API에는 테스트를 위한 초기 주문 데이터가 포함되어 있습니다. 다양한 상태의 주문이 미리 들어가 있으므로 주문 내역을 바로 확인할 수 있습니다.

데이터는 `localStorage`에 저장되므로 새로고침해도 유지됩니다. 기본 데이터로 되돌리고 싶다면 DevTool Panel에서 `Initial Data 생성`을 사용해주세요.

## API 문서 (Swagger UI)

로컬에서 인터랙티브 API 문서를 확인할 수 있습니다.

```bash
# 프로젝트 루트에서 실행
cd shared/api-docs
python3 -m http.server 9876

# 브라우저에서 http://localhost:9876 열기
```

> 포트가 이미 사용 중이라면 (`Address already in use`) 다른 포트를 사용하세요: `python3 -m http.server 9877`

모든 API 엔드포인트의 요청/응답 스키마, 에러 코드, 예시 데이터를 Swagger UI에서 확인할 수 있습니다.

## 참고 자료 (선택)

아래는 과제와 관련된 참고 자료입니다. 반드시 읽을 필요는 없지만 도움이 될 수 있습니다.

- [React 공식 문서 - Forms](https://react.dev/reference/react-dom/components/input)
- [React 공식 문서 - Context](https://react.dev/learn/passing-data-deeply-with-context)
- [TanStack Query - Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [MSW 공식 문서](https://mswjs.io/docs/)
