import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { useGetAtomsQuery } from '@0xintuition/graphql';
import { usePageMetadata } from "../hooks/usePageMetadata"
import AtomForm from './AtomForm'
import { Plus } from "lucide-react"
import { UserRound } from "lucide-react"

interface Atom {
  id: string;
  label?: string | null;
  emoji?: string | null;
  image?: string | null;
  vault?: string;
  positionCount: number;
}

interface AtomAutocompleteInputProps {
  label: string;
  onSelect: (atom: Atom) => void;
  selected: Atom | null;
  inputRef?: React.RefObject<HTMLInputElement>
}

const AtomAutocompleteInput: React.FC<AtomAutocompleteInputProps> = ({ label, onSelect, selected, inputRef }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [creatingAtom, setCreatingAtom] = useState(false);
  const [newAtomLabel, setNewAtomLabel] = useState('');
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [creationMode, setCreationMode] = useState<"input" | "page" | null>(null)
  const pageMeta = usePageMetadata()

  const [debouncedSearch] = useDebounce(search, 300);

  const internalInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSearch(selected?.label ?? '');
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setCreatingAtom(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { data } = useGetAtomsQuery(
    {
      where: {
        label: {
          _ilike: `%${debouncedSearch}%`,
        },
      },
      limit: 10,
      orderBy: {
        vault: {
          position_count: 'desc',
        },
      },
    },
    {
      enabled: debouncedSearch.length >= 2,
    }
  );

  const atoms: Atom[] =
    data?.atoms.map(atom => ({
      id: atom.id,
      label: atom.label,
      emoji: atom.emoji,
      image: atom.image,
      positionCount: atom.vault.position_count,
    })) || [];

  const handleSelect = (atom: Atom  ) => {
    onSelect(atom);
    setIsOpen(false);
    setCreatingAtom(false);

    setTimeout(() => {
      const form = inputRef.current?.form;
      if (!form || !inputRef.current) return;
      const elements = Array.from(form.elements) as HTMLElement[];
      const index = elements.indexOf(inputRef.current);
      const nextInput = elements[index + 1];
      nextInput?.focus();
    }, 0);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        ref={inputRef ? inputRef : internalInputRef}
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setNewAtomLabel(e.target.value);
          setIsOpen(true);
          setCreatingAtom(false);
        }}
        onClick={(e) => e.stopPropagation()}
        onFocus={() => setIsOpen(true)}
        className="w-full p-2 bg-[hsl(var(--navbar-bg))] text-foreground rounded border border-border/10"
      />
      
      {isOpen && (
        <ul className="absolute z-10 bg-[hsl(var(--navbar-bg))] text-foreground border border-border rounded w-full max-h-60 overflow-y-auto shadow-md">
          {atoms.map((atom) => (
            <li
              key={atom.id}
              className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => handleSelect(atom)}
            >
            {atom.image ? (
              <img
                src={atom.image}
                alt={atom.label ?? ''}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <span>{atom.emoji}</span>
            )}
              <span>{atom.label}</span>
              <span className="flex items-center text-xs text-muted-foreground ml-auto">
                <UserRound className="w-4 h-4 mr-1" />
                {atom.positionCount.toLocaleString()}

              </span>
            </li>
          ))}

          { !creatingAtom && (
            <>
              <li
                className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer italic"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setCreatingAtom(true)
                  setCreationMode("input")
                }}
              >
                <Plus size={12} />
                Create new atom « {search} »
              </li>
              <li
                className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer italic"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setCreatingAtom(true)
                  setCreationMode("page")
                }}
              >
                <Plus size={12} />
                Create from current page {pageMeta.title ? `: “${pageMeta.title}”` : ""}
              </li>
            </>
          )}

          {creatingAtom && (
            <li className="p-2">
              <AtomForm
                onCreated={(atom) => {
                  handleSelect(atom)
                  setCreatingAtom(false)
                  setCreationMode(null)
                }}
                initialName={
                  creationMode === "input" ? search :
                  creationMode === "page" ? pageMeta.title : ""
                }
                initialDescription={creationMode === "page" ? pageMeta.description : ""}
                initialImage={creationMode === "page" ? pageMeta.favicon : ""}
                initialUrl={creationMode === "page" ? pageMeta.url : ""}
              />
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AtomAutocompleteInput;
