import type { ProficiencyLevel } from '../types';

export const PROFICIENCY_LEVEL = {
  UNSEEN: '미도전',
  FAILED: '오답',
  PARTIAL: '부분 통과',
  PASSED: '통과',
  MASTERED: '완전 정복',
} as const;

export const PROFICIENCY_LEVEL_KEY = {
  UNSEEN: 'unseen',
  FAILED: 'failed',
  PARTIAL: 'partial',
  PASSED: 'passed',
  MASTERED: 'mastered',
} as const;

export const PROFICIENCY_COLORS: Record<
  ProficiencyLevel,
  { background: string; border: string; text: string; selectedBorder: string }
> = {
  UNSEEN: {
    background: '#f3f4f6',
    border: '#d1d5db',
    text: '#4b5563',
    selectedBorder: '#6b7280',
  },
  FAILED: {
    background: '#fef2f2',
    border: '#fecaca',
    text: '#b91c1c',
    selectedBorder: '#ef4444',
  },
  PARTIAL: {
    background: '#eff6ff',
    border: '#bfdbfe',
    text: '#1d4ed8',
    selectedBorder: '#3b82f6',
  },
  PASSED: {
    background: '#f0fdf4',
    border: '#bbf7d0',
    text: '#15803d',
    selectedBorder: '#22c55e',
  },
  MASTERED: {
    background: '#ecfdf5',
    border: '#86efac',
    text: '#166534',
    selectedBorder: '#16a34a',
  },
};
