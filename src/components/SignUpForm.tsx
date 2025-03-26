import React, { useState, useEffect } from "react"
import { usePinPersonMutation } from "~src/graphql/src"
import { Button } from "~src/components/ui/button"
import { useStorage } from "@plasmohq/storage/hook";

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
        identifier: address || ""
      })
    }
  }, [defaultValues])

  // GraphQL mutation to pin (register) the person
  const { mutate: pinPerson, data, isPending, error } = usePinPersonMutation()

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
      // Run the mutation with the form values
      await pinPerson({
    
          name: form.name,
          description: form.description || null,
          image: form.image || null,
          url: form.url || null,
          email: form.email || null
        
      })

      // Show success message
      alert("Person pinned successfully!")

      // Reset form if we're in "create" mode (not editing)
      if (!defaultValues) {
        setForm({ name: "", description: "", image: "", url: "", email: "",  identifier: "" })
      }

      // If parent component gave us a callback, call it
      onSuccess?.()
    } catch (err) {
      // Show error in the console if something goes wrong
      console.error("Error pinning person:", err)
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

     
      <Button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Register"}
      </Button>


      {data?.pinPerson?.uri && (
        <p>Registered at URI: {data.pinPerson.uri}</p>
      )},
      {error ? <p className="text-red-500"> Error</p> : ""}
    </form>
  )
}

export default SignUpForm
