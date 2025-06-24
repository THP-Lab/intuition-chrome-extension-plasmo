// src/components/ReportDropdown.tsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useSignalProcess } from "../hooks/useSignalProcess"

const ChevronDown = () => (
  <svg width="16" height="16" fill="none">
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const SignalDropdown = ({ atoms, uri }) => {
  const { handleSignal } = useSignalProcess({
    atoms,
    uri,
    onSuccess: () => {/* popup succès */},
    onError: () => {/* popup erreur */}
  })

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center px-3 py-1 rounded bg-white text-black border border-gray-300 hover:bg-gray-100"
          style={{ fontWeight: 500, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
        >
          Signal
          <span className="ml-1">
            <ChevronDown />
          </span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal container={window.document.body}>
        <DropdownMenu.Content
          className="bg-white rounded shadow-lg p-1 border border-gray-200 z-[9999]"
          sideOffset={4}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
        >
          <DropdownMenu.Item onClick={() => handleSignal("scam")}>Scam</DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => handleSignal("trustworthy")}>Trustworthy</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SignalDropdown;