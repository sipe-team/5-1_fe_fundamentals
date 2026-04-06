import { ALL_EQUIPMENT } from '@/reservation/constants';
import type { Equipment, Room } from '@/reservation/types';

export function filterRooms(
  rooms: Room[],
  minCapacity: number,
  selectedEquipment: Equipment[],
): Room[] {
  return rooms.filter((room) => {
    if (room.capacity < minCapacity) return false;
    if (selectedEquipment.length > 0) {
      return selectedEquipment.every((eq) => room.equipment.includes(eq));
    }
    return true;
  });
}

const VALID_EQUIPMENT = new Set<string>(ALL_EQUIPMENT);

export function parseEquipment(str: string): Equipment[] {
  if (!str) return [];
  return str.split(',').filter((e): e is Equipment => VALID_EQUIPMENT.has(e));
}
