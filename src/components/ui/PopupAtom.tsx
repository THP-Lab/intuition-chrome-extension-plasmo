// components/ui/PopupAtom.tsx
import React from 'react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'
import { cn } from '~src/lib/utils'
import { useGetAtomQuery } from "@0xintuition/graphql"


interface PopupAtomProps {
  id: string
  label: string
  image?: string
  type: string
  className?: string
}

export const PopupAtom = ({ id, label, image, type, className }: PopupAtomProps) => {
  console.log("PopupAtom props:", { id, label, image, type });

  const { data, isLoading } = useGetAtomQuery({
    id: Number(id)
  })

  console.log("PopupAtom query result:", data);
  return (
    <HoverCard>
      <HoverCardTrigger>
        <div 
          className={cn(
            "relative z-[9999]",
            "flex items-center gap-1 border border-border rounded-full px-2 py-1 text-sm text-foreground bg-[oklch(var(--triple-background))]",
            "hover:bg-[oklch(var(--triple-background-hover))]",
            "transition-colors duration-200",
            className
          )}
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
        </div>
      </HoverCardTrigger>

      <HoverCardContent 
        className="w-80 bg-background border border-border shadow-lg rounded-lg z-[2]"
      >
        {isLoading ? (
          <div>Chargement...</div>
        ) : data?.atom ? (
          <div className="flex items-center gap-4">
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
  )
}

export default PopupAtom