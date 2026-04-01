function App() {
  return (
    <div>
      <h1>🏢 Exam 2: 회의실 예약 시스템</h1>
      <p>여기서부터 시작하세요! 이 파일을 자유롭게 수정해주세요.</p>
      <p>
        <code>pnpm dev</code> 실행 후 아래 API로 테스트할 수 있습니다.
      </p>
      <ul>
        <li>
          <code>GET /api/rooms</code> — 회의실 목록
        </li>
        <li>
          <code>GET /api/reservations?date=2026-04-07</code> — 날짜별 예약 목록
        </li>
        <li>
          <code>GET /api/reservations/:id</code> — 예약 상세
        </li>
        <li>
          <code>GET /api/my-reservations</code> — 내 예약 목록
        </li>
        <li>
          <code>POST /api/reservations</code> — 예약 생성
        </li>
        <li>
          <code>DELETE /api/reservations/:id</code> — 예약 취소
        </li>
      </ul>
    </div>
  );
}

export default App;
