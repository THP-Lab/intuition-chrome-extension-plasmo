import { useCallback, useState } from "react";
import { getClients } from "~src/lib/viemClient";
import { MultiVaultAbi } from "@0xintuition/protocol";
import { getMultiVaultAddressFromChainId } from "@0xintuition/sdk";

type Hex32 = `0x${string}`;
type Address = `0x${string}`;

/* -------- Mini-ABIs (reads légers) -------- */
const ABI_BONDING_CONFIG = [
  {
    type: "function",
    name: "bondingCurveConfig",
    stateMutability: "view",
    inputs: [],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "defaultCurveId", type: "uint256" },
        ],
      },
    ],
  },
] as const;

const ABI_PREVIEW_DEPOSIT = [
  {
    type: "function",
    name: "previewDeposit",
    stateMutability: "view",
    inputs: [
      { type: "bytes32", name: "termId" },
      { type: "uint256", name: "curveId" },
      { type: "uint256", name: "assets" },
    ],
    outputs: [{ type: "uint256", name: "shares" }],
  },
] as const;

const ABI_MIN_DEPOSIT_ASSETS = [
  {
    type: "function",
    name: "minDepositAssets",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;

const ABI_MIN_DEPOSIT = [
  {
    type: "function",
    name: "minDeposit",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint256" }],
  },
] as const;

/* -------- Helpers reads -------- */
async function getDefaultCurveId(publicClient: any, mvAddress: `0x${string}`): Promise<bigint> {
  try {
    const cfg: any = await publicClient.readContract({
      address: mvAddress,
      abi: ABI_BONDING_CONFIG,
      functionName: "bondingCurveConfig",
    });
    const d = (cfg?.defaultCurveId ?? (Array.isArray(cfg) ? cfg[0] : 1n)) as bigint;
    return d ?? 0n;
  } catch {
    return 0n;
  }
}

async function previewSharesREAD(
  publicClient: any,
  mvAddress: `0x${string}`,
  termId: Hex32,
  curveId: bigint,
  assets: bigint
): Promise<bigint> {
  const res = (await publicClient.readContract({
    address: mvAddress,
    abi: ABI_PREVIEW_DEPOSIT,
    functionName: "previewDeposit",
    args: [termId, curveId, assets],
  })) as bigint;
  return res;
}

/** Essaie de récupérer un minDeposit "global" (différentes variantes possibles selon la build) */
async function tryReadGeneralMin(publicClient: any, mvAddress: `0x${string}`): Promise<bigint> {
  try {
    const out = (await publicClient.readContract({
      address: mvAddress,
      abi: ABI_MIN_DEPOSIT_ASSETS,
      functionName: "minDepositAssets",
    })) as bigint;
    if (out && out > 0n) return out;
  } catch {}

  try {
    const out = (await publicClient.readContract({
      address: mvAddress,
      abi: ABI_MIN_DEPOSIT,
      functionName: "minDeposit",
    })) as bigint;
    if (out && out > 0n) return out;
  } catch {}

  // si non exposé → 0n
  return 0n;
}

/** Dernier recours: sonder un montant qui donne des shares > 0 */
async function probeMinimalAssets(
  publicClient: any,
  mvAddress: `0x${string}`,
  termId: Hex32,
  curveId: bigint
): Promise<bigint> {
  const probes = [10n ** 12n, 10n ** 14n, 10n ** 16n, 10n ** 17n, 10n ** 18n]; // 1e-6, 1e-4, 1e-2, 0.1, 1
  for (const p of probes) {
    try {
      const s = await previewSharesREAD(publicClient, mvAddress, termId, curveId, p);
      if (s > 0n) return p;
    } catch {
      // continue
    }
  }
  return 0n;
}

/* -------- Hook -------- */
export function useCreatePosition() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createPosition = useCallback(
    async (termId: Hex32) => {
      setIsSubmitting(true);
      setTxHash(null);
      setError(null);

      try {
        if (!termId || termId.length !== 66 || !termId.startsWith("0x")) {
          throw new Error(`Invalid termId: expected bytes32, got "${termId}"`);
        }

        const { walletClient, publicClient } = await getClients();
        if (!walletClient || !publicClient) throw new Error("Wallet not connected");

        const caller = walletClient.account?.address as Address;
        if (!caller) throw new Error("No wallet account");

        const chainId = publicClient.chain?.id;
        if (!chainId) throw new Error("Unknown chain id");

        const mvAddress = getMultiVaultAddressFromChainId(chainId);
        const receiver = caller as Address;

        // 1) Déterminer la courbe
        const defaultCurveId = await getDefaultCurveId(publicClient, mvAddress);
        let curveId = defaultCurveId;

        // 2) Heuristique: vault non-initialisé sur la default curve ?
        let looksNewOnDefault = false;
        try {
          const tinyProbe = 10n ** 14n; // 0.0001
          await previewSharesREAD(publicClient, mvAddress, termId, curveId, tinyProbe);
        } catch {
          looksNewOnDefault = true;
        }
        if (looksNewOnDefault && curveId === defaultCurveId) {
          // Ici deux options : bloquer, ou basculer en non-default. On bloque explicitement (message clair).
          throw new Error(
            "This triple/atom is not initialized on the default curve. Initialize it via createAtoms/createTriples, or use a non-default curve."
          );
          // Si tu préfères basculer automatiquement :
          // curveId = defaultCurveId + 1n;
        }

        // 3) Déterminer assets minimal
        // (a) min par term si ta build l'expose (laisse 0n sinon)
        // const termMin = await readTermMin(...); // non dispo ici
        const termMin = 0n;

        // (b) min "global"
        let assets = termMin || (await tryReadGeneralMin(publicClient, mvAddress));

        // (c) fallback: probe via previewDeposit
        if (assets === 0n) {
          assets = await probeMinimalAssets(publicClient, mvAddress, termId, curveId);
        }

        if (!assets || assets === 0n) {
          throw new Error(
            "Unable to determine minimal deposit. Contract does not expose minDeposit and preview failed."
          );
        }

        // 4) Balance check (natif requis car deposit est payable)
        const bal = await publicClient.getBalance({ address: caller });
        if (bal < assets) throw new Error("Insufficient balance for minimal deposit");

        // 5) minShares (slippage par défaut 1%)
        let minShares = 0n;
        try {
          const shares = await previewSharesREAD(publicClient, mvAddress, termId, curveId, assets);
          if (shares === 0n) {
            throw new Error("previewDeposit returned 0 shares at minimal assets");
          }
          const slipBps = 100; // 1%
          const slip = BigInt(10_000 - slipBps);
          minShares = (shares * slip) / 10_000n;
        } catch {
          // si preview indisponible → laisse 0n
          minShares = 0n;
        }

        // 6) simulate + write (avec MultiVaultAbi)
        await publicClient.simulateContract({
          address: mvAddress,
          abi: MultiVaultAbi,
          functionName: "deposit",
          account: caller,
          args: [receiver, termId, curveId, minShares],
          value: assets, // payable
        });

        const hash = await walletClient.writeContract({
          address: mvAddress,
          abi: MultiVaultAbi,
          functionName: "deposit",
          account: caller,
          args: [receiver, termId, curveId, minShares],
          value: assets, // payable
        });

        setTxHash(hash);
        return hash;
      } catch (err: any) {
        const msg = err?.shortMessage || err?.message || "Transaction failed";
        setError(msg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return {
    createPosition,
    isSubmitting,
    txHash,
    error,
    reset() {
      setIsSubmitting(false);
      setTxHash(null);
      setError(null);
    },
  };
}
