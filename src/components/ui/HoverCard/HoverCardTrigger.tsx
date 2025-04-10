import React from 'react'
import { cn } from '~src/lib/utils'

interface HoverCardTriggerProps {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
  asChild?: boolean
}

export const HoverCardTrigger = React.forwardRef<HTMLDivElement, HoverCardTriggerProps>(
  ({ children, className, isOpen, setIsOpen, asChild, ...props }, ref) => {
    // Si asChild est true, on clone l'enfant avec les props nécessaires
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref,
        onClick: () => setIsOpen?.(!isOpen),
        className: cn(children.props.className, className),
        ...props
      })
    }
    return (
      <div 
        ref={ref}
        className={cn("cursor-pointer w-full", className)}
        onClick={() => setIsOpen?.(!isOpen)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
HoverCardTrigger.displayName = 'HoverCardTrigger'