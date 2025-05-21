import React from "react";

type Props = {
    person: any
  }
  
  const AtomProfileSection = ({ person }: Props) => {
    return (
      <section className="border rounded-lg p-4 bg-background text-foreground shadow-sm hover:shadow-md transition-shadow">
        <h2 className="text-xl font-semibold mb-4">Your Atom Profile</h2>
        <div className="space-y-2">
          <p><strong>Name:</strong> {person?.name || "Unnamed"}</p>
          {person.description && <p><strong>Description:</strong> {person.description}</p>}
          {person.email && <p><strong>Email:</strong> {person.email}</p>}
          {person.url && <p><strong>URL:</strong> <a href={person.url} target="_blank" rel="noopener noreferrer">{person.url}</a></p>}
          {person.image && (
            <img
              src={person.image}
              alt="Profile"
              className="w-24 h-24 rounded-md object-cover border border-border"
            />
          )}
        </div>
      </section>
    )
  }
  
  export default AtomProfileSection
  