# 스터디 과제: 문제 유형 칩 대시보드

## 문제 설명

코딩테스트 스터디 관리 서비스의 일부 화면을 구현해주세요.

스터디원을 선택하고, 학습 단계·필터에 따라 **문제 유형 칩** 목록을 탐색한 뒤, 칩을 선택·해제할 수 있어야 합니다. 칩에는 스터디원별 **숙련도**가 색으로 반영됩니다.

## 기술 조건

- **TypeScript** 필수
- **React + Vite** 사용
- 스타일링 자유 (CSS Modules, Tailwind, styled-components, 순수 CSS 등 — 디자인 평가 아님)
- 상태 관리 방식 자유 (useState, Zustand, Jotai, Context 등)
- 추가 라이브러리 사용 자유 (단, 선택한 이유를 PR에 명시)

## 페이지 구성

이 과제는 **단일 페이지(SPA)** 로 구현하면 됩니다. 라우팅은 필수 아닙니다.

| 영역                      | 설명                                                                        |
| ------------------------- | --------------------------------------------------------------------------- |
| 좌측 패널                 | 스터디원 목록(스크롤). 멤버 선택 시 우측 데이터·상태가 요구사항에 맞게 갱신 |
| 우측 상단                 | 학습 단계 드롭다운, 빈출 토글·숙련도 필터·필터 초기화                       |
| 우측 본문                 | 분야/주제/난이도 구조의 문제 유형 칩 아코디언                               |
| 우측 하단(또는 툴바 인근) | 현재 화면에 보이는 범위에서 선택된 칩 개수 표시                             |

커리큘럼은 아래 계층을 가정합니다. 상위 1개에 하위 N개가 붙는 트리입니다.

| 구분      | 예시           |
| --------- | -------------- |
| 학습 단계 | 기초           |
| 분야      | 자료구조       |
| 주제      | 트리           |
| 문제 유형 | 이진 탐색 트리 |

**문제 유형 칩**은 `문제 유형 × 난이도(쉬움·보통·어려움)` 단위이며, 서버는 칩마다 `chipId`를 부여합니다. 서비스에서 자주 출제된다고 표시한 칩은 **빈출 유형 칩**입니다.

## API

보일러플레이트에 MSW(Mock Service Worker) 기반 Mock API가 포함되어 있습니다.

`pnpm run dev` 실행 시 자동으로 활성화됩니다.

> 개발자 도구 콘솔에서 `[MSW] Mocking enabled.` 가 출력되는지 확인해주세요.

### `GET /api/members`

스터디원 목록을 반환합니다. (실제 응답은 더 많은 항목 포함)

**응답 (성공):**

```json
[
  { "id": 1, "name": "김민준" },
  { "id": 2, "name": "이서연" }
]
```

```ts
type Member = {
  id: number;
  name: string;
};
```

### `GET /api/levels`

학습 단계 목록을 반환합니다.

**응답 (성공):**

```json
[
  { "key": "beginner", "name": "입문" },
  { "key": "basic", "name": "기초" },
  { "key": "advanced", "name": "심화" },
  { "key": "expert", "name": "실전" }
]
```

```ts
type Level = {
  key: string;
  name: string;
};
```

### `GET /api/problem-types?levelKey={levelKey}`

해당 학습 단계에 속한 문제 유형 칩 메타데이터를 반환합니다.

**응답 (성공):**

```json
[
  {
    "chipId": 101,
    "problemTypeId": 1001,
    "problemTypeName": "이진 탐색 트리",
    "difficulty": "easy",
    "topicId": 201,
    "topicName": "트리",
    "fieldId": 301,
    "fieldName": "자료구조",
    "frequent": true
  }
]
```

```ts
type ProblemTypeChip = {
  chipId: number;
  problemTypeId: number;
  problemTypeName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topicId: number;
  topicName: string;
  fieldId: number;
  fieldName: string;
  frequent: boolean;
};
```

### `GET /api/proficiency?memberId={memberId}&levelKey={levelKey}`

선택한 스터디원·학습 단계에 대한 숙련도 목록을 반환합니다.

**응답 (성공):**

```json
[
  { "chipId": 101, "proficiency": "PASSED" },
  { "chipId": 102, "proficiency": "FAILED" }
]
```

```ts
type Proficiency = {
  chipId: number;
  proficiency: 'UNSEEN' | 'FAILED' | 'PARTIAL' | 'PASSED' | 'MASTERED';
};
```

### 숙련도 단계 설명

| 값         | 의미                                                            |
| ---------- | --------------------------------------------------------------- |
| `UNSEEN`   | 미도전 (또는 응답에 해당 `chipId`가 없을 때 아래 규칙으로 간주) |
| `FAILED`   | 오답                                                            |
| `PARTIAL`  | 부분 통과                                                       |
| `PASSED`   | 통과                                                            |
| `MASTERED` | 완전 정복                                                       |

> `GET /api/proficiency` 응답에 포함되지 않은 `chipId`는 **`UNSEEN`** 으로 취급합니다.

> **학습 단계·분야/주제 구조**(`levels`, `problem-types`)는 자주 바뀌지 않는 데이터로 가정해도 됩니다. **숙련도**는 풀이할 때마다 갱신되는 데이터에 가깝습니다.

## 화면 데이터 구성 팁

- 칩 아코디언을 렌더하려면 여러 API 응답을 조합해 최종 데이터를 구성해야 합니다.
- 각 칩에는 문제 유형 메타데이터와 해당 스터디원의 숙련도가 함께 반영되어야 합니다.
- 화면 구성이 어려우시다면 `exam-4/_sample`에 예시 화면 이미지를 참고해주세요.

## 필수 요구사항 (각 사용자는 PR에 해당 내용을 넣어주세요.)

### 1. 스터디원 리스트 (좌측)

- [ ] 스터디원 목록을 `GET /api/members`로 가져와 스크롤 가능한 UI로 표시
- [ ] 최초 진입 시 목록의 **첫 번째 스터디원**이 선택된 상태
- [ ] 스터디원을 바꿀 때마다 아래 사항들을 초기화
  - 문제 유형 칩 선택: 모두 해제
  - 아코디언: 모두 펼침
  - 빈출 유형만 보기: OFF
  - 숙련도 필터: 선택 없음

### 2. 학습 단계·칩 필터 (우측 상단)

- [ ] 학습 단계 드롭다운을 `GET /api/levels`로 구성
- [ ] 선택한 `levelKey`에 맞춰 하단 칩 데이터를 구성
- [ ] 스터디원을 변경하면 학습 단계는 **기초(`basic`)** 로 초기화
- [ ] 학습 단계만 변경하면 **문제 유형 칩 선택 상태만** 초기화 (빈출 토글·숙련도 필터 값은 유지)
- [ ] 칩 필터 영역에 다음 3가지 포함
  - **빈출 유형만 보기** 필터
  - **숙련도** 다중 필터
  - **필터 초기화** 버튼

### 3. 문제 유형 칩 아코디언 (우측 본문)

- [ ] API 응답을 조합해 칩별 숙련도가 반영된 렌더 데이터 생성
- [ ] 필터 아래에 분야/주제 기준 **아코디언 리스트** 표시
- [ ] 레이아웃: 헤더 + N개 아코디언 / 아코디언 = **분야** / row = **주제** / row당 열 3개 = **쉬움·보통·어려움** / 열 안에 **문제 유형 칩**, 칩 색은 **숙련도**
- [ ] 아코디언 헤더 클릭으로 열림·닫힘, 기본은 **펼침**, **여러 개 동시에 펼침 가능**
- [ ] 칩 클릭으로 선택·해제
- [ ] 칩 선택 상태는 비선택과 명확히 구분되도록 시각적으로 표시(예: 테두리/배경/체크 아이콘)
- [ ] 빈출 유형 칩은 칩 자체에 구분 가능한 표식(배지/아이콘 등)을 표시

### 4. 필터 동작·Empty·선택 개수

- [ ] 빈출 필터 ON이면 빈출로 표시된 칩만 노출. 필터 ON/OFF 시 **칩 선택 상태는 유지**
- [ ] 숙련도 필터는 다중 선택. 선택한 숙련도에 해당하는 칩만 노출
- [ ] 각 숙련도 옆에 **해당 숙련도의 칩 개수** 표시
  - 개수의 모수는 **빈출 필터 상태만** 반영.
    - 빈출 ON: 빈출 칩 대상 기준 숙련도별 개수
    - 빈출 OFF: 전체 칩 기준 숙련도별 개수
- [ ] 필터 적용 후 칩이 없는 row·아코디언은 **DOM에 남기지 않음**
- [ ] 필터 초기 상태: 빈출 OFF, 숙련도 선택 없음
- [ ] **초기화** 클릭 시 빈출·숙련도 필터만 초기 상태로. **학습 단계·칩 선택은 변경하지 않음**
- [ ] 필터 후 화면에 칩이 하나도 없으면 **Empty** UI를 표시.
- [ ] 선택한 칩 개수 표시. 개수는 현재 렌더된 칩(선택된 level + 빈출/숙련도 필터 적용 결과) 중 선택된 칩 수와 일치 (아코디언이 닫혀 있어도 내부에 선택된 칩이 있으면 개수에 포함)

### 상태 처리

- [ ] 로딩 중 표시
- [ ] API 에러 시 사용자 안내 + 재시도 가능
- [ ] 빈 데이터일 때 적절한 안내

## 선택 요구사항 (보너스)

- [ ] 분야·주제 헤더에 체크박스 제공: 하위 칩 일괄 선택/해제
  - 체크박스 상태는 `checked` / `unchecked` / `indeterminate` 를 반영
  - 체크박스의 집계·동작 대상은 **현재 렌더된 칩(선택 level + 빈출/숙련도 필터 적용 결과)** 기준
- [ ] 로딩 스켈레톤 또는 스피너
- [ ] Empty 세분화: Empty를 "원본 데이터 없음"과 "필터 결과 없음"으로 구분해 표시
- [ ] `React.memo`, `useMemo`, `useCallback` 등으로 불필요한 리렌더 완화
- [ ] 스터디원별 마지막 선택 학습 단계를 기억하여, 재선택 시 해당 단계로 복원

## PR 작성 가이드

PR 본문에 아래 항목들을 포함해주세요. 코드만큼이나 **설계 판단의 근거**가 중요합니다.

### 1. 데이터 변환·조합 전략

> 여러 API 응답을 화면에 맞는 구조로 가공하는 과정을 간략히 설명해주세요.  
> 그 로직을 어디에 두었고, 왜 그렇게 결정했나요?

### 2. 상태 관리 전략

> 스터디원 변경·학습 단계 변경 시 초기화 범위가 다른데, 이 규칙을 상태 구조에서 어떻게 표현했나요?

### 3. 필터링 전략

> 빈출 토글과 숙련도 필터를 동시에 적용할 때 순서와 규칙은?  
> 필터 결과가 없을 때 UI를 어떻게 처리했나요?

### 4. 컴포넌트 구조

> 컴포넌트·폴더를 나눈 기준은?

### 5. 과제를 수행하는데 어려움은 없었나요?

> 어려웠던 부분이 있다면 말씀해주세요. 추후 과제에서 개선해보겠습니다.

### 6. 추가 라이브러리 (optional)

> 추가로 설치한 라이브러리가 있다면, 각각 왜 선택했는지 설명해주세요.

### 7. 아쉬운 점 / 개선하고 싶은 점 (optional)

> 시간이 더 있었다면 어떤 부분을 개선했을지 자유롭게 적어주세요.

## 제한시간

- 약 **6~8시간** (한 번에 할 필요 없음)
- **제출**: 4월 20일 23시 59분까지 PR 제출 (일정은 스터디 운영에 맞게 조정 가능)

## 시작하기

```bash
# 본인 폴더로 이동 (절대경로 예시)
cd exam-4/{your-github-username}

# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 브라우저에서 http://localhost:5173 열기
# 개발자 도구 > Console에서 "[MSW] Mocking enabled." 확인
# fetch('/api/members').then(r => r.json()).then(console.log) 로 멤버 조회 테스트
# fetch('/api/levels').then(r => r.json()).then(console.log) 로 학습 단계 조회 테스트
# fetch('/api/problem-types?levelKey=basic').then(r => r.json()).then(console.log) 으로 문제 유형 조회 테스트
# fetch('/api/proficiency?memberId=1&levelKey=basic').then(r => r.json()).then(console.log) 으로 숙련도 조회 테스트
# 좌하단 Dev 버튼으로 Mock DevTool Panel을 열 수 있습니다.
# DevTool Panel에서 데이터 초기화, 초기 데이터 재생성, 강제 에러/지연 테스트가 가능합니다.
```

## 데이터 참고

Mock 시드 데이터는 저장소 루트의 `shared/` 아래 JSON으로 제공되며, `{your-github-username}/src/shared/*.ts`에서 불러옵니다. 런타임에는 `{your-github-username}/src/mocks/storage.ts`가 `localStorage`에 복제해 두고, `{your-github-username}/src/mocks/handlers.ts`가 이를 읽어 응답합니다.

| 파일                        | 용도                                                                |
| --------------------------- | ------------------------------------------------------------------- |
| `shared/members.json`       | 스터디원 목록                                                       |
| `shared/levels.json`        | 학습 단계                                                           |
| `shared/problem-types.json` | 단계별 문제 유형 칩 메타                                            |
| `shared/proficiency.json`   | 멤버·단계별 숙련도 (핸들러에서 `memberId`·`levelKey`에 맞게 필터링) |

핸들러·스토리지 패턴은 `{your-github-username}/src/mocks/handlers.ts`, `{your-github-username}/src/mocks/storage.ts` 를 참고하면 됩니다.

## 참고 자료 (선택)

아래는 과제와 관련된 참고 자료입니다. 반드시 읽을 필요는 없지만 도움이 될 수 있습니다.

- [React 공식 문서](https://react.dev/)
- [TanStack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [MSW 공식 문서](https://mswjs.io/docs/)
