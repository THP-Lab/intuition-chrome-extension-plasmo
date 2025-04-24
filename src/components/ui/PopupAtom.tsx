import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'
import { useGetAtomQuery } from "@0xintuition/graphql"
import { ImageWithFallback } from './ImageWithFallback'
import { useAtomInteraction } from '~src/hooks/useAtomInteraction'
import { Fingerprint } from "lucide-react"


interface PopupAtomProps {
  atom: {
    id: string
    label: string
    image?: string
  }
}

export const PopupAtom = ({ atom }: PopupAtomProps) => {
  if (!atom) return null
  const { id, label, image } = atom;
  const atomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetAtomQuery({ id });
  const { isHovered, setIsHovered, isOpen } = useAtomInteraction()

  const goToAtomPage = () => {
    navigate(`/atoms/${id}`)
  };

  const renderAtomImage = () => {
    if (image) {
      return (
        <ImageWithFallback
          src={image}
          alt={label}
          className="w-5 h-5 rounded-full object-cover"
        />
      )
    }
    return (
      <div className="w-5 h-5 flex items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Fingerprint size={14} />
      </div>
    )
  }

  const renderAtomDetail = () =>
    data?.atom?.image ? (
      <ImageWithFallback
        src={data.atom.image}
        alt={data.atom.label || ""}
        className="w-12 h-12 rounded-full object-cover"
      />
    ) : (
      <div className="w-12 h-12 flex items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Fingerprint className="w-6 h-6" />
      </div>
    )

    const renderAtomDescription = () =>
      data?.atom?.value?.thing?.description ? (
        <p className="text-sm text-muted-foreground mt-2">
          {data.atom.value.thing.description}
        </p>
      ) : null

    const renderVaultInfo = () =>
      data?.atom?.vault ? (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Positions: </span>
          <span className="font-medium">{data.atom.vault.position_count}</span>
        </div>
      ) : null
    

    const renderCardContent = () => {
      if (isLoading) return <div className="p-4">Chargement...</div>
      if (error) return <div className="p-4 text-red-500">Erreur de chargement</div>
      if (!data?.atom) return <div className="p-4">Aucune information disponible</div>
  
      return (
        <div className="flex flex-col gap-2 p-4">
          {renderAtomDetail()}
          <div>
            <h3 className="font-medium text-lg">{data.atom.label}</h3>
            {renderAtomDescription()}
            {renderVaultInfo()}
          </div>
        </div>
      )
    }
  
    return (
      <div ref={atomRef} className="relative">
        <HoverCard
          open={isOpen}
          onOpenChange={setIsHovered}
        >
          <HoverCardTrigger
            asChild
            isAtomTrigger
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              type="button"
              onClick={goToAtomPage}
              className="flex items-center gap-1"
            >
              {renderAtomImage()}
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
            {renderCardContent()}
          </HoverCardContent>
        </HoverCard>
      </div>
    )
  }
  
  export default PopupAtom;