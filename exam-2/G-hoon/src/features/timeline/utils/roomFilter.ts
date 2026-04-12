import type { Equipment, Room } from '@/types/reservation';

export function matchesFloor(floor: number | null) {
  return (room: Room) => floor === null || room.floor === floor;
}

export function matchesCapacity(minCapacity: number) {
  return (room: Room) => minCapacity <= 0 || room.capacity >= minCapacity;
}

export function matchesEquipment(equipment: Equipment[]) {
  return (room: Room) =>
    equipment.length === 0 ||
    equipment.every((eq) => room.equipment.includes(eq));
}

export function createRoomFilter(options: {
  floor: number | null;
  capacity: number;
  equipment: Equipment[];
}) {
  const predicates = [
    matchesFloor(options.floor),
    matchesCapacity(options.capacity),
    matchesEquipment(options.equipment),
  ];

  return (room: Room) => predicates.every((predicate) => predicate(room));
}
