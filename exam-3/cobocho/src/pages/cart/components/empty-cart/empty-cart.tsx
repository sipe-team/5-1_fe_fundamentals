import { useNavigate } from 'react-router-dom';

import { Button } from '@/shared/components/button';

export function EmptyCart() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col items-center justify-center gap-4 py-20 text-gray-400">
			<p>장바구니가 비어있습니다.</p>
			<Button
				variant="outline"
				size="md"
				onClick={() => navigate('/')}
			>
				메뉴 보러가기
			</Button>
		</div>
	);
}
