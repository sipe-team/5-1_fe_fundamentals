import { useParams } from 'react-router-dom';

export function OrderDetailPage() {
	const { orderId } = useParams<{ orderId: string }>();

	return (
		<div>
			<h1>주문 완료</h1>
			<p>주문 ID: {orderId}</p>
		</div>
	);
}
