import React, { forwardRef } from 'react'
import { cn } from '~src/lib/utils'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'

interface HoverCardTriggerProps extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Trigger> {
  className?: string;
  asChild?: boolean;
  isAtomTrigger?: boolean;
  isSelected?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const HoverCardTrigger = forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Trigger>, 
  HoverCardTriggerProps
>(({ 
  className, 
  asChild = false, 
  isAtomTrigger = false, 
  isSelected = false, 
  ...props 
}, ref) => {
  // Style de base pour tous les triggers
  const baseStyles = "cursor-pointer";
  
  // Styles spécifiques pour les atomes
  const atomStyles = isAtomTrigger ? [
    "relative z-[9000]",
    "flex items-center gap-1",
    "rounded-full px-2 py-1",
    "text-sm text-foreground",
    "bg-[hsl(var(--triple-background))]",
    "hover:border-[hsl(var(--focus-atom-border))]",
    "focus-visible:border-[hsl(var(--focus-atom-border))]",
    "transition-all duration-200",
    isSelected 
      ? "border-2 border-[oklch(var(--borderAtomSelect))] atom-selected" 
      : "border border-[hsl(var(--border-atom))]",
  ] : [];

  return (
    <HoverCardPrimitive.Trigger
      ref={ref}
      className={cn(
        baseStyles, 
        ...atomStyles,
        className
      )}
      {...props}
      asChild={asChild}
    />
  )
})

HoverCardTrigger.displayName = 'HoverCardTrigger'

export default HoverCardTrigger