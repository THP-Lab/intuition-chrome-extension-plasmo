import { useCreateSingleTriple } from "./useCreateSingleTriple" // ton hook
import { useCreatePosition } from "./useCreatePosition" // ton hook
import { usePinThingMutation } from "@0xintuition/graphql" // pour créer un atom
import { usePageMetadataContentScript as usePageMetadata } from "./usePageMetadataContentScript"
import { EthMultiVault } from "@0xintuition/protocol"
import { getClients } from "../lib/viemClient"


export function useSignalProcess({ atoms, uri, onSuccess, onError }) {
  const { createSingleTriple } = useCreateSingleTriple()
  const { createPosition } = useCreatePosition()
  const { mutateAsync: pinThing } = usePinThingMutation()
  const pageMeta = usePageMetadata()

  const getAtomWithMostVotes = (atoms) => {
    if (!atoms.length) {
      console.log("[SignalProcess] No existing atom found for this URL.")
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
    console.log("[SignalProcess] Atom with the most votes selected:", best)
    return best
  }

  const getOrCreateAtom = async () => {
    let atom = getAtomWithMostVotes(atoms)
    if (!atom) {
      console.log("[SignalProcess] Creating a new atom with metadata:", pageMeta)
      try {
        const result = await pinThing({
          name: pageMeta.title || "Untitled",
          description: pageMeta.description || "",
          image: pageMeta.favicon || "",
          url: pageMeta.url || uri
        })
        console.log("[SignalProcess] pinThing mutation result:", result)
        const ipfsUri = result?.pinThing?.uri
        if (!ipfsUri) {
          throw new Error("pinThing mutation did not return an IPFS uri.")
        }

        const { walletClient, publicClient } = await getClients()
        const multivault = new EthMultiVault({ walletClient, publicClient })
        const deposit = await multivault.getAtomCost()
        const { vaultId, hash } = await multivault.createAtom({
          uri: ipfsUri,
          initialDeposit: deposit,
          wait: true
        })
        atom = { id: vaultId.toString() }
        console.log("[SignalProcess] New atom created on the blockchain:", atom)
      } catch (err) {
        console.error("[SignalProcess] Error while creating atom:", err)
        throw err
      }
    }
    return atom
  }

  const handleSignal = async (type: "scam" | "trustworthy") => {
    try {
      console.log("[SignalProcess] Starting signal process:", type)
      let atom = await getOrCreateAtom()
      console.log("[SignalProcess] Atom used for triple:", atom)

      const tripleInput: [bigint, bigint, bigint] = [
        BigInt(atom.term_id),
        877n,
        type === "scam" ? 1775n : 14n
      ]
      console.log("[SignalProcess] tripleInput:", tripleInput)

      const { vaultId } = await createSingleTriple(tripleInput)
      await createPosition({ vaultId })
      console.log("[SignalProcess] Position created on vault:", vaultId)

      onSuccess?.()
    } catch (e) {
      console.error("[SignalProcess] Error in handleSignal:", e)
      onError?.(e)
    }
  }

  return { handleSignal }
}