import { useState } from 'react';

export function useAtomInteraction() {
  const [isHovered, setIsHovered] = useState(false);

  return {
    isHovered,
    setIsHovered,
    isOpen: isHovered,
  };
}

export default useAtomInteraction;