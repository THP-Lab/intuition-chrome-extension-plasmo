import React, { useState, useEffect } from "react"
import { usePinPersonMutation } from "~src/graphql/src"
import { Button } from "~src/components/ui/button"
import { useStorage } from "@plasmohq/storage/hook";
import { parseEther } from 'viem';
import { Multivault } from '@0xintuition/protocol'
import { getClients } from '../lib/viemClient';
import { MULTIVAULT_CONTRACT_ADDRESS } from "../lib/config"
import { useQueryClient } from "@tanstack/react-query"



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
  onCancel?: () => void 
}

// Reusable form to create or update a person
const SignUpForm = ({ defaultValues, onSuccess, onCancel }: Props) => {
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
  const { mutateAsync: pinPerson, isPending } = usePinPersonMutation()

  // Handle input changes and update local state
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }


  const queryClient = useQueryClient()



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
          email: form.email || null,
          identifier: address || null,
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

      await queryClient.invalidateQueries({ queryKey: ["GetPersonsByIdentifier"] })

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
    <div className="relative">
      {onCancel && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-[-7px] top-[-55px]"
          onClick={onCancel}
        >
          <svg 
            width="30" 
            height="30" 
            viewBox="0 0 15 15" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-muted-foreground hover:text-foreground"
          >
            <path 
              d="M0.877075 7.49988C0.877075 3.84219 3.84222 0.877045 7.49991 0.877045C11.1576 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1576 14.1227 7.49991 14.1227C3.84222 14.1227 0.877075 11.1575 0.877075 7.49988ZM7.49991 1.82704C4.36689 1.82704 1.82708 4.36686 1.82708 7.49988C1.82708 10.6329 4.36689 13.1727 7.49991 13.1727C10.6329 13.1727 13.1727 10.6329 13.1727 7.49988C13.1727 4.36686 10.6329 1.82704 7.49991 1.82704ZM9.85358 5.14644C10.0488 5.3417 10.0488 5.65829 9.85358 5.85355L8.20713 7.49999L9.85358 9.14644C10.0488 9.3417 10.0488 9.65829 9.85358 9.85355C9.65832 10.0488 9.34173 10.0488 9.14647 9.85355L7.50002 8.2071L5.85358 9.85355C5.65832 10.0488 5.34173 10.0488 5.14647 9.85355C4.95121 9.65829 4.95121 9.3417 5.14647 9.14644L6.79292 7.49999L5.14647 5.85355C4.95121 5.65829 4.95121 5.3417 5.14647 5.14644C5.34173 4.95118 5.65832 4.95118 5.85358 5.14644L7.50002 6.79289L9.14647 5.14644C9.34173 4.95118 9.65832 4.95118 9.85358 5.14644Z" 
              fill="currentColor" 
              fillRule="evenodd" 
              clipRule="evenodd"
            />
          </svg>
        </Button>
      )}
    
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

     

      <Button 
        type="submit" 
        disabled={isPending}
        variant="successOutline"
        className="w-full" 
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            Submitting...
          </span>
        ) : (
          "Register"
        )}
      </Button>



      {progressMessage && <p className="text-green-600">{progressMessage}</p>}
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </form>
    </div>
  )
}

export default SignUpForm
