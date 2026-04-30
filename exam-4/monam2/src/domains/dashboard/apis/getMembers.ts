import { client } from '@/shared/apis';
import type { Member } from '@/shared/types';

export async function getMembers() {
  return client.get('members').json<Member[]>();
}
