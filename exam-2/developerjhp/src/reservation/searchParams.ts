import { z } from "zod";
import { createSerializer, parseAsInteger, parseAsString } from "nuqs";
import {
  ALL_EQUIPMENT,
  MIN_CAPACITY_OPTIONS,
  TIME_SLOTS,
} from "@/reservation/constants";
import type { Equipment } from "@/reservation/types";

// --- Schema ---

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const VALID_MIN_CAPACITY_VALUES = new Set<number>(
  MIN_CAPACITY_OPTIONS.map((option) => option.value),
);
const VALID_TIME_SLOT_VALUES = new Set<string>(TIME_SLOTS);
const equipmentSchema = z.enum(ALL_EQUIPMENT);
const timeSlotSchema = z
  .string()
  .refine((value) => VALID_TIME_SLOT_VALUES.has(value));

function normalizeEquipment(equipment: string | null | undefined): {
  equipment: string | undefined;
  selectedEquipment: Equipment[];
} {
  if (!equipment) {
    return { equipment: undefined, selectedEquipment: [] };
  }

  const selectedEquipment = Array.from(
    new Set(
      equipment.split(",").flatMap((value) => {
        const parsed = equipmentSchema.safeParse(value);
        return parsed.success ? [parsed.data] : [];
      }),
    ),
  );

  return {
    equipment:
      selectedEquipment.length > 0 ? selectedEquipment.join(",") : undefined,
    selectedEquipment,
  };
}

const timelineSearchSchema = z
  .object({
    date: z.string().nullish(),
    minCapacity: z.number().nullish(),
    equipment: z.string().nullish(),
  })
  .transform(({ date, minCapacity, equipment }) => {
    const normalizedEquipment = normalizeEquipment(equipment);

    return {
      date:
        typeof date === "string" && DATE_REGEX.test(date) ? date : undefined,
      minCapacity:
        typeof minCapacity === "number" &&
        VALID_MIN_CAPACITY_VALUES.has(minCapacity)
          ? minCapacity
          : undefined,
      equipment: normalizedEquipment.equipment,
      selectedEquipment: normalizedEquipment.selectedEquipment,
    };
  });

const createReservationSearchSchema = z
  .object({
    date: z.string().nullish(),
    minCapacity: z.number().nullish(),
    equipment: z.string().nullish(),
    roomId: z.string().nullish(),
    startTime: z.string().nullish(),
  })
  .transform(({ roomId, startTime, ...timelineSearch }) => {
    const normalizedTimelineSearch = timelineSearchSchema.parse(timelineSearch);

    return {
      ...normalizedTimelineSearch,
      roomId:
        typeof roomId === "string" && roomId.trim().length > 0
          ? roomId
          : undefined,
      startTime:
        typeof startTime === "string" &&
        timeSlotSchema.safeParse(startTime).success
          ? startTime
          : undefined,
    };
  });

export type TimelineSearchInput = z.input<typeof timelineSearchSchema>;
export type CreateReservationSearchInput = z.input<
  typeof createReservationSearchSchema
>;

// --- Parsers & Serializers ---

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

// --- Normalize & Helpers ---

export function normalizeTimelineSearch(search: TimelineSearchInput) {
  return timelineSearchSchema.parse(search);
}

export function normalizeCreateReservationSearch(
  search: CreateReservationSearchInput,
) {
  return createReservationSearchSchema.parse(search);
}
