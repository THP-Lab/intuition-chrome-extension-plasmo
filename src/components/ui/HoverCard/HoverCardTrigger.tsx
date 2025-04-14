// src/components/ui/HoverCard/HoverCardTrigger.tsx
import React from 'react'
import { cn } from '~src/lib/utils'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'

interface HoverCardTriggerProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

// Changeons le type de référence pour correspondre à ce que Radix UI attend
export const HoverCardTrigger = React.forwardRef<HTMLAnchorElement, HoverCardTriggerProps>(
  ({ children, className, asChild = false, ...props }, ref) => {
    return (
      <HoverCardPrimitive.Trigger
        ref={ref}
        className={cn("cursor-pointer w-full", className)}
        asChild={asChild}
        {...props}
      >
        {children}
      </HoverCardPrimitive.Trigger>
    );
  }
);

HoverCardTrigger.displayName = 'HoverCardTrigger';