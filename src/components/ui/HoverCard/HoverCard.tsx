import React, { useState, useEffect, useCallback } from 'react'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

interface HoverCardProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  openDelay?: number
  closeDelay?: number
}

export const HoverCard = ({ 
  children, 
  open, 
  onOpenChange,
  openDelay = 200,
  closeDelay = 300
}: HoverCardProps) => {
  const [isOpen, setIsOpen] = useState(open || false);
  const debouncedIsOpen = useDebounce<boolean>(isOpen, 100);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  }, [onOpenChange]);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);
  
  return (
    <HoverCardPrimitive.Root 
      openDelay={openDelay}
      closeDelay={closeDelay}
      open={debouncedIsOpen} 
      onOpenChange={handleOpenChange}
    >
      {children}
    </HoverCardPrimitive.Root>
  )
}

export default HoverCard;