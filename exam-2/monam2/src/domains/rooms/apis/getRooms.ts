import { client } from '@/shared/apis';
import type { RoomsResponse } from '@/shared/types';

export default function getRooms() {
  return client.get('rooms').json<RoomsResponse>();
}
