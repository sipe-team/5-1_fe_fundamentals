# Exam 2: 회의실 예약 시스템

## 문제 설명

사내 **회의실 예약 시스템**을 구현해주세요.

사용자가 날짜를 선택하고, 회의실별 예약 현황을 타임라인으로 확인한 뒤, 빈 시간대에 예약을 생성하거나 기존 예약을 취소할 수 있어야 합니다.

## 기술 조건

- **TypeScript** 필수
- **React** 사용
- 스타일링 자유 (CSS Modules, Tailwind, styled-components, 순수 CSS 등 — 디자인 평가 아님)
- 추가 라이브러리 사용 자유 (단, 선택한 이유를 PR에 명시)

## 페이지 구성

이 과제는 **4개 페이지**로 구성된 SPA입니다. 적절한 라우팅 라이브러리를 사용해주세요.

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 타임라인 | `/` | 날짜별 회의실 예약 현황 조회 |
| 예약 생성 | `/reservations/new` | 예약 생성 폼 |
| 예약 상세 | `/reservations/:id` | 예약 상세 정보 + 취소 |
| 내 예약 목록 | `/my-reservations` | 내가 생성한 예약 리스트 |

> 타임라인에서 빈 시간대를 클릭하면 예약 생성 페이지로 이동합니다.
> 이때 선택한 회의실, 날짜, 시작 시간 정보가 예약 생성 폼의 초기값으로 반영될 수 있어야 합니다.
> 전달 방식은 자유롭게 선택해주세요. 예를 들어 쿼리스트링을 사용할 수도 있습니다.
> 예: `/reservations/new?roomId=room-a&date=2026-04-07&startTime=10:00`

## API

보일러플레이트에 MSW(Mock Service Worker) 기반 Mock API가 포함되어 있습니다.

`pnpm dev` 실행 시 자동으로 활성화됩니다.

> **주의**: Mock API는 간헐적으로 **느린 응답(최대 ~5초)**과 **에러 응답(500, 503)**을 반환합니다.
> 실제 서비스 환경을 시뮬레이션한 것이므로, 이에 대한 적절한 처리가 필요합니다.

### `GET /api/rooms`

전체 회의실 목록을 반환합니다.

**응답 (성공):**

```json
{
  "rooms": [
    {
      "id": "room-a",
      "name": "회의실 A",
      "floor": 2,
      "capacity": 4,
      "equipment": ["monitor", "whiteboard"]
    },
    {
      "id": "room-b",
      "name": "회의실 B",
      "floor": 3,
      "capacity": 8,
      "equipment": ["monitor", "whiteboard", "video_conference"]
    }
  ]
}
```

### `GET /api/reservations?date={YYYY-MM-DD}`

특정 날짜의 전체 예약 목록을 반환합니다.

| 파라미터 | 타입 | 설명 | 예시 |
|----------|------|------|------|
| `date` | string | 조회할 날짜 (YYYY-MM-DD) | `2026-04-07` |

**응답 (성공):**

```json
{
  "reservations": [
    {
      "id": "rsv-001",
      "roomId": "room-a",
      "date": "2026-04-07",
      "startTime": "09:00",
      "endTime": "10:00",
      "title": "주간 스크럼",
      "organizer": "김철수",
      "attendees": 3,
      "createdAt": "2026-04-01T09:00:00Z"
    }
  ]
}
```

### `GET /api/reservations/:id`

특정 예약의 상세 정보를 반환합니다.

**응답 (성공):**

```json
{
  "reservation": {
    "id": "rsv-001",
    "roomId": "room-a",
    "date": "2026-04-07",
    "startTime": "09:00",
    "endTime": "10:00",
    "title": "주간 스크럼",
    "organizer": "김철수",
    "attendees": 3,
    "createdAt": "2026-04-01T09:00:00Z"
  }
}
```

**응답 (404):**

```json
{
  "error": "Not Found",
  "message": "해당 예약을 찾을 수 없습니다."
}
```

### `GET /api/my-reservations`

내가 생성한 예약 목록을 반환합니다.

**응답 (성공):**

```json
{
  "reservations": [
    {
      "id": "rsv-001",
      "roomId": "room-a",
      "date": "2026-04-07",
      "startTime": "09:00",
      "endTime": "10:00",
      "title": "주간 스크럼",
      "organizer": "김철수",
      "attendees": 3,
      "createdAt": "2026-04-01T09:00:00Z"
    }
  ]
}
```

### `POST /api/reservations`

새 예약을 생성합니다. **서버에서 시간 충돌을 검증**합니다.

**요청 바디:**

```json
{
  "roomId": "room-a",
  "date": "2026-04-07",
  "startTime": "10:00",
  "endTime": "11:30",
  "title": "디자인 리뷰",
  "organizer": "박영희",
  "attendees": 4
}
```

**응답 (성공 — 201):**

```json
{
  "reservation": {
    "id": "rsv-002",
    "roomId": "room-a",
    "date": "2026-04-07",
    "startTime": "10:00",
    "endTime": "11:30",
    "title": "디자인 리뷰",
    "organizer": "박영희",
    "attendees": 4,
    "createdAt": "2026-04-01T10:30:00Z"
  }
}
```

**응답 (충돌 — 409):**

```json
{
  "error": "Conflict",
  "message": "해당 시간대에 이미 예약이 존재합니다.",
  "conflictWith": {
    "id": "rsv-001",
    "title": "주간 스크럼",
    "startTime": "09:00",
    "endTime": "10:00"
  }
}
```

### `DELETE /api/reservations/:id`

예약을 취소(삭제)합니다.

**응답 (성공 — 200):**

```json
{
  "message": "예약이 취소되었습니다."
}
```

**응답 (에러 — 간헐적 발생):**

```json
{
  "error": "Internal Server Error",
  "message": "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
}
```

## 타임라인 UI 참고

타임라인은 화려한 캘린더 라이브러리를 사용할 필요 없습니다. **30분 단위의 그리드/테이블**로 충분합니다.

```
날짜: 2026-04-07 (월)

              09:00  09:30  10:00  10:30  11:00  11:30  12:00  ...
회의실 A    [██ 주간 스크럼 ██]  [████ 디자인 리뷰 ████]
회의실 B                  [████████ 기획 회의 ████████]
회의실 C     (빈 시간대 클릭 → 예약 생성 페이지로 이동)
```

## 필수 요구사항 (각 사용자는 PR에 해당 내용을 넣어주세요.)

### 타임라인 페이지 (`/`)

- [x] 날짜 선택 (날짜를 변경하면 해당 날짜의 예약 현황을 조회)
- [x] 회의실별 예약 현황을 타임라인(30분 단위 그리드)으로 표시
- [x] 예약된 시간대와 빈 시간대를 시각적으로 구분
- [x] 예약 블록에 제목 표시
- [x] 예약 블록 클릭 시 예약 상세 페이지(`/reservations/:id`)로 이동
- [x] 빈 시간대 클릭 시 예약 생성 페이지(`/reservations/new`)로 이동 (회의실, 날짜, 시간 정보를 적절한 방식으로 전달)

### 예약 생성 페이지 (`/reservations/new`)

- [x] 이전 화면에서 전달된 정보(회의실, 날짜, 시작 시간)를 폼 초기값으로 설정
- [x] 입력 필드: 회의실 선택, 날짜, 시작 시간, 종료 시간, 회의 제목, 예약자명, 참석 인원
- [x] 클라이언트 측 유효성 검증 (빈 값, 시작 >= 종료, 과거 시간 등)
- [x] 서버 측 충돌 에러(409) 발생 시 사용자에게 충돌 정보 안내
- [x] 예약 생성 성공 후 타임라인 페이지로 이동

### 예약 상세 페이지 (`/reservations/:id`)

- [ ] 예약 상세 정보 표시 (회의실, 날짜, 시간, 제목, 예약자, 참석 인원)
- [ ] 예약 취소 버튼 + 취소 전 확인 다이얼로그
- [ ] 취소 성공 후 이전 페이지로 이동
- [ ] 존재하지 않는 예약 ID 접근 시 적절한 처리 (404)

### 내 예약 목록 페이지 (`/my-reservations`)

- [ ] 내가 생성한 예약 리스트 표시
- [ ] 각 예약 항목 클릭 시 상세 페이지로 이동
- [ ] 예약이 없을 때 빈 상태 안내

### 회의실 필터

- [ ] 수용 인원으로 필터 (예: "4인 이상")
- [ ] 장비로 필터 (예: "화상회의 장비 있는 회의실만")

### 상태 처리

- [ ] 로딩 중 표시
- [ ] API 에러 시 사용자 안내 + 재시도 가능
- [ ] 예약이 없는 날짜일 때 빈 상태 안내

## 선택 요구사항 (보너스)

- [ ] 드래그로 시간대 선택 (타임라인에서 드래그하여 시작~종료 지정)
- [ ] 예약 수정 기능 (시간 변경, 제목 수정)
- [ ] 반응형 레이아웃 (모바일에서는 회의실별 세로 스크롤 등)
- [ ] URL 동기화 (선택된 날짜, 필터 상태를 쿼리스트링에 반영)
- [ ] 키보드 접근성 (Tab으로 시간대 이동, Enter로 선택)
- [ ] 내 예약 목록에서 날짜별 그룹핑
- [ ] 예약 상세 페이지에서 해당 날짜 타임라인 미리보기

## PR 작성 가이드

PR 본문에 아래 항목들을 포함해주세요. 코드만큼이나 **설계 판단의 근거**가 중요합니다.

### 1. 시간 충돌 검증 전략
> 시간 충돌을 어떻게 검증했는지 설명해주세요.

### 2. 상태 관리 전략
> 예약 데이터를 어떻게 관리하는지? (TanStack Query, useState, 전역 store 등)
> 예약 생성/취소 후 여러 페이지의 데이터를 어떻게 동기화하는지?

### 3. 폼 상태 관리
> 예약 생성 폼의 상태를 어떻게 관리했는지?
> 유효성 검증은 어디서, 어떻게 처리했는지?

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
- **제출 마감**: 4월 5일 (월) 23시 59분 전까지 PR 제출

## 시작하기

```bash
# 본인 폴더로 이동
cd exam-2/{your-github-username}

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 브라우저에서 http://localhost:5173 열기
# 개발자 도구 > Console에서 "[MSW] Mocking enabled." 확인
# fetch('/api/rooms').then(r => r.json()).then(console.log) 으로 API 테스트
# fetch('/api/reservations?date=2026-04-07').then(r => r.json()).then(console.log) 으로 예약 조회 테스트
# 좌하단 Dev 버튼으로 Mock DevTool Panel을 열 수 있습니다.
# DevTool Panel에서 데이터 초기화, 초기 데이터 재생성, 강제 에러/지연 테스트가 가능합니다.
```

## 데이터 참고

### 회의실 목록

Mock 데이터에는 총 **20개 회의실**이 포함되어 있습니다.

기본 예시는 아래와 같고, 전체 목록은 [shared/rooms.json](./shared/rooms.json)에서 확인할 수 있습니다.

| ID | 이름 | 층 | 수용인원 | 장비 |
|---|---|---|---|---|
| room-a | 회의실 A (소) | 2F | 4명 | 모니터, 화이트보드 |
| room-b | 회의실 B (중) | 3F | 8명 | 모니터, 화이트보드, 화상회의 |
| room-c | 회의실 C (대) | 3F | 15명 | 모니터, 화이트보드, 화상회의, 빔프로젝터 |
| room-d | 미팅룸 D (소) | 4F | 3명 | 모니터 |
| room-e | 미팅룸 E (중) | 4F | 6명 | 모니터, 화이트보드 |

### 시간 범위

- 예약 가능 시간: **09:00 ~ 18:00**
- 최소 단위: **30분**
- 최소 예약 시간: **30분**
- 최대 예약 시간: **4시간**

### 초기 예약 데이터

Mock API에는 테스트를 위한 초기 예약 데이터가 포함되어 있습니다. `2026-04-07 (월)` 날짜에 여러 예약이 미리 들어가 있으므로, 이 날짜로 테스트하면 타임라인을 바로 확인할 수 있습니다.

예약/회의실 데이터는 `localStorage`에 저장되므로 새로고침해도 유지됩니다. 기본 데이터로 되돌리고 싶다면 DevTool Panel에서 `Initial Data 생성`을 사용해주세요.

## 참고 자료 (선택)

아래는 과제와 관련된 참고 자료입니다. 반드시 읽을 필요는 없지만 도움이 될 수 있습니다.

- [React 공식 문서 - Forms](https://react.dev/reference/react-dom/components/input)
- [TanStack Query - Mutations](https://tanstack.com/query/latest/docs/framework/react/guides/mutations)
- [TanStack Query - Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [CSS Grid Layout Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
