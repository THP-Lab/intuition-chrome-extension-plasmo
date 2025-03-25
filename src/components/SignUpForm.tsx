import React, { useState } from "react"
import { usePinPersonMutation } from "~src/graphql/src" // GraphQL mutation hook
import { Button } from "~src/components/ui/button"       // Custom UI button component

// A simple signup form component used to "pin" a person (e.g. register them on the platform)
const SignUpForm = () => {
  // Local form state to handle input values
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    url: ""
  })

  // GraphQL mutation hook to pin a person
  const { mutate: pinPerson, data, loading, error } = usePinPersonMutation()

  // Handles input changes (text inputs or textareas)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  // Submits the form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevents page reload on form submit

    try {
      // Calls the mutation with form values
      await pinPerson({
        variables: {
          name: form.name,
          description: form.description || null,
          image: form.image || null,
          url: form.url || null
        }
      })

      // Show success feedback
      alert("Person pinned successfully!")

      // Reset form to empty values
      setForm({ name: "", description: "", image: "", url: "" })
    } catch (err) {
      // If the mutation fails, log the error
      console.error("Error pinning person:", err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name input */}
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

      {/* Description input */}
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      {/* Image URL input */}
      <div>
        <label>Image URL:</label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      {/* Profile URL input */}
      <div>
        <label>Profile URL:</label>
        <input
          name="url"
          value={form.url}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </div>

      {/* Submit button */}
      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Register"}
      </Button>

      {/* Feedback messages */}
      {data?.pinPerson?.uri && <p>Registered at URI: {data.pinPerson.uri}</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </form>
  )
}

export default SignUpForm
