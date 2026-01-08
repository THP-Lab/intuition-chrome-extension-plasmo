// src/hooks/useSignalProcess.ts
import { useCreateSingleTriple } from "./useCreateSingleTriple";
import { useDepositTerm } from "./useDepositTerm";
import { usePinThingMutation } from "@0xintuition/graphql";
import { usePageMetadataContentScript as usePageMetadata } from "./usePageMetadataContentScript";

import { getClients } from "../lib/viemClient";
import { createAtomFromThing, getMultiVaultAddressFromChainId } from "@0xintuition/sdk";

type Hex32 = `0x${string}`;

type SignalIds = {
  /** Predicate term_id pour "IS" (ou équivalent), bytes32 */
  predicateId: Hex32;
  /** Object term_id pour "SCAM", bytes32 */
  scamId: Hex32;
  /** Object term_id pour "TRUSTWORTHY", bytes32 */
  trustworthyId: Hex32;
};

type UseSignalProcessParams = {
  /** Liste d’atomes potentiellement déjà associés à l’URL courante (GraphQL v2) */
  atoms: Array<any>;
  /** URL de fallback si pageMeta ne renvoie pas d’URL */
  uri?: string;
  /** Callbacks */
  onSuccess?: () => void;
  onError?: (e: unknown) => void;
  /** IDs nécessaires côté v2 (predicate+objects) */
  ids: SignalIds;
};

export function useSignalProcess({ atoms, uri, onSuccess, onError, ids }: UseSignalProcessParams) {
  const { createSingleTriple } = useCreateSingleTriple();   // v2: prend des Hex32
  const { depositTerm } = useDepositTerm();           // v2: deposit(termId, ...)
  const { mutateAsync: pinThing } = usePinThingMutation();  // optionnel, conserve ta trace backend
  const pageMeta = usePageMetadata();

  /** Heuristique: sélectionne l’atome avec le plus de "votes" (selon tes agrégats) */
  const getAtomWithMostVotes = (atomsList: any[]) => {
    if (!atomsList?.length) return null;

    const countVotes = (a: any) => {
      // Essaie v2 (triples) puis fallback v1 (claims) si ton schéma est mixte
      const sTriples = a.as_subject_triples_aggregate?.aggregate?.count ?? a.as_subject_claims_aggregate?.nodes?.length ?? 0;
      const oTriples = a.as_object_triples_aggregate?.aggregate?.count ?? a.as_object_claims_aggregate?.nodes?.length ?? 0;
      return Number(sTriples) + Number(oTriples);
    };

    return atomsList.reduce((best, cur) => (countVotes(cur) > countVotes(best) ? cur : best), atomsList[0]);
  };

  /** Crée un atome on-chain si rien d’existant; sinon renvoie le meilleur candidat */
  const getOrCreateAtom = async (): Promise<{ term_id: Hex32 }> => {
    // 1) essaie de réutiliser
    const best = getAtomWithMostVotes(atoms);
    if (best?.term_id) {
      return { term_id: best.term_id as Hex32 };
    }

    // 2) crée un nouvel atome (pin côté backend + on-chain via SDK)
    const metaUrl = pageMeta.url || uri || "";
    const name = pageMeta.title || "Untitled";
    const description = pageMeta.description || "";
    const image = pageMeta.favicon || "";

    // Optionnel: garde ta mutation pinThing si tu veux garder une trace Côté GraphQL/analytics
    try {
      await pinThing({ name, description, image, url: metaUrl });
    } catch (e) {
      // non-bloquant pour la tx on-chain
      console.warn("[SignalProcess] pinThing failed (non-blocking):", e);
    }

    const { walletClient, publicClient, multivaultAddress } = await getClients();
    if (!walletClient || !publicClient) throw new Error("Wallet not connected");
    const chainId = publicClient.chain?.id;
    if (!chainId) throw new Error("Unknown chain id");

    const address = multivaultAddress as Hex32;

    const data = await createAtomFromThing(
      { walletClient, publicClient, address },
      { url: metaUrl, name, description, image }
    );

    const termIdHex = data.state.termId as Hex32;
    return { term_id: termIdHex };
  };

  /** type: "scam" | "trustworthy" → crée triple (atom — IS — [SCAM|TRUSTWORTHY]) puis dépose une position */
  const handleSignal = async (type: "scam" | "trustworthy") => {
    try {
      // 1) sujet = atome (exist. ou créé)
      const atom = await getOrCreateAtom();
      const subjectId = atom.term_id as Hex32;

      // 2) prédicat = ids.predicateId ; objet = ids.scamId / ids.trustworthyId
      const predicateId = ids.predicateId;
      const objectId = type === "scam" ? ids.scamId : ids.trustworthyId;

      // 3) crée le triple (SDK v2 → Hex32 partout)
      const { termId } = await createSingleTriple([subjectId, predicateId, objectId]);

      // 4) crée la position (dépôt sur le triple fraichement créé)
      await depositTerm(termId);
      onSuccess?.();
    } catch (e) {
      console.error("[SignalProcess] Error in handleSignal:", e);
      onError?.(e);
    }
  };

  return { handleSignal };
}
