// src/hooks/useCreateSingleTriple.ts
import { useCallback, useState } from "react";
import { getClients } from "../lib/viemClient";
import { createTripleStatement, getMultiVaultAddressFromChainId } from "@0xintuition/sdk";
import { MultiVaultAbi } from "@0xintuition/protocol";

type Hex32 = `0x${string}`;

type CreateTripleOpts = {
  /** Montant à déposer en wei. Si omis, on tentera de lire le coût via le contrat ; fallback 0n. */
  assets?: bigint;
  /** Attendre le receipt de la tx (par défaut false). */
  wait?: boolean;
};

export function useCreateSingleTriple() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [termId, setTermId] = useState<Hex32 | null>(null);

  /**
   * Crée un seul triple (v2) depuis des termIds (subject, predicate, object).
   * @param tripleInput [subjectId, predicateId, objectId] — chacun un bytes32 (Hex32)
   * @param opts        options { assets, wait }
   * @returns           { termId, txHash }
   */
  const createSingleTriple = useCallback(
    async (tripleInput: [Hex32, Hex32, Hex32], opts: CreateTripleOpts = {}) => {
      setIsLoading(true);
      setError(null);
      setTxHash(null);
      setTermId(null);

      try {
        const [subjectId, predicateId, objectId] = tripleInput;

        const { walletClient, publicClient } = await getClients();
        if (!walletClient || !publicClient) throw new Error("Wallet not connected");

        const chainId = publicClient.chain?.id;
        if (!chainId) throw new Error("Unknown chain id");

        const address = getMultiVaultAddressFromChainId(chainId);

        // Détermination du coût (assets) si non fourni
        let assets = opts.assets;
        if (assets === undefined) {
          try {
            // Si ta build expose getTripleCost() en lecture (selon ABI)
            const cost: any = await publicClient.readContract({
              address,
              abi: MultiVaultAbi,
              functionName: "getTripleCost", // si non dispo → catch
            });
            // cost peut être bigint ou tuple -> on tente d’en extraire un bigint
            assets = (Array.isArray(cost) ? (cost[0] as bigint) : (cost as bigint)) ?? 0n;
          } catch {
            assets = 0n; // fallback si la fn n'existe pas sur ta build
          }
        }

        // Appel SDK v2 — createTripleStatement attend des tableaux + value
        const data = await createTripleStatement(
          { walletClient, publicClient, address },
          {
            args: [[subjectId], [predicateId], [objectId], [assets]],
            value: assets,
          }
        );

        // Pattern de retour du SDK v2 :
        // { transactionHash, state: { termId, subjectId, predicateId, objectId } }
        const createdTermId = data.state.termId as Hex32;
        const hash = data.transactionHash as `0x${string}`;

        setTxHash(hash);
        setTermId(createdTermId);

        if (opts.wait) {
          await publicClient.waitForTransactionReceipt({ hash });
        }

        return { termId: createdTermId, txHash: hash };
      } catch (e: any) {
        const msg = e?.shortMessage || e?.message || "Erreur inconnue";
        setError(msg);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { createSingleTriple, isLoading, error, txHash, termId };
}
