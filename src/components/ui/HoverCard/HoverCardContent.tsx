import React, { forwardRef } from 'react'
import { cn } from '~src/lib/utils'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'

interface HoverCardContentProps extends React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content> {
  className?: string;
  triggerRef?: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
}

export const HoverCardContent = forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ className, triggerRef, children, ...props }, ref) => {
    const getPositionStyles = (): React.CSSProperties => {
      if (!triggerRef?.current) return {};
      
      try {
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
        
        let left = rect.left + (rect.width / 2);
        
        const popupWidth = 320;
        const minLeft = popupWidth / 2;
        const maxLeft = viewportWidth - (popupWidth / 2);
        left = Math.max(minLeft, Math.min(maxLeft, left));
        
        let top = rect.bottom + 8;
        
        const popupHeight = Math.min(400, viewportHeight * 0.8);
        if (top + popupHeight > viewportHeight) {
          top = rect.top - popupHeight - 8;
        }
        
        // Si la position est négative, repositionnement en bas
        if (top < 0) {
          top = rect.bottom + 8;
        }
        
        return {
          top: `${top}px`,
          left: `${left}px`,
          maxHeight: '80vh',
          overflowY: 'auto' as const,
        };
      } catch (error) {
        console.error("Erreur lors du calcul de position pour HoverCardContent:", error);
        return {};
      }
    };

    return (
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          ref={ref}
          className={cn(
            "hover-card-content",
            "z-[20000] rounded-lg shadow-lg",
            "w-80 p-4",
            className
          )}
          style={getPositionStyles()}
          sideOffset={8}
          collisionPadding={16}
          {...props}
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

export default HoverCardContent