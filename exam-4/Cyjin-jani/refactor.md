# Refactor 성과 정리

## 1) 리팩토링 목표

이번 리팩토링에서 얻고자 했던 것들은?

- 안정성 개선, 가독성 향상 그리고 약간의 확장성.

## 2) 리팩토링 작업 내용 요약

- 개선 A: `useExpandedFields` reset 타이밍 정합성 수정
- 개선 B: `DashboardProblemTypePanel` `ErrorBoundary resetKeys` 보완
- 개선 C: Async 경계(`QueryErrorResetBoundary + ErrorBoundary + Suspense`) 공통화
- 개선 D: 선택 오버레이(Check) UI 프리미티브 추출
- 개선 E: `MemberSidePanel`/`MemberList` 책임 분리 강화

## 3) 항목별 상세

### [개선 A] `useExpandedFields` reset 동작 정합성 개선

#### 상세 내용

- 리뷰에서 "필터 변경 시 확장 상태가 불필요하게 초기화될 수 있다"는 코멘트가 나왔습니다.
- 원인을 확인해보니 reset 로직이 `chipBoardDataTree` 변화에도 반응하고 있었습니다.
- `chipBoardDataTree`는 필터 변경에도 바뀌기 때문에, 결과적으로 reset 트리거가 요구사항보다 넓게 잡혀 있었습니다.

#### 전/후 비교 (As-Is / To-Be)

- As-Is:
  - reset effect가 `chipBoardDataTree` + `resetSeed` 변화에 모두 반응
  - 필터 변경 시에도 확장 상태 재초기화 가능성 존재
- To-Be:
  - reset effect를 `resetSeed` 변화에만 반응하도록 분리
  - 최신 field id 목록은 ref로 관리하고 reset 시점에만 사용

- 핵심 변경 코드:

  ```ts
  // As-Is
  useEffect(() => {
    if (resetSeed == null) return;
    setExpandedFieldIds(new Set(chipBoardDataTree.map((section) => section.fieldId)));
  }, [chipBoardDataTree, resetSeed]);

  // To-Be
  useEffect(() => {
    if (resetSeed == null) return;
    setExpandedFieldIds(new Set(latestFieldIdsRef.current));
  }, [resetSeed]);
  ```

#### 의사결정 기록

- 문제: 아코디언 확장 상태 초기화가 요구사항과 다르게 동작함. (필터 변경시에도 동작)
- 초기 판단: 필터 변경 시 확장 상태가 함께 바뀌는 동작이 UI/UX 관점에서는 더 자연스럽다고 보았음
- 판단 전환: 리뷰 코멘트 이후 요구사항을 재확인했고, 아코디언 상태 초기화 기준이 필터 변경이 아닌, "멤버 전환 시"로 명시되어 있어 버그로 최종 판단.
- 대안:
  - 대안 1) 기존 의존성 유지 + 조건문 보강
  - 대안 2) reset 트리거를 `resetSeed` 기반으로 분리
- 선택: 대안 2
- 선택 근거: 의존 배열 자체가 실행 정책이므로, 이벤트 트리거를 명시적으로 분리하는 편이 회귀 위험이 낮음
- 결과: 멤버 전환 시에는 초기화되고, 필터 변경 시에는 기존 확장 상태를 유지하는 의도가 코드에 명확히 반영됨

### [개선 B] `DashboardProblemTypePanel` ErrorBoundary의 reset 설정 누락 수정

#### 상세 내용

- 문제 상황은 "한 번 에러가 난 뒤 사용자/레벨을 바꿔도 같은 fallback 화면이 남아 보일 수 있는 구조"였습니다.
- 원인은 `ErrorBoundary`가 어떤 시점에 상태를 버려야 하는지(`resetKeys`)를 모르고 있었다는 점이었습니다.

#### 전/후 비교 (As-Is / To-Be)

- As-Is:
  - `ErrorBoundary`에 `resetKeys`가 없어, 컨텍스트 변경(사용자, 레벨)과 에러바운더리의 reset이 올바르게 연결되지 않았음
  - 에러 상태가 컨텍스트(사용자, 레벨)의 변경에 관계없이 남아있을 수 있었음
- To-Be:
  - `resetKeys={[memberId, levelKey]}`를 추가해 컨텍스트(사용자, 레벨) 전환 시 에러바운더리의 reset이 자동으로 초기화됨
  - "사용자/레벨이 바뀌면 새 컨텍스트로 다시 시도"라는 동작 의도가 코드에 명시됨

- 핵심 변경 코드:

  ```tsx
  // As-Is
  <ErrorBoundary onReset={reset} fallbackRender={...}>
  ...
  </ErrorBoundary>

  // To-Be
  <ErrorBoundary onReset={reset} resetKeys={[memberId, levelKey]} fallbackRender={...}>
  ...
  </ErrorBoundary>
  ```

#### 의사결정 기록

- 문제: 에러 복구 기준이 없어 fallback 상태가 전환 이후에도 잔존할 수 있음
- 선택: reset key를 설정하여 (`memberId`, `levelKey`) 변경 시 자동 복구
- 결과: fallback 고착 가능성을 줄이고, 전환 후 복구 동작의 예측 가능성을 높임

### [개선 C] ErrorBoundary + Suspense를 AsyncBoundary로 공통화

#### 상세 내용

- `MemberSidePanel`, `DashboardLevelSelector`, `DashboardProblemTypePanel` 모두 같은 ErrorBoundary + Suspense의 조합 패턴을 반복하고 있었습니다.
- 패턴 자체는 동일했지만, 문구/구성 변경이 필요할 때 여러 파일을 동시에 수정해야 해서 유지보수 비용이 커지는 구조였습니다. 또한, 코드가 불필요하게 길어져서 가독성을 조금 해치는 점을 문제라고 생각했습니다.

#### 전/후 비교 (As-Is / To-Be)

- As-Is:
  - 각 컴포넌트가 `QueryErrorResetBoundary + ErrorBoundary + Suspense`를 직접 선언
  - 에러/로딩 정책이 파일별로 흩어져 있어 변경 포인트가 분산됨
- To-Be:
  - `AsyncBoundary`로 공통화해 경계 패턴을 단일 컴포넌트로 통합하여 가독성 향상
  - 공통 기본 fallback을 사용하고, 필요 시 커스텀 fallback 주입 가능

- 핵심 변경 코드:

  ```tsx
  // As-Is
  <QueryErrorResetBoundary>
  {({ reset }) => (
      <ErrorBoundary onReset={reset} fallbackRender={...}>
      <Suspense fallback={<LoadingFallback ... />}>{children}</Suspense>
      </ErrorBoundary>
  )}
  </QueryErrorResetBoundary>

  // To-Be
  <AsyncBoundary>{children}</AsyncBoundary>
  ```

#### 의사결정 기록

- 문제: 동일한 비동기 경계 보일러플레이트가 여러 컴포넌트에 반복됨
- 해결: 공통 `AsyncBoundary`로 추출
  - 반복 제거와 함께 에러/로딩 정책의 변경 지점을 한 곳으로 모으는 편이 유지보수에 유리함
- 결과: 중복 JSX를 줄이고, 신규 패널 추가 시 경계 처리 코드량을 줄였으며 기본 fallback + 필요 시 커스텀 fallback 주입 구조로 확장성을 확보함
- 추가 리팩토링 고민:
  - 현재는 `src/components/common`에 두었지만, 장기적으로는 `src/shared/components`로 승격해 공통 계층을 명확히 분리할지 검토
  - 기준안: 2개 이상 도메인에서 재사용되고 도메인 의존성이 없을 때 `shared`로 이동

### [개선 D] 선택 오버레이 UI를 공통 컴포넌트로 추출

#### 상세 내용

- `DashboardFilters`와 `ProblemTypeChipButton` 모두 선택 상태를 표현할 때 동일한 Check 오버레이 마크업을 반복하고 있었습니다.
- 작은 시각 요소라도 수정 시 두 곳 이상을 함께 바꿔야 해서, UI 일관성과 유지보수 관점에서 누적 비용이 발생하는 구조였습니다.

#### 전/후 비교 (As-Is / To-Be)

- As-Is:
  - 선택 오버레이 JSX(`absolute inset-0 ... + Check`)가 컴포넌트마다 중복됨
  - 스타일/접근성 속성 변경 시 여러 파일 동시 수정 필요
- To-Be:
  - `SelectionCheckOverlay` 공용 컴포넌트로 추출해 공통으로 사용
  - 조건부 렌더를 `&&` 스타일로 통일해 읽기 흐름 단순화

- 핵심 변경 코드:

  ```tsx
  // As-Is
  {isSelected && (
  <span className="absolute inset-0 inline-flex items-center justify-center rounded-full bg-black/50 text-white">
      <Check ... />
  </span>
  )}

  // To-Be
  {isSelected && <SelectionCheckOverlay />}
  ```

#### 의사결정 기록

- 문제: 동일한 오버레이 UI가 여러 컴포넌트에 복붙되어 수정 포인트가 분산됨
- 선택: 재사용 단위가 명확하기에 오버레이 전용 컴포넌트(`SelectionCheckOverlay`) 추출하여 공통화
- common으로 빼지 않은 이유: 현재까지는 dashboard 도메인 내에서만 소비되는 컴포넌트였기 때문. 서로 다른 도메인까지 확장되는 경우에 common으로 격상하려고 함.
- 결과: 오버레이 관련 중복 라인을 줄이고, 시각/구조 일관성을 높였음

### [개선 E] `MemberSidePanel` / `MemberList` 책임 분리

#### 상세 내용

- 기존에는 `MemberList`가 렌더링뿐 아니라 데이터 조회와 초기 선택 정책까지 함께 담당하고 있었습니다.
- 이 구조에서는 "멤버 선택 정책 변경"과 "리스트 UI 변경"이 한 파일에서 같이 일어나 책임 경계가 흐려졌습니다.

#### 전/후 비교 (As-Is / To-Be)

- As-Is:
  - `MemberList` 내부에 `useSuspenseQuery(getMembersQueryOptions())` 존재
  - `selectedId`가 없을 때 첫 멤버를 선택하는 effect가 `MemberList` 내부에 존재
- To-Be:
  - 조회/초기 선택 로직은 `MemberSidePanelContent`로 이동
  - `MemberList`는 `members`, `selectedId`, `onSelect` props 기반의 표현 컴포넌트로 단순화

#### 의사결정 기록

- 문제: `MemberList`에 UI 책임과 상태/정책 책임이 동시에 있어 변경 파급 범위가 커짐
- 해결: 컨테이너(`MemberSidePanel`)와 프리젠테이셔널(`MemberList`) 책임 분리
- 이유: 상태/정책 변경 지점을 상위로 모으면 UI 컴포넌트 재사용성과 유지보수성이 높아짐
- 결과: 역할 경계가 명확해졌고, 멤버 선택 정책 변경 시 `MemberList` UI 수정 필요성을 낮춤

## 4) 전반적인 리팩토링 결과

- 개선 A (`useExpandedFields`)
  - reset 트리거를 멤버 전환 이벤트(`resetSeed`)로 한정해, 필터 변경 시 불필요 초기화 가능성을 제거.
  - 요구사항(멤버 변경 시 초기화)과 실제 동작이 일치하도록 정합성 확보

- 개선 B (`resetKeys` 보완)
  - 컨텍스트 키(`memberId`, `levelKey`) 기준의 자동 복구 경로를 명시해 fallback 고착 위험을 낮춤

- 개선 C (`AsyncBoundary` 공통화)
  - 비동기 경계 보일러플레이트 선언 지점 `3곳 -> 1곳`으로 통합
  - 영향 파일 수: 4개(공통 1 + 사용처 3)

- 개선 D (`SelectionCheckOverlay` 추출)
  - 커밋(`c6cd368`) 기준 `+19 / -32`로 총 `13줄 코드라인 감소`
  - 공통 컴포넌트 1개를 추가했지만(+14), 사용처 중복 제거(-32)가 더 커 전체 코드량이 감소
  - 영향 파일 수: 3개(공통 1 + 사용처 2)

- 개선 E (멤버 영역 책임 분리)
  - `MemberList`를 view 전용 컴포넌트로 정리하고, 조회/초기 선택 로직은 `MemberSidePanel`로 상향해 책임 경계를 명확히 함
  - 멤버 선택 정책 변경 시 UI 컴포넌트 수정 범위를 줄이고, 변경 영향 범위를 상위 컨테이너로 집중
