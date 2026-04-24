import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface MemberSelectionContextValue {
  selectedMemberId: number | null;
  setSelectedMemberId: (memberId: number) => void;
}

const MemberSelectionContext =
  createContext<MemberSelectionContextValue | null>(null);

interface MemberSelectionProviderProps {
  children: ReactNode;
}

export function MemberSelectionProvider({
  children,
}: MemberSelectionProviderProps) {
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const value = useMemo(
    () => ({
      selectedMemberId,
      setSelectedMemberId,
    }),
    [selectedMemberId],
  );

  return (
    <MemberSelectionContext.Provider value={value}>
      {children}
    </MemberSelectionContext.Provider>
  );
}

export function useMemberSelection() {
  const context = useContext(MemberSelectionContext);

  if (!context) {
    throw new Error(
      'useMemberSelection must be used within MemberSelectionProvider',
    );
  }

  return context;
}
