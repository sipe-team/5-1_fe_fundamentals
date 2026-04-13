import {useNavigate} from "react-router-dom";

interface Props {
  error: any
  resetErrorBoundary: () => void
}

function ErrorFallback({ error, resetErrorBoundary }: Props) {
  const navigate = useNavigate()

  if (error?.status === 404) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-3 text-gray-500">
        <p className="text-lg font-medium">페이지를 찾을 수 없어요</p>
        <p className="text-sm">삭제되었거나 잘못된 접근이에요</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 mt-4 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 cursor-pointer"
        >
          메인으로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-48 gap-3 text-red-500">
      <p>데이터를 불러오지 못했어요.</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 cursor-pointer"
      >
        다시 시도
      </button>
    </div>
  )
}

export default ErrorFallback
