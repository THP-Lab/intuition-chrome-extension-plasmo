// src/hooks/useCreateTriples.ts
import { useState, useCallback } from "react";
import { getClients } from "../lib/viemClient";
import { MultiVaultAbi } from "@0xintuition/protocol";
import { batchCreateTripleStatements } from "@0xintuition/sdk";
import { parseEventLogs } from "viem";

type Hex32 = `0x${string}`;
export type TripleInput = [Hex32, Hex32, Hex32];

type CreateTriplesOpts = {
  assetsPerTriple?: bigint;
  wait?: boolean;
};

export const useCreateTriples = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any>(null);
  const [termIds, setTermIds] = useState<Hex32[] | null>(null);
  const [triples, setTriples] = useState<TripleInput[]>([]);

  const addTriple = (triple: TripleInput) => setTriples((prev) => [...prev, triple]);
  const removeTriple = (index: number) =>
    setTriples((prev) => prev.filter((_, i) => i !== index));
  const clearTriples = () => setTriples([]);

  const createTriples = useCallback(
    async (opts: CreateTriplesOpts = {}) => {
      setIsLoading(true);
      setError(null);
      setTxHash(null);
      setReceipt(null);
      setTermIds(null);

      const inputTriples = [...triples];

      try {
        const { walletClient, publicClient, multivaultAddress } = await getClients();
        if (!walletClient || !publicClient) throw new Error("Wallet not connected");

        if (!Array.isArray(inputTriples) || inputTriples.length === 0) {
          throw new Error("No triples to create");
        }

        const address = multivaultAddress as Hex32;
        const account = walletClient.account.address;

        // Vérifier la balance
        const balance = await publicClient.getBalance({ address: account });

        // 1) Déterminer le coût par triple
        let assetsPerTriple = opts.assetsPerTriple;
        if (assetsPerTriple === undefined) {
          try {
            const maybeCost: any = await publicClient.readContract({
              address,
              abi: MultiVaultAbi,
              functionName: "getTripleCost",
            });
            assetsPerTriple =
              (Array.isArray(maybeCost) ? (maybeCost[0] as bigint) : (maybeCost as bigint)) ?? 0n;
          } catch (err) {
            console.error("Error getting triple cost:", err);
            assetsPerTriple = 0n;
          }
        }

        const totalCost = assetsPerTriple * BigInt(inputTriples.length);
        
        if (balance < totalCost) {
          throw new Error(`Insufficient balance. Need ${Number(totalCost) / 1e18} ETH but have ${Number(balance) / 1e18} ETH`);
        }

        // Transform TripleInput[] into the expected format
        const subjects: Hex32[] = inputTriples.map(([subject]) => subject);
        const predicates: Hex32[] = inputTriples.map(([, predicate]) => predicate);
        const objects: Hex32[] = inputTriples.map(([, , object]) => object);
        
        // amounts[] représente le montant à déposer dans chaque vault triple (FOR position)
        const amounts: bigint[] = inputTriples.map(() => assetsPerTriple);

        // batchCreateTripleStatements: (config, [subjects, predicates, objects, amounts], depositAmount)
        // amounts = montant à déposer dans chaque vault triple (le SDK ajoute automatiquement le coût de création)
        // depositAmount = montant extra optionnel (0n si amounts contient déjà tout ce qu'on veut déposer)
        const data = await batchCreateTripleStatements(
          { walletClient, publicClient, address },
          [subjects, predicates, objects, amounts],
          0n
        );

        const hash = data.transactionHash as `0x${string}`;
        if (!hash) throw new Error("SDK did not return a transaction hash");
        setTxHash(hash);

        // 4) Receipt
        const rcpt = await publicClient.waitForTransactionReceipt({ hash });
        setReceipt(rcpt);

        if (rcpt.status === "reverted") throw new Error("Triple creation tx reverted");

        // Extraire les termIds depuis data.state
        const createdTermIds = data.state.map(item => item.termId as Hex32);

        if (createdTermIds.length !== inputTriples.length) {
          console.warn(
            `Mismatch between events (${createdTermIds.length}) and input triples (${inputTriples.length})`
          );
        }

        setTermIds(createdTermIds);

        return { hash, termIds: createdTermIds, receipt: rcpt };
      } catch (err: any) {
        console.error(err);
        setError(err?.shortMessage || err?.message || "Unknown error");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [triples]
  );

  const createSingleTriple = async (triple: TripleInput, opts?: CreateTriplesOpts) => {
    addTriple(triple);
    await Promise.resolve();
    const result = await createTriples(opts);
    clearTriples();
    return result;
  };

  return {
    addTriple,
    removeTriple,
    clearTriples,
    createTriples,
    createSingleTriple,
    triples,
    isLoading,
    error,
    txHash,
    receipt,
    termIds,
  };
};
