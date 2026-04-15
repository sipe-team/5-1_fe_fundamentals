import { client } from '@/shared/apis';
import type { OptionsResponse } from '@/shared/types';

export default function getOptions() {
  return client.get('catalog/options').json<OptionsResponse>();
}
