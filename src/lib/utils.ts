// ~src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toHex } from "viem";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Hex32 = `0x${string}`;

export function toBytes32(input: string | bigint): Hex32 {
  if (typeof input === "bigint") {
    return toHex(input, { size: 32 }) as Hex32;
  }
  const s = input.trim();

  if (s.startsWith("0x")) {
    const hex = `0x${s.slice(2).padStart(64, "0")}`;
    if (hex.length !== 66) throw new Error("termId hex invalid (must be 32 bytes)");
    return hex as Hex32;
  }

  if (/^\d+$/.test(s)) {
    return toHex(BigInt(s), { size: 32 }) as Hex32;
  }

  throw new Error("termId must be decimal string, bigint, or 0x-hex");
}


