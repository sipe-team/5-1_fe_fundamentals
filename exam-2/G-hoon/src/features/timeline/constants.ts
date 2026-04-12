import type { Equipment } from '@/types/reservation';

export const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
];

export const TIME_SLOTS_LENGTH = TIME_SLOTS.length;

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  monitor: '모니터',
  whiteboard: '화이트보드',
  video_conference: '화상회의',
  projector: '빔프로젝터',
};

export const CAPACITY_OPTIONS = [
  { label: '전체', value: '0' },
  { label: '4인 이상', value: '4' },
  { label: '8인 이상', value: '8' },
  { label: '15인 이상', value: '15' },
];
