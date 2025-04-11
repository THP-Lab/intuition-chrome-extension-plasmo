import React, { forwardRef } from 'react'
import { cn } from '~src/lib/utils'

interface HoverCardTriggerProps {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
  asChild?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const HoverCardTrigger = forwardRef<HTMLDivElement, HoverCardTriggerProps>(
  ({ children, className, isOpen, setIsOpen, asChild, ...props }, ref) => {
    const handleMouseEnter = () => {
      console.log("HoverCardTrigger: onMouseEnter");
      props.onMouseEnter?.();
      setIsOpen?.(true);
    }

    const handleMouseLeave = () => {
      console.log("HoverCardTrigger: onMouseLeave");
      props.onMouseLeave?.();
      setIsOpen?.(false);
    }

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        className: cn(children.props.className, className),
        ...props
      } as React.HTMLAttributes<HTMLElement>)
    }

    return (
      <div 
        ref={ref}
        className={cn("cursor-pointer w-full", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    )
  }
)

HoverCardTrigger.displayName = 'HoverCardTrigger'