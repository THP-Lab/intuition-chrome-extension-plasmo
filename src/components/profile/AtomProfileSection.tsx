import { useState } from "react"
import { useGetPersonsByIdentifierQuery } from "~src/graphql/src"
import { useStorage } from "@plasmohq/storage/hook"
import SignUpForm from "../SignUpForm"
import { cn } from "~src/lib/utils"

const AtomProfileSection = () => {
  const [editMode, setEditMode] = useState(false)
  const [address] = useStorage<string>("metamask-account")

  const { data } = useGetPersonsByIdentifierQuery(
    { identifier: address || "" },
    { enabled: !!address }
  )
  const person = data?.persons?.[0]

  return (
    <section className={cn(
      "border rounded-lg p-4",
      "bg-background text-foreground",
      "shadow-sm hover:shadow-md transition-shadow"
    )}>
      <h2 className="text-xl font-semibold mb-4">Your Atom Profile</h2>

      {!person || editMode ? (
        <SignUpForm
          defaultValues={
            person
              ? {
                  name: person.name || "",
                  image: person.image || "",
                  description: person.description || "",
                  url: person.url || "",
                  email: person.email || "",
                  identifier: person.identifier || address || ""
                }
              : undefined
          }
          onSuccess={() => setEditMode(false)} 
        />
      ) : (
        <>
          
          <div className="space-y-2">
            <p><strong>Name:</strong> {person.name}</p>
            {person.description && <p><strong>Description:</strong> {person.description}</p>}
            {person.email && <p><strong>Email:</strong> {person.email}</p>}
            {person.url && <p><strong>URL:</strong> {person.url}</p>}
            {person.image && (
              <img
                src={person.image}
                alt="Profile"
                className="w-24 h-24 rounded-md object-cover border border-border"
              />
            )}
          </div>

      
          <button
            className={cn(
              "w-full mt-4 px-4 py-2 bg-background text-foreground hover:bg-accent hover:text-accent-foreground rounded"
            )}
            onClick={() => setEditMode(true)}
          >
            Edit Atom Profile
          </button>
        </>
      )}
    </section>
  )
}

export default AtomProfileSection
