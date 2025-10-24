import { useCallback, useState } from "react";
import { getClients } from "~src/lib/viemClient";
import { MultiVaultAbi } from "@0xintuition/protocol";
import { getMultiVaultAddressFromChainId } from "@0xintuition/sdk";

type Hex32 = `0x${string}`;
type Address = `0x${string}`;

type AtomPositionOpts = {
  /** Montant (assets) à déposer en wei. Si absent, on tente minDeposit, sinon 0n. */
  assets?: bigint;
  /** Curve ID (par défaut 0n si tu utilises la courbe par défaut) */
  curveId?: bigint;
  /** Protection de slippage : minShares (par défaut 0n) */
  minShares?: bigint;
  /** Receiver des parts (par défaut: l’adresse appelante) */
  receiver?: Address;
  /** Attendre le receipt (par défaut: false) */
  wait?: boolean;
};

export function useAtomPosition() {
  const [isVoting, setIsVoting] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Dépose sur un ATOM (v2: term) → crée/augmente une position.
   * @param termId  bytes32 (0x…32 bytes) de l'atom/triple (== term_id)
   * @param opts    options (assets, curveId, minShares, receiver, wait)
   * @returns       hash de transaction
   */
  const atomPosition = useCallback(
    async (termId: Hex32, opts: AtomPositionOpts = {}) => {
      setIsVoting(true);
      setTxHash(null);
      setError(null);

      try {
        const { walletClient, publicClient } = await getClients();
        if (!walletClient || !publicClient) {
          throw new Error("Wallet not connected");
        }
        const caller = walletClient.account?.address as Address;
        if (!caller) throw new Error("No wallet account");

        const chainId = publicClient.chain?.id;
        if (!chainId) throw new Error("Unknown chain id");

        // Adresse MultiVault selon la chaîne active
        const mvAddress = getMultiVaultAddressFromChainId(chainId);

        // Paramètres (avec défauts sûrs)
        const receiver = (opts.receiver ?? caller) as Address;
        const curveId = opts.curveId ?? 0n;
        const minShares = opts.minShares ?? 0n;

        // Déterminer le montant à déposer (assets)
        let assets = opts.assets;
        if (assets === undefined) {
          // Essaye de lire minDeposit depuis le contrat. Si échec → 0n.
          try {
            // Beaucoup de build exposent generalConfig() en lecture
            const generalConfig = await publicClient.readContract({
              address: mvAddress,
              abi: MultiVaultAbi,
              functionName: "generalConfig",
            });
            const minDeposit: bigint | undefined =
              Array.isArray(generalConfig) ? (generalConfig[4] as bigint | undefined) : undefined;

            assets = minDeposit ?? 0n;
          } catch {
            assets = 0n; // fallback si l’ABI diffère
          }
        }

        // Vérifie le solde natif si on envoie des assets > 0
        if (assets > 0n) {
          const balance = await publicClient.getBalance({ address: caller });
          if (balance < assets) {
            throw new Error("Insufficient balance");
          }
        }

        // Simulate (sécurité gas + validation)
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

        // Optionnel: attendre le receipt ici
        if (opts.wait) {
          await publicClient.waitForTransactionReceipt({ hash });
        }

        return hash;
      } catch (err: any) {
        const msg = err?.shortMessage || err?.message || "Transaction failed";
        setError(msg);
        throw err;
      } finally {
        setIsVoting(false);
      }
    },
    []
  );

  return {
    atomPosition,
    isVoting,
    txHash,
    error,
    /** helper pour reset l’état si besoin */
    reset() {
      setIsVoting(false);
      setTxHash(null);
      setError(null);
    },
  };
}
