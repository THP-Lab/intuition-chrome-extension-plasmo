import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'
import { useGetAtomQuery } from "@warzieram/graphql"
import { ImageWithFallback } from './ImageWithFallback'
import { useAtomInteraction } from '~src/hooks/useAtomInteraction'
import { Fingerprint } from "lucide-react"


interface PopupAtomProps {
  atom: {
    term_id: string
    label?: string | null
    image?: string | null
  }
}

export const PopupAtom = ({ atom }: PopupAtomProps) => {
  if (!atom) return null
  const { term_id, label, image } = atom;
  const atomRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { isHovered, setIsHovered, isOpen } = useAtomInteraction()
  const { data, loading, error } = useGetAtomQuery({ variables: {term_id}, skip: !isOpen, fetchPolicy: "cache-first" });


  const goToAtomPage = () => {
    navigate(`/atoms/${term_id}`)
  };

  const renderAtomImage = () => {
    if (image) {
      return (
        <ImageWithFallback
          src={image}
          alt={label || ""}
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
      data?.atom?.term?.positions_aggregate?.aggregate ? (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Positions: </span>
          <span className="font-medium">{data.atom.term.positions_aggregate.aggregate.count}</span>
        </div>
      ) : null
    

    const renderCardContent = () => {
      if (loading) return <div className="p-4">Loading...</div>
      if (error) return <div className="p-4 text-red-500">Error Loading</div>
      if (!data?.atom) return <div className="p-4">No information available</div>
  
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
                className="truncate max-w-[120px] overflow-hidden whitespace-nowrap block"
                title={label || ""}
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
