import { createSerializer, parseAsInteger, parseAsString } from 'nuqs';
import {
  createReservationSearchSchema,
  timelineSearchSchema,
  type CreateReservationSearchInput,
  type TimelineSearchInput,
} from '@/reservation/schemas/searchParams';

export const timelineSearchParsers = {
  date: parseAsString,
  minCapacity: parseAsInteger,
  equipment: parseAsString,
};

export const createReservationSearchParsers = {
  ...timelineSearchParsers,
  roomId: parseAsString,
  startTime: parseAsString,
};

export const serializeTimelineSearch = createSerializer(timelineSearchParsers);
export const serializeCreateReservationSearch = createSerializer(
  createReservationSearchParsers,
);

export function normalizeTimelineSearch(
  search: TimelineSearchInput,
) {
  return timelineSearchSchema.parse(search);
}

export function normalizeCreateReservationSearch(
  search: CreateReservationSearchInput,
) {
  return createReservationSearchSchema.parse(search);
}

export function getTimelineSearchValues({
  date,
  minCapacity,
  equipment,
}: {
  date: string;
  minCapacity?: number;
  equipment?: string;
}) {
  return {
    date,
    minCapacity: minCapacity && minCapacity > 0 ? minCapacity : null,
    equipment: equipment || null,
  };
}
