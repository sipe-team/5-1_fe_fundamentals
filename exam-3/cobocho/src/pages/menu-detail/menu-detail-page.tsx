import { useParams } from 'react-router-dom';

export function MenuDetailPage() {
	const { itemId } = useParams<{ itemId: string }>();

	return (
		<div>
			<h1>주문하기</h1>
			<p>메뉴 ID: {itemId}</p>
		</div>
	);
}
