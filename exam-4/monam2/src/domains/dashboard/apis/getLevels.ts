import { client } from '@/shared/apis';
import type { Level } from '@/shared/types';

export async function getLevels() {
  return client.get('levels').json<Level[]>();
}
