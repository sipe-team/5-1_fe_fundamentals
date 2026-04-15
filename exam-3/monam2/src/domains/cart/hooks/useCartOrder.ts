import { useOptions } from "@/domains/menu/hooks";
import { useCreateOrderMutation } from "@/domains/orders/hooks";
import { getApiErrorMessage } from "@/shared/utils";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { clearCart } from "../utils";
import { routes } from "@/shared/routes";
import type { CartItem } from "@/shared/types";

interface UseCartOrderProps {
  cartItems: CartItem[];
  customerName: string;
  totalPrice: number;
}

export default function useCartOrder({
  cartItems,
  customerName,
  totalPrice,
}: UseCartOrderProps) {
  const navigate = useNavigate();
  const { data: options } = useOptions();
  const { mutateAsync, isPending } = useCreateOrderMutation();

  const optionsById = new Map(options.map((option) => [option.id, option]));

  const submitOrder = async () => {
    if (cartItems.length === 0) {
      return;
    }

    if (!customerName.trim()) {
      toast.error("주문자명을 입력해주세요");
      return;
    }

    try {
      const { orderId } = await mutateAsync({
        customerName: customerName.trim(),
        totalPrice,
        items: cartItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          options: item.options,
        })),
      });

      clearCart();
      navigate(routes.orders(orderId));
    } catch (error) {
      toast.error(
        await getApiErrorMessage(
          error,
          "주문 처리에 실패했습니다. 다시 시도해주세요.",
        ),
      );
    }
  };

  return {
    submitOrder,
    isPending,
    optionsById,
  };
}
