import React, { useState } from "react"
import { usePinPersonMutation } from "~src/graphql/src" 
import { Button } from "~src/components/ui/button"

const SignUpForm = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    url: ""
  })

  const { mutate: pinPerson, data, loading, error } = usePinPersonMutation()


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await pinPerson({
        variables: {
          name: form.name,
          description: form.description || null,
          image: form.image || null,
          url: form.url || null
        }
      })
      alert("Person pinned successfully!")
      setForm({ name: "", description: "", image: "", url: "" })
    } catch (err) {
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

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Register"}
      </Button>

      {data?.pinPerson?.uri && <p> Registered at URI: {data.pinPerson.uri}</p>}
      {error && <p className="text-red-500">Error: {error.message}</p>}
    </form>
  )
}

export default SignUpForm
