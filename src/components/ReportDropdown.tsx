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
    onSuccess: () => {/* popup success */},
    onError: () => {/* popup error */}
  })

  const shadowRoot = document.getElementById("plasmo-inline-example-unique-id")?.shadowRoot

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center p-1 rounded bg-white text-black border border-gray-300 hover:bg-gray-400"
          style={{ fontWeight: 500, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
        >
          Signal
          <span className="ml-3">
            <ChevronDown />
          </span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal container={shadowRoot}>
        <DropdownMenu.Content
          className="bg-white pt-3 rounded shadow-lg p-1 border border-gray-200 z-[9999]"
          sideOffset={4}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
        >
          <DropdownMenu.Item onClick={() => handleSignal("scam")}>
            <button
              className="w-full p-1  text-black hover:bg-gray-300"
            >
              Scam
            </button>
          </DropdownMenu.Item>
          <DropdownMenu.Item onClick={() => handleSignal("trustworthy")}>
            <button 
              className="w-full p-1 text-black hover:bg-gray-300"
            >
              Trustworthy
            </button>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default SignalDropdown;