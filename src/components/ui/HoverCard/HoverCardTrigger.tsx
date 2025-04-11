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
      props.onMouseEnter?.();
      setIsOpen?.(true);
    }

    const handleMouseLeave = () => {
      props.onMouseLeave?.();
      setIsOpen?.(false);
    }

    if (asChild && React.isValidElement(children)) {
      // Créer un objet de props filtré sans les props spécifiques à nos composants
      const childProps = {
        ...props,
        ref,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        className: cn(children.props.className, className)
      };
      
      // Utiliser un objet séparé pour éviter les erreurs TypeScript
      const cleanedProps: Record<string, any> = {};
      Object.keys(childProps).forEach(key => {
        if (key !== 'isOpen' && key !== 'setIsOpen' && key !== 'asChild') {
          cleanedProps[key] = childProps[key as keyof typeof childProps];
        }
      });
      
      return React.cloneElement(children, cleanedProps);
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
    );
  }
);

HoverCardTrigger.displayName = 'HoverCardTrigger';