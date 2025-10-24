import { useCallback, useState } from "react";
import { getClients } from "~src/lib/viemClient";
import { MultiVaultAbi } from "@0xintuition/protocol";
import { getMultiVaultAddressFromChainId } from "@0xintuition/sdk";

type Hex32 = `0x${string}`;
type Address = `0x${string}`;

type CreatePositionOpts = {
  /** Montant déposé (assets, en wei). Si omis, on tente minDeposit, sinon 0n. */
  assets?: bigint;
  /** Curve ID (défaut 0n si tu utilises la courbe par défaut) */
  curveId?: bigint;
  /** Slippage en basis points (ex: 100 = 1%). Si défini, on calcule minShares via previewDeposit. */
  slippageBps?: number;
  /** Receiver des parts (défaut: caller) */
  receiver?: Address;
  /** Attendre le receipt */
  wait?: boolean;
};

export function useCreatePosition() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Crée/augmente une position sur un ATOM/TRIPLE (v2: term).
   * @param termId  bytes32 (0x… 32 bytes) de l'atom/triple
   * @param opts    options de dépôt (assets, curveId, slippageBps, receiver, wait)
   */
  const createPosition = useCallback(
    async (termId: Hex32, opts: CreatePositionOpts = {}) => {
      setIsSubmitting(true);
      setTxHash(null);
      setError(null);

      try {
        const { walletClient, publicClient } = await getClients();
        if (!walletClient || !publicClient) throw new Error("Wallet not connected");
        const caller = walletClient.account?.address as Address;
        if (!caller) throw new Error("No wallet account");

        const chainId = publicClient.chain?.id;
        if (!chainId) throw new Error("Unknown chain id");
        const mvAddress = getMultiVaultAddressFromChainId(chainId);

        const receiver = (opts.receiver ?? caller) as Address;
        const curveId = opts.curveId ?? 0n;

        // Déterminer le montant (assets)
        let assets = opts.assets;
        if (assets === undefined) {
          // Essaie de lire generalConfig.minDeposit ; fallback 0n si ABI diffère
          try {
            const generalConfig: any = await publicClient.readContract({
              address: mvAddress,
              abi: MultiVaultAbi,
              functionName: "generalConfig",
            });
            assets =
              generalConfig?.minDeposit ??
              (Array.isArray(generalConfig) ? (generalConfig[4] as bigint | undefined) : undefined) ??
              0n;
          } catch {
            assets = 0n;
          }
        }

        // Vérif solde natif si assets > 0
        if (assets > 0n) {
          const bal = await publicClient.getBalance({ address: caller });
          if (bal < assets) throw new Error("Insufficient balance");
        }

        // Calcul minShares (slippage) via previewDeposit si dispo
        let minShares = 0n;
        if (opts.slippageBps !== undefined && assets > 0n) {
          try {
            // Beaucoup de builds exposent previewDeposit(termId, curveId, assets)
            const preview: any = await publicClient.readContract({
              address: mvAddress,
              abi: MultiVaultAbi,
              functionName: "previewDeposit",
              args: [termId, curveId, assets],
            });
            // preview peut renvoyer [shares, ...] ou directement shares
            const shares: bigint =
              Array.isArray(preview) ? (preview[0] as bigint) : (preview as bigint);
            const slip = BigInt(Math.max(0, 10_000 - opts.slippageBps)); // e.g., 9900 for 1%
            minShares = (shares * slip) / 10_000n;
          } catch {
            // Si la fn n'existe pas sur ta build → on laisse minShares = 0n
            minShares = 0n;
          }
        }

        // Simulate
        await publicClient.simulateContract({
          address: mvAddress,
          abi: MultiVaultAbi,
          functionName: "deposit",
          account: caller,
          args: [receiver, termId, curveId, minShares],
          value: assets,
        });

        // Write
        const hash = await walletClient.writeContract({
          address: mvAddress,
          abi: MultiVaultAbi,
          functionName: "deposit",
          account: caller,
          args: [receiver, termId, curveId, minShares],
          value: assets,
        });

        setTxHash(hash);

        if (opts.wait) {
          await publicClient.waitForTransactionReceipt({ hash });
        }

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
