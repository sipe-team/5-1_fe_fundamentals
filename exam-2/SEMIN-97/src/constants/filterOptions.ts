import type { Equipment } from '@/types/reservation.ts'

export const CAPACITY_OPTIONS = [
  { label: '수용 인원 전체', value: 0 },
  { label: '4인 이상', value: 4 },
  { label: '8인 이상', value: 8 },
  { label: '15인 이상', value: 15 },
]

export const EQUIPMENT_OPTIONS: { label: string; value: Equipment | '' }[] = [
  { label: '장비 전체', value: '' },
  { label: '모니터', value: 'monitor' },
  { label: '화이트보드', value: 'whiteboard' },
  { label: '화상회의', value: 'video_conference' },
  { label: '빔프로젝터', value: 'projector' },
]
