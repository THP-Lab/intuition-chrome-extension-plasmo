import { UserRound } from "lucide-react"
import React from "react"
import { Link } from "react-router-dom"

import { useAtomPosition } from "../hooks/useAtomPosition"

interface Atom {
  id: string
  data: string
  type: string
  label: string
  image?: string
  emoji?: string
  value?: {
    thing?: {
      name?: string | null
      image?: string | null
      description?: string | null
      url?: string | null
    }
  }
  vault: {
    total_shares?: string
    current_share_price?: string
    myPostion?: Array<{
      shares: string
      account_id: string
    }>
    position_count?: string
    positions?: string
  }
  vault_id?: string
}

interface AtomCardProps {
  atom: Atom
}

export const AtomCard: React.FC<AtomCardProps> = ({ atom }) => {
  const { atomPosition, isVoting, txHash } = useAtomPosition()
  const thing = atom.value?.thing

  return (
    <div className="border rounded p-4 my-2">
      <div className="flex items-center mb-2">
        {atom.image && (
          <img
            src={atom.image}
            alt={atom.label}
            className="w-16 h-16 object-cover rounded mr-4"
          />
        )}
        <div>
          <h2 className="text-xl font-bold">{atom.label}</h2>
        </div>
        <div
          className="ml-auto"
          title={`${atom.vault?.position_count ?? 0} users staked on this atom`}>
          <p className="text-sm">
            <UserRound /> {atom.vault?.position_count ?? 0}
          </p>
        </div>
        <div className="mt-4 flex flex-col items-start">
          <button
            onClick={() => atomPosition(BigInt(atom.id))}
            disabled={isVoting}
            className="text-for border border-for rounded-md px-2 py-1 hover:bg-for hover:text-white ml-1">
            ↑
          </button>
          {txHash && (
            <p className="text-green-600 text-sm mt-2">Tx: {txHash}</p>
          )}
        </div>
      </div>

      {thing && (
        <div className="mt-2">
          {thing.name && (
            <h3 className="text-lg font-semibold">{thing.name}</h3>
          )}
          {thing.description && (
            <p className="text-sm text-gray-600">{thing.description}</p>
          )}
          {thing.url && (
            <Link
              to={thing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-sm">
              {thing.url}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default AtomCard
