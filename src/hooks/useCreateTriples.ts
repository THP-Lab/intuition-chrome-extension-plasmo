// src/hooks/useCreateTriples.ts
import { useState, useCallback } from "react";
import { getClients } from "../lib/viemClient";
import {
  batchCreateTripleStatements,
  getMultiVaultAddressFromChainId,
} from "@0xintuition/sdk";
import { MultiVaultAbi } from "@0xintuition/protocol";
import { parseEventLogs } from "viem";

type Hex32 = `0x${string}`;
export type TripleInput = [Hex32, Hex32, Hex32];

type CreateTriplesOpts = {
  /** Montant (assets) par triple, en wei. Si absent, on tente getTripleCost(); sinon 0n. */
  assetsPerTriple?: bigint;
  /** Attendre le receipt. */
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

      try {
        const { walletClient, publicClient } = await getClients();
        if (!walletClient || !publicClient) throw new Error("Wallet not connected");

        if (triples.length === 0) throw new Error("No triples to create");

        const chainId = publicClient.chain?.id;
        if (!chainId) throw new Error("Unknown chain id");

        const address = getMultiVaultAddressFromChainId(chainId);

        // 1) Déterminer le coût par triple
        let assetsPerTriple = opts.assetsPerTriple;
        if (assetsPerTriple === undefined) {
          try {
            // Selon la build, getTripleCost peut exister, sinon ça throw → fallback 0n
            const maybeCost: any = await publicClient.readContract({
              address,
              abi: MultiVaultAbi,
              functionName: "getTripleCost",
            });
            assetsPerTriple =
              (Array.isArray(maybeCost) ? (maybeCost[0] as bigint) : (maybeCost as bigint)) ??
              0n;
          } catch {
            assetsPerTriple = 0n;
          }
        }

        const totalCost = assetsPerTriple * BigInt(triples.length);

        // 2) Décomposer S/P/O
        const subjectIds = triples.map(([s]) => s);
        const predicateIds = triples.map(([, p]) => p);
        const objectIds = triples.map(([, , o]) => o);
        const assetsArr = triples.map(() => assetsPerTriple!);

        // 3) Appel SDK (batchCreateTripleStatements)
        const data = await batchCreateTripleStatements(
          { walletClient, publicClient, address },
          {
            args: [subjectIds, predicateIds, objectIds, assetsArr],
            value: totalCost,
          }
        );

        // Le SDK renvoie { transactionHash, ... }
        const hash = data.transactionHash as `0x${string}`;
        setTxHash(hash);

        // 4) Receipt + parsing des events TripleCreated (termId)
        const rcpt = await publicClient.waitForTransactionReceipt({ hash });
        setReceipt(rcpt);

        if (rcpt.status === "reverted") {
          throw new Error("Triple creation tx reverted");
        }

        const parsed = parseEventLogs({
          abi: MultiVaultAbi,
          logs: rcpt.logs,
          eventName: "TripleCreated",
          strict: false, // tolère les autres logs
        });

        const createdTermIds = parsed
          .map((e) => e.args?.termId as Hex32 | undefined)
          .filter((x): x is Hex32 => !!x);

        if (createdTermIds.length !== triples.length) {
          // Certaines implémentations émettent 1 event par triple; si ce n'est pas le cas,
          // tu peux aussi récupérer l'array renvoyée par la fonction si elle l’expose.
          console.warn(
            `Mismatch between events (${createdTermIds.length}) and input triples (${triples.length})`
          );
        }

        setTermIds(createdTermIds);

        if (opts.wait) {
          // (on a déjà attendu le receipt ci-dessus)
        }

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
    // Laisser React appliquer le setState avant d'appeler createTriples
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
