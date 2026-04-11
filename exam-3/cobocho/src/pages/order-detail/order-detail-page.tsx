import { useNavigate, useParams } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';

import { orderQuery } from '@/domain/order/api';
import { Button } from '@/shared/components/button';
import { CtaArea } from '@/shared/components/cta-area';
import { VStack } from '@/shared/components/layout';
import { Scaffold } from '@/shared/components/scaffold';
import { OrderDetailError } from './components/order-detail-error';
import { OrderDetailSkeleton } from './components/order-detail-skeleton';

export const OrderDetailPage = Scaffold.with(
	{
		error: <OrderDetailError />,
		fallback: <OrderDetailSkeleton />,
	},
	() => {
		const { orderId } = useParams<{ orderId: string }>();
		const navigate = useNavigate();

		if (!orderId) {
			throw new Error('주문 ID가 존재하지 않습니다.');
		}

		const { data } = useSuspenseQuery(orderQuery.detail(orderId));
		const { order } = data;

		const totalQuantity = order.items.reduce(
			(sum, item) => sum + item.quantity,
			0,
		);

		return (
			<div className="pb-24">
				<div className="border-b border-gray-200 p-4">
					<h1 className="text-lg font-bold">주문 완료</h1>
				</div>

				<VStack
					gap={4}
					className="p-4"
				>
					<VStack
						gap={2}
						className="rounded-lg bg-gray-50 p-4"
					>
						<span className="text-sm text-gray-500">주문 번호</span>
						<span className="text-sm font-medium">{order.id}</span>
					</VStack>

					<VStack gap={0}>
						{order.items.map((item) => {
							const optionLabel = item.options
								.flatMap((o) => o.labels)
								.join(', ');

							return (
								<div
									key={item.itemId + optionLabel}
									className="border-b border-gray-100 py-3"
								>
									<div className="flex justify-between">
										<span className="font-medium">{item.title}</span>
										<span className="text-sm font-medium">
											{(item.unitPrice * item.quantity).toLocaleString()}원
										</span>
									</div>
									{optionLabel && (
										<span className="text-sm text-gray-500">{optionLabel}</span>
									)}
									<span className="text-sm text-gray-500">
										{' '}
										· {item.quantity}개
									</span>
								</div>
							);
						})}
					</VStack>

					<div className="flex justify-between border-t border-gray-200 pt-4">
						<span className="font-medium">총 {totalQuantity}개</span>
						<span className="text-lg font-bold">
							{order.totalPrice.toLocaleString()}원
						</span>
					</div>
				</VStack>

				<CtaArea>
					<Button
						fullWidth
						size="lg"
						onClick={() => navigate('/')}
					>
						메뉴판으로 돌아가기
					</Button>
				</CtaArea>
			</div>
		);
	},
);
