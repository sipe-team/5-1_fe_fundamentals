import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

const openFieldIdsParser = parseAsArrayOf(parseAsString);

export default function useOpenFieldIdsQueryParams() {
  const [openFieldIds, setOpenFieldIds] = useQueryState(
    'openFieldIds',
    openFieldIdsParser,
  );

  const resetOpenFieldIds = () => {
    setOpenFieldIds(null);
  };

  return {
    openFieldIds,
    resetOpenFieldIds,
    setOpenFieldIds,
  };
}
