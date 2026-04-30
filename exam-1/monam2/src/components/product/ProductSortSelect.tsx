import { Select } from '@/components';
import { DEFAULT_SORT, SORT_OPTIONS } from '@/constants';
import { useRouteParams } from '@/hooks';
import { isSortOption } from '@/types';

export default function ProductSortSelect() {
  const { updateQuery, currentQuery } = useRouteParams();
  const selectedSort = currentQuery.sort ?? DEFAULT_SORT;

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    if (!isSortOption(value)) {
      return;
    }

    updateQuery({
      sort: value,
    });
  };

  return (
    <Select options={SORT_OPTIONS} value={selectedSort} onChange={onChange} />
  );
}
