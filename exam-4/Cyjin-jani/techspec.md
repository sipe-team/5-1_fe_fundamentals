# 기술 설계서 (Tech Spec)

문제 유형 칩 대시보드 과제 구현을 위한 설계·구현 기준 문서입니다. **§10~§12**는 구현 순서·방식·검증까지 포함해, 가능한 한 **본 문서만으로 구현을 끝까지 진행**할 수 있게 썼습니다. 용어·최종 요구의 원문은 [README.md](./README.md)를 기준으로 한다.

---

## 1. 목적

- MSW Mock API 네 가지를 **TanStack Query**로 가져오고, 화면 규칙은 **가능한 단순한 클라이언트 상태**로 표현한다.
- **서버 스냅샷**과 **UI 상태**의 경계를 명확히 하여 PR의 “데이터 조합·상태·필터 전략” 설명과 코드가 일치하도록 한다.

---

## 2. 기술 스택 결정

| 영역            | 선택                              | 비고                                         |
| --------------- | --------------------------------- | -------------------------------------------- |
| 언어·빌드       | TypeScript, React 18, Vite        | 과제 조건                                    |
| 서버 상태       | **TanStack Query (v5)**           | 로딩·에러·재시도·캐시                        |
| 쿼리 정의       | **`queryOptions` 팩토리**         | 키·`queryFn`·`enabled`·`retry` 등 한곳 집약  |
| 클라이언트 상태 | **`useState` + 의미 있는 핸들러** | Zustand 미사용. 과제 단일 페이지 규모에 맞춤 |
| 도메인 가공     | **컴포넌트 외부 순수 함수**       | 병합·필터·트리 생성·개수 집계                |

---

## 3. 아키텍처 원칙

1. **Query는 서버 데이터만** 담당한다. `members`, `levels`, `problem-types`, `proficiency`는 캐시 키로 구분한다.
2. **선택·필터·아코디언 열림** 등은 로컬 state로 둔다. 초기화 규칙은 **핸들러별로 명시**한다 (`handleSelectMember`, `handleLevelChange`, `handleResetFilters` 등).
3. **파생 UI 모델**(필터 적용 후 트리, 선택 개수, 숙련도별 개수)은 `useMemo` + 순수 함수로 계산한다. Store에 거대한 트리를 저장하지 않는다.

---

## 4. 서버 상태 — TanStack Query

### 4.1 `queryOptions` 팩토리 패턴

- 각 API마다 `getXxxQueryOptions(...)` 함수를 두고, `useQuery(getXxxQueryOptions(...))` 형태로만 사용한다.
- `prefetchQuery` / `invalidateQueries` 시에도 동일 팩토리를 재사용해 키 불일치를 방지한다.

**예시 (프로젝트 경로·이름은 구현 시 조정):**

```ts
// data/queries/… 등
import { queryOptions } from '@tanstack/react-query';
import { fetchMembers } from '@/data/api';

export function getMembersQueryOptions() {
  return queryOptions({
    queryKey: ['members'] as const,
    queryFn: fetchMembers,
    staleTime: 1000 * 60 * 5, // levels/problem-types와 동급으로 길게 가능
  });
}
```

### 4.2 쿼리 키·활성화

| 팩토리        | `queryKey`                            | `enabled`                                                                                                                                                                |
| ------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| members       | `['members']`                         | 항상 true                                                                                                                                                                |
| levels        | `['levels']`                          | 항상 true                                                                                                                                                                |
| problem-types | `['problem-types', levelKey]`         | `Boolean(levelKey)`                                                                                                                                                      |
| proficiency   | `['proficiency', memberId, levelKey]` | `Boolean(levelKey)` — `memberId`는 팩토리 인자에서 `number`만 받음(선택 확정 후). 미선택 상태에서는 상위에서 이 쿼리를 쓰지 않거나, 멤버 확정 하위에서만 `useQuery` 호출 |

### 4.3 `staleTime` 가이드

- README상 **levels·problem-types**는 자주 바뀌지 않는 데이터로 가정 가능 → 상대적으로 긴 `staleTime` 허용.
- **proficiency**는 갱신이 잦다고 가정 → 짧은 `staleTime` 또는 이후 `invalidateQueries`로 맞춤.

### 4.4 에러·재시도

- API 레이어에서 `!res.ok` 시 일관된 에러 객체(예: `status` 포함)를 throw하도록 맞춘 뒤, 팩토리의 `retry`에서 **404 등은 재시도 제외** 같은 정책을 둘 수 있다.
- UI: `isError`, 메시지 표시, `refetch` 버튼으로 재시도.

---

## 5. 클라이언트 상태

### 5.1 상태 필드 (제안)

- `selectedMemberId: number | null` — 멤버 로드 후 첫 항목으로 설정.
- `levelKey: string` — 기본값 `'basic'`.
- `selectedChipIds: Set<number>` 또는 동등 표현 — `chipId` 기준.
- `frequentOnly: boolean` — 빈출만 보기.
- `proficiencyFilter: Set<Proficiency>` — 다중 선택; 비어 있으면 “숙련도 필터 없음”.
- `expandedFieldIds: Set<number>` — 펼쳐진 **분야(fieldId)**. 기본은 모두 펼침(필터 후 남는 분야에 맞춰 동기화 필요 시 구현에서 정의).

### 5.2 초기화 규칙 (README 대응)

| 이벤트               | 칩 선택   | 아코디언  | 빈출 | 숙련도 필터 | `levelKey`         |
| -------------------- | --------- | --------- | ---- | ----------- | ------------------ |
| **스터디원 변경**    | 전부 해제 | 모두 펼침 | OFF  | 선택 없음   | **`basic`**        |
| **학습 단계만 변경** | 전부 해제 | 유지      | 유지 | 유지        | (사용자가 고른 값) |
| **필터 초기화 버튼** | 유지      | 유지      | OFF  | 선택 없음   | 유지               |

- 빈출 ON/OFF 시 **칩 선택은 유지**.

### 5.3 최초 진입

- `members` 로드 완료 후 `selectedMemberId`가 없으면 **첫 번째 멤버** 선택.
- 이때 “멤버 변경”과 동일한 대규모 리셋을 쓰면 `levelKey`가 `basic`으로 덮일 수 있으므로, **초기 하이드레이션**은 `setSelectedMemberId(first.id)`만 하거나, 별도 `bootstrap` 플래그로 한 번만 처리하는 방식을 택한다.

---

## 6. 데이터 변환 파이프라인 (순수 함수)

구현 시 모듈 예: `src/domain/chipModel.ts` 등.

1. **`proficiency` 맵**
   - `GET /api/proficiency` 배열 → `Map<chipId, proficiency>`. 응답에 없는 `chipId`는 **`UNSEEN`**.

2. **병합**
   - `problem-types` 각 행에 `proficiency`를 붙인 **칩 배열** 생성.

3. **숙련도 옆 “개수” (모수)**
   - **빈출 필터만** 반영한 집합(빈출 ON이면 `frequent === true`만)으로 숙련도별 개수 집계.
   - **숙련도 다중 필터는 개수 계산에 사용하지 않음** (README).

4. **화면 노출 필터**
   - 빈출 ON → `frequent`만.
   - 숙련도 필터가 비어 있지 않으면 → 해당 숙련도만.
   - 둘 다 AND.

5. **아코디언 트리**
   - 필터 후 남은 칩으로 **field → topic → (easy | medium | hard 열)** 구조 생성.
   - 칩이 없는 **주제(row)·분야(아코디언)** 는 **렌더하지 않음** (DOM에 남기지 않음).

6. **선택 개수**
   - “현재 level + 빈출 + 숙련도 필터”가 만든 **보이는 칩 집합** ∩ `selectedChipIds`.
   - 아코디언이 접혀 있어도 선택된 칩은 개수에 포함.

7. **Empty**
   - 필터 적용 후 보이는 칩이 0개면 Empty UI. (선택: 원본 없음 vs 필터 결과 없음 구분은 보너스.)

---

## 7. 컴포넌트 구조 (제안)

과제 규모에 맞게 얇게 유지한다.

```
src/
  data/
    api/               # ky(`ky.ts`) + 엔드포인트(`index.ts`)
    queries/           # index.ts — getMembersQueryOptions 등
    queryClient.ts     # QueryClient 인스턴스
  domain/              # 순수 함수: merge, filter, buildAccordionTree, counts
  components/
    MemberPanel.tsx
    LevelAndFilters.tsx
    ChipAccordion.tsx  # 분야 아코디언 + 주제 행 + 3열 칩
    SelectedChipCount.tsx
    EmptyState.tsx
    ErrorState.tsx
  App.tsx 또는 pages/Dashboard.tsx
```

- 상위 컴포넌트에서 Query 훅 + 로컬 state + `useMemo` 파생만 묶고, 자식은 props로 받기.

---

## 8. UX — 로딩·에러·빈 데이터

- 로딩: 스피너/스켈레톤/문구 중 택1 (README 필수: 로딩 표시).
- 에러: 사용자 메시지 + 재시도 (`refetch`).
- 빈 데이터: 멤버/칩 없음 등 적절한 안내.

---

## 9. README 필수 vs 선택

- **필수**: README “필수 요구사항” 및 “상태 처리”.
- **선택(보너스)**: README “선택 요구사항” — 분야·주제 **일괄 선택 체크박스**, Empty 세분화, `React.memo`/`useMemo` 최적화, 멤버별 마지막 `levelKey` 기억 등.
  - 본 설계서의 체크박스·persist는 **보너스 구현 시** domain을 “현재 렌더된 칩 집합” 기준으로 맞춘다.

---

## 10. 구현 순서 (상세)

이 섹션은 **README 없이 techspec만** 따라도 구현이 끝까지 이어지도록 단계·산출물·검증을 적어 둔다. 각 Phase가 끝나면 **완료 조건**을 통과했는지 확인한 뒤 다음 Phase로 넘어간다.

### Phase A — 프로젝트 부트스트랩

- [x] `@tanstack/react-query` 설치
- [x] `main.tsx`에서 `QueryClient`·`QueryClientProvider`로 앱 래핑 (`retry`·`refetchOnWindowFocus` 등 최소 설정)
- [x] `pnpm dev` 후 콘솔에 `[MSW] Mocking enabled.` 확인
- [x] Dev 패널로 지연·에러 동작을 한 번 확인

### Phase B — 타입·API 클라이언트

- [x] `Member`, `Level`, `ProblemTypeChip`, `Proficiency` 타입 정의 (`src/types` 등, API와 리터럴·유니온 일치)
- [x] `src/data/api/ky.ts`: `prefix: '/api'`, 비 OK 시 ky `HTTPError` (`error.response.status`)
- [x] `fetchMembers`, `fetchLevels`, `fetchProblemTypes(levelKey)`, `fetchProficiency(memberId, levelKey)` 작성·반환 타입 명시
- [x] 네 함수 타입 체크 통과, 컴포넌트 없이 import만으로 호출 가능

### Phase C — `queryOptions` 팩토리

- [x] `src/data/queries/`에 §4.2와 동일한 `queryKey`·`enabled`로 팩토리 네 개
- [x] `queryFn`은 Phase B 함수 사용
- [x] `members`·`levels`·`problem-types`: 긴 `staleTime` / `proficiency`: 짧은 `staleTime` 또는 기본값
- [x] `useQuery(...)`로 데이터 확인(화면 또는 콘솔)
- [x] `levelKey` 비었을 때 problem-types·proficiency 요청이 나가지 않음(`enabled` / `skipToken`). proficiency는 `memberId`가 확정된 뒤 `number`로만 팩토리에 전달

### Phase D — 도메인 순수 함수 (`src/domain`)

함수 이름은 예시이며, 한 파일·여러 파일 모두 가능. 입력·출력만 맞춘다.

- [ ] **D1** `buildProficiencyMap(rows)` — 응답 배열 → `Map<chipId, proficiency>`
- [ ] **D2** `mergeChips(problemTypes, proficiencyMap)` — 칩에 `proficiency` 부여, 맵 없으면 `'UNSEEN'`
- [ ] **D3** `filterByFrequent(chips, frequentOnly)` — 빈출 ON이면 `frequent === true`만
- [ ] **D4** `filterByProficiency(chips, selectedSet)` — Set 비어 있으면 전부 통과, 아니면 해당 숙련도만
- [ ] **D5** `countByProficiencyForFilterUI(chips, frequentOnly)` — 모수는 빈출만, 숙련도 다중 필터는 사용 안 함
- [ ] **D6** `buildAccordionTree(chips)` — D4까지 적용된 칩으로 트리, 빈 topic·field 미포함
- [ ] **D7** `countSelectedVisible(selectedIds, visibleChipIds)` — D4 직후 `chipId` 집합 기준 교집합 크기
- [ ] (선택) `buildViewModel(merged, { frequentOnly, proficiencyFilter })`로 D3→D4→D5·D6·visible id set 묶기
- [ ] 샘플/MSW 데이터로 D6에 빈 주제·빈 분야 없음 확인
- [ ] 숙련도 필터를 바꿔도 D5 개수는 **빈출 모수만** 반영되는지 확인

### Phase E — 페이지 셸·로컬 상태

- [ ] `Dashboard.tsx`(또는 `App.tsx`)에 Query 네 개·`enabled` 반영
- [ ] §5.1 로컬 state 선언
- [ ] `handleSelectMember`, `handleLevelChange`, `handleResetFilters`, `toggleFrequent`, `toggleProficiencyInFilter`, `toggleChipSelection`, `toggleFieldAccordion` (§5.2대로 초기화 주석/구현)
- [ ] `members` 로드 후 `selectedMemberId === null`이면 첫 멤버 id **한 번만** 설정(§5.3, `handleSelectMember` 재사용 시 `levelKey` 덮어쓰기 주의)
- [ ] 로드 후 `useMemo` 파생이 에러 없이 트리 생성(UI 없어도 됨)

### Phase F — 좌측 스터디원 패널

- [ ] 스크롤 가능한 리스트, 선택 행 강조, 클릭 시 `handleSelectMember`
- [ ] 첫 진입 시 첫 멤버 선택
- [ ] 멤버 변경 시 칩 해제·아코디언 전부 펼침·빈출 OFF·숙련도 필터 클리어·`levelKey === 'basic'`

### Phase G — 우측 상단 (학습 단계·필터)

- [ ] `levels` 드롭다운, 변경 시 `handleLevelChange`(칩 선택만 초기화)
- [ ] 빈출 토글, 숙련도 다중 토글 + **D5** 개수 표시
- [ ] 필터 초기화 → `handleResetFilters`
- [ ] 단계만 변경 시 빈출·숙련도 필터 유지
- [ ] 필터 초기화는 빈출·숙련도만, 단계·칩 선택 유지
- [ ] 빈출 토글 시 칩 선택 유지, 숙련도 개수는 빈출 모수만 반영

### Phase H — 우측 본문 (아코디언·칩)

- [ ] D6 모델 렌더: 분야 헤더·`expandedFieldIds` 토글, 기본 펼침·다중 펼침
- [ ] 주제별 행 + 쉬움·보통·어려움 3열, 칩 클릭으로 선택 토글
- [ ] 칩 색 = 숙련도, 빈출 배지, 선택 칩 시각적 구분
- [ ] 필터로 사라진 fieldId와 `expandedFieldIds` 동기화(택1)
- [ ] 칩 없는 row·아코디언 **미렌더**

### Phase I — 하단·Empty·로딩·에러

- [ ] 선택 칩 개수(D7)
- [ ] 필터 후 보이는 칩 0개 → Empty
- [ ] 쿼리별 로딩 UI (`isPending`/`isLoading`)
- [ ] 에러 시 안내 + 해당 `refetch`
- [ ] 멤버 0명·원본 칩 0 등 빈 데이터 안내
- [ ] 선택 개수는 아코디언 접힘과 무관하게 보이는 칩 기준과 일치

### Phase J — 마무리

- [ ] 스타일 정리
- [ ] Dev 도구로 에러·지연 시나리오 재검증
- [ ] §12 수동 검증 체크리스트 전부 통과
- [ ] README PR 가이드 + §13에 맞춰 PR 본문 초안

---

## 11. 구현 관례 및 주의사항

1. **`Set` / 불변 업데이트**  
   React state에 `Set`을 쓰면 갱신 시 **새 `Set` 인스턴스**를 만들어 넣는다 (`new Set(prev)` 후 add/delete). 같은 참조만 바꾸면 리렌더가 안 될 수 있다.

2. **`chipId` 단일 기준**  
   선택·숙련도 맵·필터 개수·교집합은 모두 `chipId`로 통일한다. `problemTypeId`와 혼동하지 않는다.

3. **숙련도 필터 “없음”**  
   `proficiencyFilter.size === 0`이면 D4는 **모든 칩 통과**. “아무것도 안 보임”이 되면 안 된다.

4. **빈출·숙련도 필터 순서**  
   README는 AND. 구현은 D3 후 D4 순서가 자연스럽다. 개수(D5)는 **D3만** 적용한 집합에서 센다.

5. **쿼리와 파생 계산의 경계**  
   `useMemo` 의존 배열에 `data`, `levelKey`, `memberId`, `frequentOnly`, `proficiencyFilter`(불변으로 유지)를 넣는다. **매 렌더 새 Set을 만들면** 의미 없이 재계산되므로, 필터 Set은 state 업데이트 시에만 새로 만든다.

6. **보너스(선택)**  
   일괄 선택·Empty 세분화·persist는 Phase J 이후에 붙여도 된다. 일괄 선택 시 대상은 **D4 이후 보이는 칩**만.

---

## 12. 수동 검증 체크리스트 (README 필수 대응)

구현 후 아래를 **직접 클릭**으로 확인한다.

- [ ] 멤버 목록 스크롤·첫 진입 시 첫 멤버 선택
- [ ] 멤버 변경 → 칩 전부 해제, 아코디언 전부 펼침, 빈출 OFF, 숙련도 필터 없음, 단계 `basic`
- [ ] 단계 변경 → 칩만 해제, 빈출·숙련도 필터 유지
- [ ] 빈출 ON → 빈출 칩만 표시, ON/OFF 전환 시 칩 선택 유지
- [ ] 숙련도 다중 필터 → 해당 숙련도만 표시; 필터 비우면 전체(빈출 조건만 반영)
- [ ] 숙련도 옆 개수: 빈출 OFF면 전체 칩 기준, ON이면 빈출 칩만 기준(숙련도 필터는 개수에 영향 없음)
- [ ] 필터 후 칩 없는 주제·분야는 화면에 없음(DOM에 없음)
- [ ] 필터 초기화 → 빈출 OFF + 숙련도 필터 클리어, 단계·칩 선택 불변
- [ ] 필터 결과 칩 0 → Empty
- [ ] 선택 개수 = 필터 적용 후 보이는 칩 중 선택된 수(패널 접혀도 동일)
- [ ] 로딩 표시, API 에러 시 안내 + 재시도, 빈 데이터 안내

---

## 13. PR 작성 시 매핑

| README PR 항목        | 본 문서 참조        |
| --------------------- | ------------------- |
| 데이터 변환·조합      | §6, §10 Phase D     |
| 상태 관리·초기화 범위 | §5, §10 Phase E·F·G |
| 필터링 순서·Empty     | §6, §11 항목 4, §12 |
| 컴포넌트 구조         | §7, §10 Phase E–I   |

---

_문서 버전: 설계 확정 후 구현 중 변경 사항이 있으면 이 파일을 함께 갱신한다._
