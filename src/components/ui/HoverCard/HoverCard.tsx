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
  'data-state'?: string;
  className?: string;
}

export const HoverCard = ({ children, open, onOpenChange }: HoverCardProps) => {
  const [isOpen, setIsOpen] = useState(open || false)

  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
      onOpenChange?.(open)
    }
  }, [open, onOpenChange])

  return (
    <div 
      className="relative inline-block w-full"
      data-state={isOpen ? "open" : "closed"}
    >
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { 
            isOpen,
            setIsOpen,
            'data-state': isOpen ? "open" : "closed",
            className: cn(child.props.className)
          } as HoverCardChildProps);
        }
        return child
      })}
    </div>
  )
}