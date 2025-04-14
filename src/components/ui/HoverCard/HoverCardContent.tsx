import React, { useEffect } from 'react'
import { cn } from '~src/lib/utils'
import { Portal } from '~src/components/PortalPopup'

interface HoverCardContentProps {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  triggerRef?: React.RefObject<HTMLElement>
  setIsOpen?: (isOpen: boolean) => void
}

export const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ className, isOpen, children, triggerRef, ...props }, ref) => {
    const style = triggerRef?.current ? getPopupPosition(triggerRef.current) : {};
    const { setIsOpen, ...domProps } = props;

    return (
      <Portal>
        <div
          ref={ref}
          className={cn(
            "fixed z-[10000]",
            "w-80 mt-2",
            "flex flex-col gap-4 rounded-md",
            "bg-popover p-4 text-popover-foreground shadow-md",
            
            "hover-card-content",
            isOpen && "hover-card-content-open",
            
            className
          )}
          data-state={isOpen ? "open" : "closed"}
          style={{
            ...style,
            visibility: isOpen ? 'visible' : 'hidden',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
          {...domProps}
        >
          {isOpen && (
            <>
              {children}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-popover" />
            </>
          )}
        </div>
      </Portal>
    )
  }
)

function getPopupPosition(triggerElement: HTMLElement) {
  const rect = triggerElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
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
  
  return {
    top: `${top}px`,
    left: `${left}px`,
    transform: 'translateX(-50%)',
    maxHeight: '80vh',
    overflowY: 'auto',
    zIndex: 10000
  };
}

HoverCardContent.displayName = 'HoverCardContent'