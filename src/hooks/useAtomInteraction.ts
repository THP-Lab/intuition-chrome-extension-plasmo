import { useState } from 'react';
import { useAtomSelection } from '~/src/components/ui/AtomSelectionContext';

export function useAtomInteraction(uniqueInstanceId: string) {
  const { selectedAtomId, setSelectedAtomId } = useAtomSelection();
  const [isHovered, setIsHovered] = useState(false);
  
  const isSelected = selectedAtomId === uniqueInstanceId;
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSelected) {
      setSelectedAtomId(null);
      return;
    }
    
    setSelectedAtomId(uniqueInstanceId);
  };
  
  return {
    isSelected,
    isHovered,
    setIsHovered,
    handleClick,
    isOpen: isSelected || isHovered,
    setSelectedAtomId
  };
}

export default useAtomInteraction;