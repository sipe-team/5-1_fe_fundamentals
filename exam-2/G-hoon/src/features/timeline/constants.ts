import type { Equipment } from '@/types/reservation';

export { TIME_SLOTS, TIME_SLOTS_LENGTH } from '@/shared/constants/timePolicy';

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
