import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type ChipSelectionState = {
  selectedChipIds: Set<number>;
};

type ChipSelectionActions = {
  toggleChipSelection: (chipId: number) => void;
  setChipSelection: (chipIds: number[], shouldSelect: boolean) => void;
  resetSelection: () => void;
};

const ChipSelectionStateContext = createContext<ChipSelectionState | null>(null);
const ChipSelectionActionsContext = createContext<ChipSelectionActions | null>(null);

type ChipSelectionProviderProps = {
  children: ReactNode;
};

export function ChipSelectionProvider({ children }: ChipSelectionProviderProps) {
  const [selectedChipIds, setSelectedChipIds] = useState<Set<number>>(new Set());

  const toggleChipSelection = useCallback((chipId: number) => {
    setSelectedChipIds((prev) => {
      const next = new Set(prev);
      if (next.has(chipId)) next.delete(chipId);
      else next.add(chipId);
      return next;
    });
  }, []);

  const setChipSelection = useCallback((chipIds: number[], shouldSelect: boolean) => {
    setSelectedChipIds((prev) => {
      if (chipIds.length === 0) return prev;

      let hasChanged = false;
      const next = new Set(prev);

      if (shouldSelect) {
        for (const chipId of chipIds) {
          if (!next.has(chipId)) {
            next.add(chipId);
            hasChanged = true;
          }
        }
      } else {
        for (const chipId of chipIds) {
          if (next.has(chipId)) {
            next.delete(chipId);
            hasChanged = true;
          }
        }
      }

      return hasChanged ? next : prev;
    });
  }, []);

  const resetSelection = useCallback(() => {
    setSelectedChipIds(new Set());
  }, []);

  const stateValue = useMemo(
    () => ({
      selectedChipIds,
    }),
    [selectedChipIds],
  );

  const actionsValue = useMemo(
    () => ({
      toggleChipSelection,
      setChipSelection,
      resetSelection,
    }),
    [resetSelection, setChipSelection, toggleChipSelection],
  );

  return (
    <ChipSelectionStateContext.Provider value={stateValue}>
      <ChipSelectionActionsContext.Provider value={actionsValue}>
        {children}
      </ChipSelectionActionsContext.Provider>
    </ChipSelectionStateContext.Provider>
  );
}

export function useChipSelectionState() {
  const context = useContext(ChipSelectionStateContext);

  if (!context) {
    throw new Error('useChipSelectionState must be used within ChipSelectionProvider');
  }

  return context;
}

export function useChipSelectionActions() {
  const context = useContext(ChipSelectionActionsContext);

  if (!context) {
    throw new Error('useChipSelectionActions must be used within ChipSelectionProvider');
  }

  return context;
}
