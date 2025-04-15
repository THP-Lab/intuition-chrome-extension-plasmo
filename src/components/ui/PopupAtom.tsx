import React, { useState, useRef, useId } from 'react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'
import { useGetAtomQuery } from "@0xintuition/graphql"
import { useOnClickOutside } from '~src/hooks/useOnClickOutside'
import { useAtomSelection } from './AtomSelectionContext'
import { ImageWithFallback } from './ImageWithFallback'
import { useAtomInteraction } from '~src/hooks/useAtomInteraction'

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
  
  const uniqueId = useId();
  const uniqueInstanceId = instanceId || `${id}-${uniqueId}`;
  
  const atomRef = useRef<HTMLDivElement>(null);
  const { data, isLoading, error } = useGetAtomQuery({ id });
  
  const { 
    isSelected, 
    isHovered, 
    setIsHovered, 
    handleClick, 
    isOpen, 
    setSelectedAtomId 
  } = useAtomInteraction(uniqueInstanceId);

  useOnClickOutside(atomRef, () => {
    if (isSelected) {
      setSelectedAtomId(null);
    }
  });

  const renderAtomImage = () => {
    if (!image) return null;
    
    return (
      <ImageWithFallback 
        src={image}  
        alt={label} 
        className="w-5 h-5 rounded-full object-cover"
      />
    );
  };

  const renderAtomDetail = () => {
    if (data?.atom?.image) {
      return (
        <ImageWithFallback 
          src={data.atom.image} 
          alt={data.atom.label || ''} 
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    }
    return null;
  };

  const renderAtomDescription = () => {
    if (data?.atom?.value?.thing?.description) {
      return (
        <p className="text-sm text-muted-foreground mt-2">
          {data.atom.value.thing.description}
        </p>
      );
    }
    return null;
  };

  const renderVaultInfo = () => {
    if (data?.atom?.vault) {
      return (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Positions: </span>
          <span className="font-medium">{data.atom.vault.position_count}</span>
        </div>
      );
    }
    return null;
  };

  const renderCardContent = () => {
    if (isLoading) {
      return <div className="p-4">Chargement...</div>;
    }
    
    if (error) {
      return <div className="p-4 text-red-500">Erreur de chargement</div>;
    }
    
    if (!data?.atom) {
      return <div className="p-4">Aucune information disponible</div>;
    }
    
    return (
      <div className="flex flex-col gap-2 p-4">
        {renderAtomDetail()}
        <div>
          <h3 className="font-medium text-lg">{data.atom.label}</h3>
          {renderAtomDescription()}
          {renderVaultInfo()}
        </div>
      </div>
    );
  };

  return (
    <div ref={atomRef} className="relative">
      <HoverCard 
        open={isOpen}
        onOpenChange={(open) => {
          if (!isSelected) {
            setIsHovered(open);
          }
        }}
      >
        <HoverCardTrigger 
          asChild
          isAtomTrigger={true}
          isSelected={isSelected}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <button 
            onClick={handleClick}
            type="button"
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
  );
};

export default PopupAtom