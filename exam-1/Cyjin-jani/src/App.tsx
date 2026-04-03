import './styles/App.css';

import { Products } from './components/products/Products';

function App() {
  return (
    <div className="w-full h-dvh bg-white mx-auto px-[80px]">
      <h1>🧪 Exam 1: 다중 필터 상품 목록</h1>
      <Products />
    </div>
  );
}

export default App;
