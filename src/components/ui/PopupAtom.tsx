import React, { useState, useRef, useEffect } from 'react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'
import { cn } from '~src/lib/utils'
import { useGetAtomQuery } from "@0xintuition/graphql"
import { useOnClickOutside } from '~src/hooks/useOnClickOutside'
import { useAtomSelection } from './AtomSelectionContext'

interface PopupAtomProps {
  atom: {
    id: string
    label: string
    image?: string
    instanceId?: string
  }
  className?: string
}

export const PopupAtom = ({ atom, className }: PopupAtomProps) => {
  const { id, label, image, instanceId } = atom;
  const uniqueIdRef = useRef<string>(
    instanceId || `${id}-${Math.random().toString(36).substr(2, 9)}`
  );
  const uniqueInstanceId = uniqueIdRef.current;
  
  const { selectedAtomId, setSelectedAtomId } = useAtomSelection();
  const isSelected = selectedAtomId === uniqueInstanceId;
  const [isHovered, setIsHovered] = useState(false);
  const atomRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useGetAtomQuery({ id });
  
  useEffect(() => {
    console.log(`Atom ${id} (${uniqueInstanceId}) - isSelected: ${isSelected}`);
  }, [id, uniqueInstanceId, isSelected]);

  useOnClickOutside(atomRef, () => {
    if (isSelected) {
      console.log(`Clicked outside atom ${id} (${uniqueInstanceId}), closing popup`);
      setSelectedAtomId(null);
    }
  });

  return (
    <div ref={atomRef} className="relative">
      <HoverCard 
        open={isSelected || isHovered}
        onOpenChange={(open) => {
          if (!isSelected) {
            setIsHovered(open);
          }
        }}
      >
      <HoverCardTrigger 
          asChild
          onMouseEnter={() => {
            setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
        >
        <button 
          className={cn(
            "relative z-[9000]",
            "flex items-center gap-1",
            "rounded-full px-2 py-1",
            "text-sm text-foreground",
            "bg-[oklch(var(--triple-background))]",
            "hover:bg-[oklch(var(--triple-background-hover))]",
            "transition-all duration-200",
            isSelected 
              ? "border-2 border-[oklch(var(--borderAtomSelect))] atom-selected" 
              : "border border-[oklch(var(--borderAtom))]",
            className
          )}
          // Dans le onClick du bouton:
          // Dans le onClick du bouton:
          onClick={(e) => {
            e.stopPropagation();
            setSelectedAtomId(null);
            // Si on clique sur un atom déjà sélectionné, on le ferme simplement
            if (isSelected) return;
            
            setSelectedAtomId(uniqueInstanceId);
          }}
          type="button"
        >
          {image && (
            <img 
              src={image} 
              alt={label} 
              className="w-5 h-5 rounded-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png"
              }}
            />
          )}
          <span 
            className="truncate max-w-[200px] overflow-hidden whitespace-nowrap block" 
            title={label}
          >
            {label}
          </span>
        </button>
      </HoverCardTrigger>

      <HoverCardContent 
        className="w-80 bg-background border border-border shadow-lg rounded-lg"
        triggerRef={atomRef}
      >
        {isLoading ? (
          <div>Chargement...</div>
        ) : data?.atom ? (
          <div className="flex flex-col gap-2 p-4">
            {data.atom.image && (
              <img 
                src={data.atom.image} 
                alt={data.atom.label || ''} 
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://thecosmeticdentalgallery.co.uk/wp-content/uploads/2021/11/gold_fingerprint.png"
                }}
              />
            )}
            <div>
              <h3 className="font-medium text-lg">{data.atom.label}</h3>
              <p className="text-sm text-muted-foreground capitalize">{data.atom.type}</p>
              {data.atom.value?.thing?.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {data.atom.value.thing.description}
                </p>
              )}
              {data.atom.vault && (
                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Positions: </span>
                  <span className="font-medium">{data.atom.vault.position_count}</span>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </HoverCardContent>
    </HoverCard>
    </div>
  )
}

export default PopupAtom