import { parseAsArrayOf, parseAsInteger, useQueryState } from 'nuqs';

const selectedChipIdsParser = parseAsArrayOf(parseAsInteger).withDefault([]);

export default function useSelectedChipIdsQueryParams() {
  const [selectedChipIds, setSelectedChipIds] = useQueryState(
    'selectedChipIds',
    selectedChipIdsParser,
  );

  const toggleSelectedChip = (chipId: number) => {
    setSelectedChipIds((previous) => {
      if (previous.includes(chipId)) {
        return previous.filter((selectedChipId) => selectedChipId !== chipId);
      }

      return [...previous, chipId];
    });
  };

  const resetSelectedChipIds = () => {
    setSelectedChipIds([]);
  };

  const isSelectedChip = (chipId: number) => selectedChipIds.includes(chipId);

  return {
    isSelectedChip,
    resetSelectedChipIds,
    selectedChipIds,
    setSelectedChipIds,
    toggleSelectedChip,
  };
}
