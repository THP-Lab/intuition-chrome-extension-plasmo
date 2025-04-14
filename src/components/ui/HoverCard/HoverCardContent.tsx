// src/components/ui/HoverCard/HoverCardContent.tsx
import React from 'react'
import { cn } from '~src/lib/utils'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'

interface HoverCardContentProps {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  triggerRef?: React.RefObject<HTMLElement>
  setIsOpen?: (isOpen: boolean) => void
  setIsOpen?: (isOpen: boolean) => void
}

export const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ className, isOpen, children, triggerRef, ...props }, ref) => {
    // Filtrer setIsOpen des props
    const { setIsOpen, ...domProps } = props;
    
    return (
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          ref={ref}
          className={cn(
            "hover-card-content",
            isOpen && "hover-card-content-open",
            className
          )}
          sticky="partial"
          collisionPadding={16}
          side="bottom"
          align="center" 
          sideOffset={8}
          avoidCollisions={true}
          {...domProps}
        >
          {children}
          <HoverCardPrimitive.Arrow 
            className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-popover" 
          />
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    )
  }
)


HoverCardContent.displayName = 'HoverCardContent'