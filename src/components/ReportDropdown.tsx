// src/components/ReportDropdown.tsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import React from "react";

// Icône chevron bas (SVG inline, pas besoin de dépendance)
const ChevronDown = () => (
  <svg width="16" height="16" fill="none">
    <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" />
  </svg>
);

const options = [
  { label: "Trustworthy", value: "trustworthy" },
  { label: "Scam", value: "scam" },
];

const ReportDropdown = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex items-center px-3 py-1 rounded bg-white text-black border border-gray-300 hover:bg-gray-100"
          style={{ fontWeight: 500, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
        >
          Report
          <span className="ml-1">
            <ChevronDown />
          </span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal container={null}>
        <DropdownMenu.Content
          className="bg-white rounded shadow-lg p-1 border border-gray-200"
          sideOffset={4}
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
        >
          {options.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              className="px-3 py-2 cursor-pointer rounded hover:bg-gray-100 text-black"
              onClick={e => e.stopPropagation()}
              onMouseDown={e => e.stopPropagation()}
            >
              {option.label}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default ReportDropdown;