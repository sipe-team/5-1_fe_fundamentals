import { useNavigate } from 'react-router-dom';
import { useCartContext } from '@/domain/order/context/cart-context';
import { CtaArea } from '@/shared/components/cta-area';
import { Button } from '@/shared/components/button';

export function CartButton() {
	const navigate = useNavigate();
	const { totalQuantity, totalPrice } = useCartContext();

	const isEmpty = totalQuantity === 0;

	return (
		<CtaArea>
			<Button
				fullWidth
				size="lg"
				onClick={() => navigate('/cart')}
			>
				{isEmpty
					? '장바구니 보기'
					: `장바구니 보기 · ${totalQuantity}개 · ${totalPrice.toLocaleString()}원`}
			</Button>
		</CtaArea>
	);
}
