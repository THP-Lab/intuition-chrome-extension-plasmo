import { Fingerprint, UserRound } from "lucide-react"
import React from "react"
import { Link } from "react-router-dom"
import Tags from "./Tags"

interface AtomDisplayProps {
  atom: {
    id: string
    label?: string | null
    image?: string | null
    value?: {
      thing?: {
        name?: string | null
        description?: string | null
        url?: string | null
      } | null
    } | null
    vault?: {
      position_count?: number | string | null
    } | null
  }
  tags?: string[]
  }

const AtomDisplay: React.FC<AtomDisplayProps> = ({ atom, tags }) => {
  const thing = atom.value?.thing

  return (
    <div className="border border-border-atom rounded-xl p-6 bg-background">
      <div className="flex items-center gap-4">
        {atom.image ? (
          <img
            src={atom.image}
            alt={atom.label ?? ""}
            className="w-16 h-16 object-cover rounded-md"
          />
        ) : (
          <div className="w-16 h-16 flex items-center justify-center rounded-md bg-muted text-muted-foreground">
            <Fingerprint className="w-8 h-8" />
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-xl font-bold mb-1">
            {atom.label ?? "Unnamed identity"}
          </h1>
          {thing?.name && (
            <p className="text-sm text-muted-foreground">{thing.name}</p>
          )}
        </div>

        {atom.vault?.position_count && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <UserRound className="w-4 h-4" />
            <span className="text-sm">{atom.vault.position_count}</span>
          </div>
        )}
      </div>

      {thing?.description && (
        <p className="mt-4 text-sm text-gray-400 whitespace-pre-wrap">
          {thing.description}
        </p>
      )}

      {thing?.url && (
        <Link
          to={thing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 underline mt-2 inline-block">
          {thing.url}
        </Link>
      )}

      <Tags tags={tags} />
    </div>
    )
  }

export default AtomDisplay
