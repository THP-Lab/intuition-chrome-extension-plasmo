import { useCreateSingleTriple } from "./useCreateSingleTriple" // ton hook
import { useCreatePosition } from "./useCreatePosition" // ton hook
import { usePinThingMutation } from "@0xintuition/graphql" // pour créer un atom
import { usePageMetadataContentScript as usePageMetadata } from "./usePageMetadataContentScript"
import { Multivault } from "@0xintuition/protocol"
import { getClients } from "../lib/viemClient"


export function useSignalProcess({ atoms, uri, onSuccess, onError }) {
  const { createSingleTriple } = useCreateSingleTriple()
  const { createPosition } = useCreatePosition()
  const { mutateAsync: pinThing } = usePinThingMutation()
  const pageMeta = usePageMetadata()

  const getAtomWithMostVotes = (atoms) => {
    if (!atoms.length) {
      console.log("[SignalProcess] Aucun atom existant trouvé pour cette URL.")
      return null
    }
    const best = atoms.reduce((mostVotedAtom, currentAtom) => {
      const currentVotes = (
        currentAtom.as_object_claims_aggregate?.nodes.length +
        currentAtom.as_subject_claims_aggregate?.nodes.length
      ) || 0
      const mostVotes = (
        mostVotedAtom.as_object_claims_aggregate?.nodes.length +
        mostVotedAtom.as_subject_claims_aggregate?.nodes.length
      ) || 0
      return currentVotes > mostVotes ? currentAtom : mostVotedAtom
    })
    console.log("[SignalProcess] Atom avec le plus de votes sélectionné :", best)
    return best
  }

  const getOrCreateAtom = async () => {
    let atom = getAtomWithMostVotes(atoms)
    if (!atom) {
      console.log("[SignalProcess] Création d'un nouvel atom avec les métadonnées :", pageMeta)
      try {
        const result = await pinThing({
          name: pageMeta.title || "Untitled",
          description: pageMeta.description || "",
          image: pageMeta.favicon || "",
          url: pageMeta.url || uri
        })
        console.log("[SignalProcess] Résultat de la mutation pinThing :", result)
        const ipfsUri = result?.pinThing?.uri
        if (!ipfsUri) {
          throw new Error("La mutation pinThing n'a pas retourné d'uri IPFS.")
        }

        const { walletClient, publicClient } = await getClients()
        const multivault = new Multivault({ walletClient, publicClient })
        const deposit = await multivault.getAtomCost()
        const { vaultId, hash } = await multivault.createAtom({
          uri: ipfsUri,
          initialDeposit: deposit,
          wait: true
        })
        atom = { id: vaultId.toString() }
        console.log("[SignalProcess] Nouvel atom créé sur la blockchain :", atom)
      } catch (err) {
        console.error("[SignalProcess] Erreur lors de la création de l'atom :", err)
        throw err
      }
    }
    return atom
  }

  const handleSignal = async (type: "scam" | "trustworthy") => {
    try {
      console.log("[SignalProcess] Début du process de signal :", type)
      let atom = await getOrCreateAtom()
      console.log("[SignalProcess] Atom utilisé pour le triple :", atom)

      const tripleInput: [bigint, bigint, bigint] = [
        BigInt(atom.id),
        877n,
        type === "scam" ? 1775n : 14n
      ]
      console.log("[SignalProcess] tripleInput :", tripleInput)

      const { vaultId } = await createSingleTriple(tripleInput)
      await createPosition({ vaultId })
      console.log("[SignalProcess] Position créée sur le vault :", vaultId)

      onSuccess?.()
    } catch (e) {
      console.error("[SignalProcess] Erreur dans handleSignal :", e)
      onError?.(e)
    }
  }

  return { handleSignal }
}