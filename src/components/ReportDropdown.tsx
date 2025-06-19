// src/components/ReportDropdown.tsx
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

const options = [
  { label: "Trustworthy", value: "trustworthy" },
  { label: "Scam", value: "scam" },
];

export const ReportDropdown = ({
  onSelect,
  defaultValue = "trustworthy",
}: {
  onSelect?: (value: string) => void;
  defaultValue?: string;
}) => {
  const [selected, setSelected] = useState(defaultValue);

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect?.(value);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 border text-black">
          {options.find((o) => o.value === selected)?.label}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="bg-white rounded shadow p-1">
        {options.map((option) => (
          <DropdownMenu.Item
            key={option.value}
            onSelect={() => handleSelect(option.value)}
            className={`flex items-center px-2 py-1 cursor-pointer rounded hover:bg-gray-100 ${
              selected === option.value ? "font-bold" : ""
            }`}
          >
            {selected === option.value && (
              <CheckIcon className="mr-2 w-4 h-4 text-green-500" />
            )}
            {option.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default ReportDropdown;