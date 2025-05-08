import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { useGetAtomsQuery } from '@0xintuition/graphql';
import { usePageMetadata } from "../hooks/usePageMetadata"
import AtomForm from './AtomForm'
import { Plus } from "lucide-react"


interface Atom {
  id: string;
  label?: string | null;
  emoji?: string | null;
  vault_id: string;
}

interface AtomAutocompleteInputProps {
  label: string;
  onSelect: (atom: Atom) => void;
  selected: Atom | null;
}

const AtomAutocompleteInput: React.FC<AtomAutocompleteInputProps> = ({ label, onSelect, selected }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [creatingAtom, setCreatingAtom] = useState(false);
  const [newAtomLabel, setNewAtomLabel] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [creationMode, setCreationMode] = useState<"input" | "page" | null>(null)
  const pageMeta = usePageMetadata()

  const [debouncedSearch] = useDebounce(search, 300);

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
      vault_id: atom.vault_id,
    })) || [];

  const handleSelect = (atom: Atom) => {
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
        ref={inputRef}
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
              className="p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onClick={() => handleSelect(atom)}
            >
              {atom.emoji && <span className="mr-2">{atom.emoji}</span>}
              <span>{atom.label}</span>
              <span className="text-xs text-muted-foreground ml-2">({atom.id})</span>
            </li>
          ))}

          { !creatingAtom && (
            <>
              <li
                className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer italic"
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
