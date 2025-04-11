import React, { createContext, useState, useContext } from 'react'
import type { ReactNode } from 'react'

interface AtomSelectionContextType {
  selectedAtomId: string | null;
  setSelectedAtomId: (id: string | null) => void;
}

const AtomSelectionContext = createContext<AtomSelectionContextType | undefined>(undefined);

export const AtomSelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAtomId, setSelectedAtomId] = useState<string | null>(null);
  
  return (
    <AtomSelectionContext.Provider value={{ selectedAtomId, setSelectedAtomId }}>
      {children}
    </AtomSelectionContext.Provider>
  );
};

export const useAtomSelection = () => {
  const context = useContext(AtomSelectionContext);
  if (context === undefined) {
    throw new Error('useAtomSelection doit être utilisé dans un AtomSelectionProvider');
  }
  return context;
};