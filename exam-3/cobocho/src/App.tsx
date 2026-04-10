function App() {
  return (
    <div>
      <h1>Exam 3: 커피 주문 앱</h1>
      <p>여기서부터 시작하세요! 이 파일을 자유롭게 수정해주세요.</p>
      <p>
        <code>pnpm dev</code> 실행 후 아래 API로 테스트할 수 있습니다.
      </p>
      <ul>
        <li>
          <code>GET /api/catalog/categories</code> — 카테고리 목록
        </li>
        <li>
          <code>GET /api/catalog/items</code> — 전체 메뉴 목록
        </li>
        <li>
          <code>GET /api/catalog/items/:itemId</code> — 메뉴 상세
        </li>
        <li>
          <code>GET /api/catalog/options</code> — 옵션 목록
        </li>
        <li>
          <code>POST /api/orders</code> — 주문 생성
        </li>
        <li>
          <code>GET /api/orders</code> — 내 주문 목록
        </li>
        <li>
          <code>GET /api/orders/:orderId</code> — 주문 상세
        </li>
        <li>
          <code>PATCH /api/orders/:orderId/cancel</code> — 주문 취소
        </li>
      </ul>
    </div>
  );
}

export default App;
