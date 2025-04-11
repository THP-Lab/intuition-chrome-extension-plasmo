import React, { useState, useEffect } from 'react'
import { cn } from '~src/lib/utils'

interface HoverCardProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface HoverCardChildProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export const HoverCard = ({ children, open, onOpenChange }: HoverCardProps) => {
  const [isOpen, setIsOpen] = useState(open || false)

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
      onOpenChange?.(open)
    }
  }, [open, onOpenChange])
  
  console.log("HoverCard rendu, isOpen:", isOpen);

  return (
    <div 
      className="relative inline-block w-full"
      data-state={isOpen ? "open" : "closed"}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          // Ne pas passer setIsOpen aux éléments DOM
          const childType = child.type;
          const isCustomComponent = typeof childType !== 'string'; 
          
          if (isCustomComponent) {
            // Pour les composants personnalisés uniquement
            return React.cloneElement(child, { 
              isOpen,
              setIsOpen
            } as HoverCardChildProps);
          } else {
            // Pour les éléments DOM, ne rien modifier
            return child;
          }
        }
        return child;
      })}
    </div>
  )
}