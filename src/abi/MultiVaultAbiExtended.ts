// ~src/abi/MultiVaultAbiExtended.ts
import { MultiVaultAbi } from "@0xintuition/protocol";

export const MultiVaultAbiExtended = [
  ...MultiVaultAbi,
  // ajoute les erreurs usuelles (noms à adapter si besoin)
  { type: "error", name: "MinDepositNotMet", inputs: [{ name: "required", type: "uint256" }] },
  { type: "error", name: "CurveNotFound", inputs: [{ name: "curveId", type: "uint256" }] },
  { type: "error", name: "InvalidCurve", inputs: [{ name: "curveId", type: "uint256" }] },
  { type: "error", name: "StandardNotOpen", inputs: [{ name: "termId", type: "bytes32" }] },
  { type: "error", name: "VaultClosed", inputs: [{ name: "termId", type: "bytes32" }] },
  { type: "error", name: "TermNotFound", inputs: [{ name: "termId", type: "bytes32" }] },
] as const;
