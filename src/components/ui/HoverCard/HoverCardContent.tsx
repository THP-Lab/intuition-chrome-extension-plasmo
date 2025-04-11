import React, { useEffect } from 'react'
import { cn } from '~src/lib/utils'
import { Portal } from '~src/components/PortalPopup'

interface HoverCardContentProps {
  children: React.ReactNode
  className?: string
  isOpen?: boolean
  triggerRef?: React.RefObject<HTMLElement>
}

export const HoverCardContent = React.forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ className, isOpen, children, triggerRef, ...props }, ref) => {
    console.log("HoverCardContent rendu, isOpen:", isOpen);
    console.log("triggerRef existe:", !!triggerRef?.current);
    
    useEffect(() => {
      if (isOpen && triggerRef?.current) {
        console.log("Position de l'élément déclencheur:", triggerRef.current.getBoundingClientRect());
      }
    }, [isOpen, triggerRef]);
    
    // AMÉLIORATION: Ne pas retourner null quand isOpen est false
    // pour permettre l'animation de sortie
    
    // Calculer le style de positionnement même si non visible
    const style = triggerRef?.current ? getPopupPosition(triggerRef.current) : {};
    console.log("Style calculé pour la popup:", style);
    
    return (
      <Portal>
        <div
          ref={ref}
          className={cn(
            // Classes de base toujours appliquées
            "fixed z-[10000]",
            "w-80 mt-2",
            "flex flex-col gap-4 rounded-md",
            "bg-popover p-4 text-popover-foreground shadow-md",
            
            // Classes pour l'animation
            "hover-card-content",
            isOpen && "hover-card-content-open",
            
            // Classes personnalisées
            className
          )}
          data-state={isOpen ? "open" : "closed"}
          style={{
            ...style,
            // Rendre visible uniquement si isOpen est true
            // mais garder le nœud DOM pour l'animation
            visibility: isOpen ? 'visible' : 'hidden',
            pointerEvents: isOpen ? 'auto' : 'none',
          }}
          {...props}
        >
          {/* Rendre les enfants uniquement si isOpen pour éviter 
              des calculs inutiles quand fermé */}
          {isOpen && (
            <>
              {children}
              {/* Flèche pointant vers l'élément déclencheur */}
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
  
  // Position centrée horizontalement par rapport au trigger
  let left = rect.left + (rect.width / 2);
  
  // S'assurer que la popup reste dans l'écran horizontalement
  // en supposant une largeur de popup de 320px (w-80)
  const popupWidth = 320;
  const minLeft = popupWidth / 2;
  const maxLeft = viewportWidth - (popupWidth / 2);
  left = Math.max(minLeft, Math.min(maxLeft, left));
  
  // Calculer la position verticale (en dessous du trigger)
  let top = rect.bottom + 8;
  
  // Si la popup sort en bas de l'écran, la positionner au-dessus
  const popupHeight = Math.min(400, viewportHeight * 0.8); // estimation
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