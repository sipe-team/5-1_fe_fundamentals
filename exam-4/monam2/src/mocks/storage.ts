import type {
  Level,
  Member,
  ProblemTypeChip,
  Proficiency,
} from "@/shared/types";
import {
  initialLevels,
  initialMembers,
  initialProblemTypes,
  initialProficiency,
} from "./data";

const MEMBERS_KEY = "sipe-study:mock:members";
const LEVELS_KEY = "sipe-study:mock:levels";
const PROBLEM_TYPES_KEY = "sipe-study:mock:problem-types";
const PROFICIENCY_KEY = "sipe-study:mock:proficiency";
const CONTROLS_KEY = "sipe-study:mock:controls";

export const MOCK_STORAGE_EVENT = "sipe-study:mock-storage-updated";

export interface MockControls {
  forceError: boolean;
  forceDelay: boolean;
}

const defaultControls: MockControls = {
  forceError: false,
  forceDelay: false,
};

const emptyProblemTypes: Record<string, ProblemTypeChip[]> = {};
const emptyProficiency: Record<string, Proficiency[]> = {};

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
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

  if (!localStorage.getItem(MEMBERS_KEY)) {
    setJson(MEMBERS_KEY, initialMembers);
  }

  if (!localStorage.getItem(LEVELS_KEY)) {
    setJson(LEVELS_KEY, initialLevels);
  }

  if (!localStorage.getItem(PROBLEM_TYPES_KEY)) {
    setJson(PROBLEM_TYPES_KEY, initialProblemTypes);
  }

  if (!localStorage.getItem(PROFICIENCY_KEY)) {
    setJson(PROFICIENCY_KEY, initialProficiency);
  }

  if (!localStorage.getItem(CONTROLS_KEY)) {
    setJson(CONTROLS_KEY, defaultControls);
  }
}

export function getStoredMembers(): Member[] {
  if (!isBrowser()) {
    return initialMembers;
  }

  initializeMockStorage();
  return parseJson<Member[]>(localStorage.getItem(MEMBERS_KEY), initialMembers);
}

export function getStoredLevels(): Level[] {
  if (!isBrowser()) {
    return initialLevels;
  }

  initializeMockStorage();
  return parseJson<Level[]>(localStorage.getItem(LEVELS_KEY), initialLevels);
}

export function getStoredProblemTypes(): Record<string, ProblemTypeChip[]> {
  if (!isBrowser()) {
    return initialProblemTypes;
  }

  initializeMockStorage();
  return parseJson<Record<string, ProblemTypeChip[]>>(
    localStorage.getItem(PROBLEM_TYPES_KEY),
    initialProblemTypes,
  );
}

export function getStoredProficiency(): Record<string, Proficiency[]> {
  if (!isBrowser()) {
    return initialProficiency;
  }

  initializeMockStorage();
  return parseJson<Record<string, Proficiency[]>>(
    localStorage.getItem(PROFICIENCY_KEY),
    initialProficiency,
  );
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
  setJson(MEMBERS_KEY, []);
  setJson(LEVELS_KEY, []);
  setJson(PROBLEM_TYPES_KEY, emptyProblemTypes);
  setJson(PROFICIENCY_KEY, emptyProficiency);
  emitStorageChange();
}

export function seedMockData() {
  setJson(MEMBERS_KEY, initialMembers);
  setJson(LEVELS_KEY, initialLevels);
  setJson(PROBLEM_TYPES_KEY, initialProblemTypes);
  setJson(PROFICIENCY_KEY, initialProficiency);
  emitStorageChange();
}

export function subscribeMockStorage(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const listener = () => callback();

  window.addEventListener(MOCK_STORAGE_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(MOCK_STORAGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
