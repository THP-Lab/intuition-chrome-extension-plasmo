// src/components/ui/HoverCard/HoverCard.tsx
import React, { useState, useEffect } from 'react'
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
}

export const HoverCard = ({ children, open, onOpenChange }: HoverCardProps) => {
  const [isOpen, setIsOpen] = useState(open || false)
  // Utilisez le hook useDebounce pour lisser les changements d'état
  const debouncedIsOpen = useDebounce<boolean>(isOpen, 100);

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
      onOpenChange?.(open)
    }
  }, [open, onOpenChange])
  
  return (
    <HoverCardPrimitive.Root 
      openDelay={200}
      closeDelay={300}
      // Utilisez debouncedIsOpen au lieu de isOpen
      open={debouncedIsOpen} 
      onOpenChange={(newOpen: boolean) => {
        setIsOpen(newOpen)
        onOpenChange?.(newOpen)
      }}
    >
      {children}
    </HoverCardPrimitive.Root>
  )
}