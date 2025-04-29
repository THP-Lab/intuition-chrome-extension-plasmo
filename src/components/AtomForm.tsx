import { usePinThingMutation } from "@0xintuition/graphql"
import { Multivault } from "@0xintuition/protocol"
import { parseEther } from "viem"

import { getClients } from "../lib/viemClient"
import { LinkTypeSelector } from "./LinkTypeSelector"
import React, { forwardRef, useEffect, useState, useRef, useImperativeHandle } from "react"
import { umamiCollect } from "~src/lib/umami"

interface AtomFormProps {
  onCreated: (atom: Atom) => void;
  initialName?: string;
  initialDescription?: string;
  initialImage?: string;
  initialUrl?: string;
}

const AtomForm = forwardRef<HTMLFormElement, AtomFormProps>(({ onCreated, initialName = "", initialDescription = "", initialImage = "", initialUrl = "" }, ref) => {
  const { mutateAsync: pinThing } = usePinThingMutation()

  const [name, setName] = useState(initialName ?? "")
  const [description, setDescription] = useState(initialDescription ?? "")
  const [image, setImage] = useState(initialImage ?? "")
  const [url, setUrl] = useState(initialUrl ?? "")
  
  const [rawUrl] = useState(initialUrl ?? "")

  const [progressMessage, setProgressMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [linkType, setLinkType] = useState<"url" | "domain">("url")
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null)
  const [initialUrlCaptured, setInitialUrlCaptured] = useState(false)
  

  useImperativeHandle(ref, () => ({
    resetForm() {
      setName("")
      setDescription("")
      setImage("")
      setRawUrl("")
      setUrl("")
      setProgressMessage(null)
      setErrorMessage(null)
      setIsSubmitting(false)
      descriptionRef.current?.style.setProperty("height", "auto")
    }
  }))

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = e.target.scrollHeight + "px"
  }
  
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto"
      descriptionRef.current.style.height = `${descriptionRef.current.scrollHeight}px`
    }
  }, [description])
  
  useEffect(() => {
    if (!rawUrl) return
    try {
      const parsed = new URL(rawUrl)
      const formatted = linkType === "url" ? parsed.href : parsed.hostname
      setUrl(formatted)
    } catch (err) {
      setUrl(rawUrl) 
    }
  }, [linkType, rawUrl])

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

      const deposit = await multivault.getAtomCost()

      const { vaultId, hash } = await multivault.createAtom({
        uri: ipfsUri,
        initialDeposit: deposit,
        wait: true
      })
      setProgressMessage(` Atom créé ! Vault ID: ${vaultId} | Tx: ${hash}`)
      
      const atom = {
        id: hash, // ou autre identifiant temporaire si hash ≠ id
        label: name,
        emoji: null,
        vault_id: vaultId.toString(),
      }
      onCreated(atom)

      umamiCollect("atom_created", "/sidepanel", {
        vaultId,
        txHash: hash
      }).catch(console.error)

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
          className="w-full p-2 bg-[hsl(var(--navbar-bg))] text-foreground rounded border border-border/10 relative z-10"
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block font-bold mb-1">
          Description
        </label>
        <textarea
          ref={descriptionRef}
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          className="w-full p-2 bg-[hsl(var(--navbar-bg))] text-foreground rounded border border-border/10 resize-none overflow-hidden relative z-10"
          rows={1}
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
          className="w-full p-2 bg-[hsl(var(--navbar-bg))] text-foreground rounded border border-border/10 relative z-10"
        />
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="Favicon preview"
              className="w-10 h-10 rounded shadow"
            />
          </div>
        )}
      </div>

      <LinkTypeSelector linkType={linkType} setLinkType={setLinkType} />
      <input
        id="url"
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 bg-[hsl(var(--navbar-bg))] text-foreground rounded border border-border/10 relative z-10"
      />
      
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full px-4 py-2 text-foreground btn-atom-form-hover-effect rounded bg-[hsl(var(--btn-atom-form-bg))]">
        {isSubmitting ? "Submitting..." : "Create Atom"}
      </button>
      {progressMessage && (
        <p className="text-sm text-green-600">{progressMessage}</p>
      )}
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </form>
  )
})

export default AtomForm
