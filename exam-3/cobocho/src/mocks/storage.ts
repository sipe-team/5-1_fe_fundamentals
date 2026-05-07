import type { MenuItem, MenuOption, Order } from '@/types/order';
import { initialMenu, initialOptions, initialOrders } from './data';

const MENU_KEY = 'exam-3:mock:menu';
const OPTIONS_KEY = 'exam-3:mock:options';
const ORDERS_KEY = 'exam-3:mock:orders';
const CONTROLS_KEY = 'exam-3:mock:controls';

export const MOCK_STORAGE_EVENT = 'exam-3:mock-storage-updated';

export interface MockControls {
  forceError: boolean;
  forceDelay: boolean;
}

const defaultControls: MockControls = {
  forceError: false,
  forceDelay: false,
};

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function parseJson<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function emitStorageChange() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new CustomEvent(MOCK_STORAGE_EVENT));
}

function setJson(key: string, value: unknown) {
  if (!isBrowser()) {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

export function initializeMockStorage() {
  if (!isBrowser()) {
    return;
  }

  if (!localStorage.getItem(MENU_KEY)) {
    setJson(MENU_KEY, initialMenu);
  }

  if (!localStorage.getItem(OPTIONS_KEY)) {
    setJson(OPTIONS_KEY, initialOptions);
  }

  if (!localStorage.getItem(ORDERS_KEY)) {
    setJson(ORDERS_KEY, initialOrders);
  }

  if (!localStorage.getItem(CONTROLS_KEY)) {
    setJson(CONTROLS_KEY, defaultControls);
  }
}

export function getStoredMenu(): MenuItem[] {
  if (!isBrowser()) {
    return initialMenu;
  }

  initializeMockStorage();
  return parseJson<MenuItem[]>(localStorage.getItem(MENU_KEY), initialMenu);
}

export function getStoredOptions(): MenuOption[] {
  if (!isBrowser()) {
    return initialOptions;
  }

  initializeMockStorage();
  return parseJson<MenuOption[]>(
    localStorage.getItem(OPTIONS_KEY),
    initialOptions,
  );
}

export function getStoredOrders(): Order[] {
  if (!isBrowser()) {
    return initialOrders;
  }

  initializeMockStorage();
  return parseJson<Order[]>(localStorage.getItem(ORDERS_KEY), initialOrders);
}

export function setStoredOrders(orders: Order[]) {
  setJson(ORDERS_KEY, orders);
  emitStorageChange();
}

export function getMockControls(): MockControls {
  if (!isBrowser()) {
    return defaultControls;
  }

  initializeMockStorage();
  return {
    ...defaultControls,
    ...parseJson<Partial<MockControls>>(
      localStorage.getItem(CONTROLS_KEY),
      defaultControls,
    ),
  };
}

export function updateMockControls(nextControls: Partial<MockControls>) {
  const mergedControls = {
    ...getMockControls(),
    ...nextControls,
  };

  setJson(CONTROLS_KEY, mergedControls);
  emitStorageChange();
}

export function clearMockData() {
  setJson(MENU_KEY, []);
  setJson(OPTIONS_KEY, []);
  setJson(ORDERS_KEY, []);
  emitStorageChange();
}

export function seedMockData() {
  setJson(MENU_KEY, initialMenu);
  setJson(OPTIONS_KEY, initialOptions);
  setJson(ORDERS_KEY, initialOrders);
  emitStorageChange();
}

export function subscribeMockStorage(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const listener = () => callback();

  window.addEventListener(MOCK_STORAGE_EVENT, listener);
  window.addEventListener('storage', listener);

  return () => {
    window.removeEventListener(MOCK_STORAGE_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}
