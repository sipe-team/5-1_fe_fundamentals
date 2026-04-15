import { delay, HttpResponse, http } from 'msw';
import type {
  CreateOrderRequest,
  MenuCategory,
  MenuOption,
  Order,
  OrderItem,
} from '@/types/order';
import { initialOrders } from './data';
import {
  getMockControls,
  getStoredMenu,
  getStoredOptions,
  getStoredOrders,
  initializeMockStorage,
  setStoredOrders,
} from './storage';

/**
 * 간헐적으로 긴 지연(~5초)이 발생합니다.
 * 약 15%의 확률로 1.5~5초, 나머지는 300~800ms
 */
function randomDelay(): number {
  const controls = getMockControls();

  if (controls.forceDelay) {
    return 4000;
  }

  if (Math.random() < 0.15) {
    return Math.random() * 3500 + 1500;
  }
  return Math.random() * 500 + 300;
}

/**
 * 약 10%의 확률로 에러를 반환합니다.
 * 500 또는 503 상태 코드를 무작위로 선택합니다.
 */
function maybeError(): Response | null {
  const controls = getMockControls();

  if (controls.forceError) {
    return HttpResponse.json(
      {
        error: 'Internal Server Error',
        message: '개발자 도구 패널에서 강제 에러가 활성화되었습니다.',
      },
      { status: 500 },
    );
  }

  if (Math.random() < 0.1) {
    const status = Math.random() < 0.5 ? 500 : 503;
    return HttpResponse.json(
      {
        error:
          status === 500
            ? 'Internal Server Error'
            : 'Service Temporarily Unavailable',
        message:
          status === 500
            ? '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            : '서버가 일시적으로 과부하 상태입니다. 잠시 후 다시 시도해주세요.',
      },
      { status },
    );
  }
  return null;
}

/**
 * 옵션 선택에 따른 추가 금액을 계산합니다.
 */
function calculateOptionPrice(
  option: MenuOption,
  selectedLabels: string[],
): number {
  let total = 0;
  for (const label of selectedLabels) {
    const index = option.labels.indexOf(label);
    if (index !== -1) {
      total += option.prices[index];
    }
  }
  return total;
}

function generateOrderId(): string {
  const chars = 'abcdef0123456789';
  let result = '';
  for (let i = 0; i < 24; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export const handlers = [
  // ── 카테고리 목록 ──────────────────────────────────
  http.get('/api/catalog/categories', async () => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const menu = getStoredMenu();
    const categories = [
      ...new Set(menu.map((item) => item.category)),
    ] as MenuCategory[];

    return HttpResponse.json({ categories });
  }),

  // ── 메뉴 목록 ──────────────────────────────────────
  http.get('/api/catalog/items', async () => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const menu = getStoredMenu();
    return HttpResponse.json({ items: menu });
  }),

  // ── 메뉴 상세 ──────────────────────────────────────
  http.get('/api/catalog/items/:itemId', async ({ params }) => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const { itemId } = params;
    const menu = getStoredMenu();
    const item = menu.find((m) => m.id === itemId);

    if (!item) {
      return HttpResponse.json(
        { error: 'Not Found', message: '상품을 찾을 수 없어요.' },
        { status: 404 },
      );
    }

    return HttpResponse.json({ item });
  }),

  // ── 옵션 목록 ──────────────────────────────────────
  http.get('/api/catalog/options', async () => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const options = getStoredOptions();
    return HttpResponse.json({ options });
  }),

  // ── 주문 생성 ──────────────────────────────────────
  http.post('/api/orders', async ({ request }) => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const body = (await request.json()) as CreateOrderRequest;
    const menu = getStoredMenu();
    const allOptions = getStoredOptions();
    const orders = getStoredOrders();

    // items 배열이 비어 있는 경우
    if (!body.items || body.items.length === 0 || !body.customerName) {
      return HttpResponse.json(
        { error: 'Bad Request', message: '잘못된 주문이에요.' },
        { status: 400 },
      );
    }

    const orderItems: OrderItem[] = [];
    let calculatedTotal = 0;

    for (const item of body.items) {
      const menuItem = menu.find((m) => m.id === item.itemId);
      if (!menuItem) {
        return HttpResponse.json(
          {
            error: 'Bad Request',
            message: '잘못된 주문이에요.',
          },
          { status: 400 },
        );
      }

      if (item.quantity < 1 || item.quantity > 99) {
        return HttpResponse.json(
          {
            error: 'Bad Request',
            message: '잘못된 주문이에요.',
          },
          { status: 400 },
        );
      }

      // 옵션 유효성 검증
      const itemOptions = menuItem.optionIds.map((optId) =>
        allOptions.find((o) => o.id === optId),
      );

      // 상품에 적용 가능한 옵션인지 확인
      for (const optSelection of item.options) {
        const validOption = itemOptions.find(
          (o) => o?.id === optSelection.optionId,
        );
        if (!validOption) {
          return HttpResponse.json(
            {
              error: 'Bad Request',
              message: '잘못된 주문이에요.',
            },
            { status: 400 },
          );
        }

        // 선택된 라벨이 유효한지 확인
        for (const label of optSelection.labels) {
          if (!validOption.labels.includes(label)) {
            return HttpResponse.json(
              {
                error: 'Bad Request',
                message: '잘못된 주문이에요.',
              },
              { status: 400 },
            );
          }
        }

        // list 타입: 선택 개수 유효성
        if (validOption.type === 'list') {
          const count = optSelection.labels.length;
          if (count < validOption.minCount || count > validOption.maxCount) {
            return HttpResponse.json(
              {
                error: 'Bad Request',
                message: '잘못된 주문이에요.',
              },
              { status: 400 },
            );
          }
        }

        // grid/select 타입: 단일 선택
        if (
          (validOption.type === 'grid' || validOption.type === 'select') &&
          optSelection.labels.length > 1
        ) {
          return HttpResponse.json(
            {
              error: 'Bad Request',
              message: '잘못된 주문이에요.',
            },
            { status: 400 },
          );
        }
      }

      // 필수 옵션 검증 (grid은 항상 필수)
      for (const opt of itemOptions) {
        if (opt?.required) {
          const applied = item.options.find((o) => o.optionId === opt.id);
          if (!applied || applied.labels.length === 0) {
            return HttpResponse.json(
              {
                error: 'Bad Request',
                message: '잘못된 주문이에요.',
              },
              { status: 400 },
            );
          }
        }
      }

      // 가격 계산
      let unitPrice = menuItem.price;
      for (const optSelection of item.options) {
        const opt = allOptions.find((o) => o.id === optSelection.optionId);
        if (opt) {
          unitPrice += calculateOptionPrice(opt, optSelection.labels);
        }
      }

      orderItems.push({
        itemId: item.itemId,
        title: menuItem.title,
        quantity: item.quantity,
        basePrice: menuItem.price,
        options: item.options,
        unitPrice,
      });

      calculatedTotal += unitPrice * item.quantity;
    }

    // totalPrice 검증
    if (body.totalPrice !== calculatedTotal) {
      return HttpResponse.json(
        {
          error: 'Bad Request',
          message: '주문금액이 잘못되었어요.',
        },
        { status: 400 },
      );
    }

    const newOrder: Order = {
      id: generateOrderId(),
      totalPrice: calculatedTotal,
      items: orderItems,
      status: 'pending',
      customerName: body.customerName,
      createdAt: new Date().toISOString(),
    };

    setStoredOrders([...orders, newOrder]);

    return HttpResponse.json({ orderId: newOrder.id }, { status: 201 });
  }),

  // ── 주문 목록 ──────────────────────────────────────
  http.get('/api/orders', async () => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const orders = getStoredOrders();
    // Mock에서는 '김민수' 주문 + 현재 세션에서 생성된 주문을 반환
    const myOrders = orders.filter(
      (order) =>
        order.customerName === '김민수' ||
        !initialOrders.some((io) => io.id === order.id),
    );

    return HttpResponse.json({ orders: myOrders });
  }),

  // ── 주문 상세 ──────────────────────────────────────
  http.get('/api/orders/:orderId', async ({ params }) => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const { orderId } = params;
    const orders = getStoredOrders();
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: '주문을 찾을 수 없어요.',
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({ order });
  }),

  // ── 주문 취소 ──────────────────────────────────────
  http.patch('/api/orders/:orderId/cancel', async ({ params }) => {
    initializeMockStorage();
    await delay(randomDelay());

    const errorResponse = maybeError();
    if (errorResponse) return errorResponse;

    const { orderId } = params;
    const orders = getStoredOrders();
    const orderIndex = orders.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) {
      return HttpResponse.json(
        {
          error: 'Not Found',
          message: '주문을 찾을 수 없어요.',
        },
        { status: 404 },
      );
    }

    const order = orders[orderIndex];

    if (order.status === 'completed') {
      return HttpResponse.json(
        {
          error: 'Conflict',
          message: '이미 완료된 주문은 취소할 수 없습니다.',
        },
        { status: 409 },
      );
    }

    if (order.status === 'cancelled') {
      return HttpResponse.json(
        {
          error: 'Conflict',
          message: '이미 취소된 주문입니다.',
        },
        { status: 409 },
      );
    }

    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status: 'cancelled' as const } : o,
    );
    setStoredOrders(updatedOrders);

    return HttpResponse.json({ message: '주문이 취소되었습니다.' });
  }),
];
