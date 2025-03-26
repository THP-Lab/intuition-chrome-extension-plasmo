import React, { useState, useEffect } from "react"
import { usePinPersonMutation } from "~src/graphql/src"
import { Button } from "~src/components/ui/button"
import { useStorage } from "@plasmohq/storage/hook";
import { parseEther } from 'viem';
import { Multivault } from '@0xintuition/protocol'
import { getClients } from '../lib/viemClient';

// Props for the reusable form component
type Props = {
  defaultValues?: {
    name: string
    description?: string
    image?: string
    url?: string
    email?: string
    identifier: string
  }
  onSuccess?: () => void // Optional callback after successful submit
}

// Reusable form to create or update a person
const SignUpForm = ({ defaultValues, onSuccess }: Props) => {
  // Local state to hold form inputs
 
  const [address] = useStorage<string>("metamask-account")
  const [progressMessage, setProgressMessage] = useState<string | null>(null) 
  const [errorMessage, setErrorMessage] = useState<string | null>(null) 

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    url: "",
    email: "",
    identifier: ""
  })

  // When defaultValues are provided, fill the form with them
  useEffect(() => {
    if (defaultValues) {
      setForm({
        name: defaultValues.name || "",
        description: defaultValues.description || "",
        image: defaultValues.image || "",
        url: defaultValues.url || "",
        email: defaultValues.email || "",
        identifier: defaultValues.identifier || address || "" 
      })
    }else if (address) {
      setForm((prev) => ({ ...prev, identifier: address })) 
    }

  }, [defaultValues, address])

  // GraphQL mutation to pin (register) the person
  const { mutateAsync: pinPerson } = usePinPersonMutation()

  // Handle input changes and update local state
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // When the user submits the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent the page from reloading

    // Make sure "name" is not empty (it's required)
    if (!form.name.trim()) {
      alert("Name is required!")
      return
    }

    try {

      setProgressMessage("Pinning metadata...") 
      setErrorMessage(null) 

      const { walletClient, publicClient } = await getClients()      
      const multivault = new Multivault({ walletClient, publicClient }) 


      // Run the mutation with the form values
      const result = await pinPerson({
    
          name: form.name,
          description: form.description || null,
          image: form.image || null,
          url: form.url || null,
          email: form.email || null
        
      })

      const uri = result?.pinPerson?.uri
      if (!uri) throw new Error("Failed to pin person metadata.")

        
      setProgressMessage(`Metadata pinned! URI: ${uri}`) 

      const deposit = parseEther("0.000025")

      const { vaultId, hash } = await multivault.createAtom({ 
        uri,
        initialDeposit: deposit,
        wait: true
      })

      setProgressMessage(`Success! Vault ID: ${vaultId}, Tx: ${hash}`) 

    

      // Reset form if we're in "create" mode (not editing)
      if (!defaultValues) {
        setForm({ name: "", description: "", image: "", url: "", email: "",  identifier: address || "" })
      }

      // If parent component gave us a callback, call it
      onSuccess?.()
    } catch (err: any) {
      // Show error in the console if something goes wrong
      console.error("Error:", err)
      setErrorMessage(err.message || "An error occurred.") 
    }
  }

  return (
    
    <form onSubmit={handleSubmit} className="space-y-4">
     
      <div>
        <label>Name:</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </div>

      
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

    
      <div>
        <label>Image URL:</label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      
      <div>
        <label>Profile URL:</label>
        <input
          name="url"
          value={form.url}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

     
      <Button type="submit">Register</Button>


      {progressMessage && <p className="text-green-600">{progressMessage}</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </form>
  )
}

export default SignUpForm
