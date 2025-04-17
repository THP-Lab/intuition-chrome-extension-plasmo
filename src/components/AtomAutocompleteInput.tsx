import React, { useState, useEffect, useRef } from 'react';
import { useDebounce } from 'use-debounce';
import { useGetAtomsQuery } from '@0xintuition/graphql';

interface Atom {
  id: string;
  label?: string | null;
  emoji?: string | null;
  vault_id: string;  
}

interface AtomAutocompleteInputProps {
  label: string;
  onSelect: (atom: Atom) => void;
}

const AtomAutocompleteInput: React.FC<AtomAutocompleteInputProps> = ({ label, onSelect }) => {
  const [search, setSearch] = useState('');
  const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [debouncedSearch] = useDebounce(search, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { data, isLoading } = useGetAtomsQuery(
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

  const atoms: Atom[] = data?.atoms.map(atom => ({
    id: atom.id,
    label: atom.label,
    emoji: atom.emoji,
    vault_id: atom.vault_id,
  })) || []

  const handleSelect = (atom: Atom) => {
    console.log('Atom sélectionné :', atom); 
    setSelectedAtom(atom);
    onSelect(atom);
    setIsOpen(false);

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
        value={selectedAtom?.label ?? search}
        onChange={(e) => {
          setSearch(e.target.value);
          setSelectedAtom(null);
          setIsOpen(true);
        }}
        className="w-full p-2 bg-[hsl(var(--navbar-bg))] text-foreground rounded border border-border/10"
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && atoms.length > 0 && (
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
        </ul>
      )}
    </div>
  );
};

export default AtomAutocompleteInput;
