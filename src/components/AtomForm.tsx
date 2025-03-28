import { usePinThingMutation } from "@0xintuition/graphql"
import { Multivault } from "@0xintuition/protocol"
import React, { useState } from "react"
import { parseEther } from "viem"

import { getClients } from "../lib/viemClient"

const AtomForm: React.FC = () => {
  const { mutateAsync: pinThing } = usePinThingMutation()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")

  const [progressMessage, setProgressMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setProgressMessage("Pinning Atom metadata...")
    setErrorMessage(null)

    try {
      const { walletClient, publicClient } = await getClients()

      const multivault = new Multivault({ walletClient, publicClient })

      const result = await pinThing({
        name,
        description,
        image,
        url
      })

      if (!result.pinThing?.uri) {
        throw new Error("Failed to pin atom metadata.")
      }
      setProgressMessage(`Atom pinned! URI: ${result.pinThing.uri}`)

      const ipfsUri = result.pinThing.uri

      const atomCost = await multivault.getAtomCost()
      const deposit = parseEther("0.000025")

      const { vaultId, hash } = await multivault.createAtom({
        uri: ipfsUri,
        initialDeposit: deposit,
        wait: true
      })
      setProgressMessage(` Atom créé ! Vault ID: ${vaultId} | Tx: ${hash}`)
    } catch (error: any) {
      console.error(error)
      setErrorMessage(error.message || "An error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-background rounded">
      <div>
        <label htmlFor="name" className="font-bold mb-1">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block font-bold mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="image" className="block font-bold mb-1">
          Image URL
        </label>
        <input
          id="image"
          type="url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label htmlFor="url" className="block font-bold mb-1">
          URL
        </label>
        <input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-4 py-2 bg-background text-foreground hover:bg-accent hover:text-accent-foreground rounded">
        {isSubmitting ? "Submitting..." : "Create Atom"}
      </button>
      {progressMessage && (
        <p className="text-sm text-green-600">{progressMessage}</p>
      )}
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </form>
  )
}

export default AtomForm
