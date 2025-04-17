import { Fingerprint, UserRound } from "lucide-react"
import React from "react"
import { Link } from "react-router-dom"

import { useAtomPosition } from "../hooks/useAtomPosition"

interface AtomProps {
  id: string
  data?: string | null
  type: string
  label?: string | null
  image?: string | null
  emoji?: string | null
  value?: {
    thing?: {
      name?: string | null
      image?: string | null
      description?: string | null
      url?: string | null
    } | null
  } | null
  vault?: {
    position_count?: number
    total_shares?: string
    current_share_price?: string
    total?: {
      aggregate?: {
        count?: number
        sum?: {
          shares?: string | number
        } | null
      } | null
    }
  } | null
  vault_id?: string
}

interface AtomCardProps {
  atom: AtomProps
}

export const AtomCard: React.FC<AtomCardProps> = ({ atom }) => {
  const { atomPosition, isVoting, txHash } = useAtomPosition()
  const thing = atom.value?.thing

  return (
    <div className="border border-border-atom rounded-xl p-4 my-2 claims-hover-effect transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {atom.image ? (
            <img
              src={atom.image}
              alt={(atom.label ?? "") as string}
              className="w-12 h-12 object-cover rounded-md"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-md bg-muted text-muted-foreground">
              <Fingerprint className="w-6 h-6" />
            </div>
          )}
          <div>
            <h2 className="text-base font-semibold">{atom.label}</h2>
            {thing?.name && (
              <p className="text-sm text-muted-foreground">{thing.name}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="flex items-center text-sm text-muted-foreground">
            <UserRound className="w-4 h-4 mr-1" />
            {atom.vault?.position_count ?? 0}
          </p>
          <button
            onClick={() => atomPosition(BigInt(atom.id))}
            disabled={isVoting}
            className="text-for border border-for rounded-md px-2 py-0.5 hover:bg-for hover:text-white text-xs"
            title="Vote for this atom">
            ↑
          </button>
        </div>
      </div>

      {thing?.description && (
        <p className="text-sm text-gray-400 line-clamp-2 mt-2">
          {thing.description}
        </p>
      )}

      {thing?.url && (
        <Link
          to={thing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 underline mt-1 inline-block">
          {thing.url}
        </Link>
      )}

      {txHash && <p className="text-green-500 text-xs mt-2">Tx: {txHash}</p>}
    </div>
  )
}

export default AtomCard
