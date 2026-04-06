import { useRooms } from './queries/useRooms';

export function useRoomName(roomId: string): string {
  const { data: rooms } = useRooms();
  return rooms.find((r) => r.id === roomId)?.name ?? roomId;
}
