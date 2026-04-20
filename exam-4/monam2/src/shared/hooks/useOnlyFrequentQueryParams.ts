import { parseAsBoolean, useQueryState } from 'nuqs';

const onlyFrequentParser = parseAsBoolean.withDefault(false);

export default function useOnlyFrequentQueryParams() {
  const [onlyFrequent, setOnlyFrequent] = useQueryState(
    'onlyFrequent',
    onlyFrequentParser,
  );

  const toggleOnlyFrequent = () => {
    setOnlyFrequent((previous) => !previous);
  };

  const resetOnlyFrequent = () => {
    setOnlyFrequent(false);
  };

  return {
    onlyFrequent,
    resetOnlyFrequent,
    setOnlyFrequent,
    toggleOnlyFrequent,
  };
}
