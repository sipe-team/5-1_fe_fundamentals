import type { Reservation, Room } from '@/types/reservation';
import { initialReservations, initialRooms } from './data';

const ROOMS_KEY = 'exam-2:mock:rooms';
const RESERVATIONS_KEY = 'exam-2:mock:reservations';
const CONTROLS_KEY = 'exam-2:mock:controls';

export const MOCK_STORAGE_EVENT = 'exam-2:mock-storage-updated';

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

  if (!localStorage.getItem(ROOMS_KEY)) {
    setJson(ROOMS_KEY, initialRooms);
  }

  if (!localStorage.getItem(RESERVATIONS_KEY)) {
    setJson(RESERVATIONS_KEY, initialReservations);
  }

  if (!localStorage.getItem(CONTROLS_KEY)) {
    setJson(CONTROLS_KEY, defaultControls);
  }
}

export function getStoredRooms(): Room[] {
  if (!isBrowser()) {
    return initialRooms;
  }

  initializeMockStorage();
  return parseJson<Room[]>(localStorage.getItem(ROOMS_KEY), initialRooms);
}

export function setStoredRooms(rooms: Room[]) {
  setJson(ROOMS_KEY, rooms);
  emitStorageChange();
}

export function getStoredReservations(): Reservation[] {
  if (!isBrowser()) {
    return initialReservations;
  }

  initializeMockStorage();
  return parseJson<Reservation[]>(
    localStorage.getItem(RESERVATIONS_KEY),
    initialReservations,
  );
}

export function setStoredReservations(reservations: Reservation[]) {
  setJson(RESERVATIONS_KEY, reservations);
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
  setStoredRooms([]);
  setStoredReservations([]);
}

export function seedMockData() {
  setStoredRooms(initialRooms);
  setStoredReservations(initialReservations);
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
