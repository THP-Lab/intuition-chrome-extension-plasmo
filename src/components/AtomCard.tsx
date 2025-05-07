import { Fingerprint, UserRound } from "lucide-react"
import React from "react"
import { Link, useNavigate } from "react-router-dom"

import { useAtomPosition } from "../hooks/useAtomPosition"
import TagCreator from "./TagCreator"
import Tags from "./ui/Tags"

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
  tags?: string[]
}

export const AtomCard: React.FC<AtomCardProps> = ({ atom, tags }) => {
  try {
    if (!atom) {
      console.error("AtomCard: missing atom, raw data:", atom)
      return <div className="text-xs text-gray-500">Invalid atom data</div>
    }
    const { atomPosition, isVoting, txHash } = useAtomPosition()
    const thing = atom.value?.thing
    const navigate = useNavigate()
    const goToAtomPage = () => {
      navigate(`/atoms/${atom.id || ''}`)
    }

    return (
      <div
        className="border border-border/10 rounded-xl p-3 mt-3 cursor-pointer bg-[hsl(var(--claims-bg))] claims-hover-effect transition-all duration-200"
        onClick={goToAtomPage}
      >
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
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold leading-snug line-clamp-2 break-words">
                {atom.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-2">
            <p className="flex items-center text-sm text-white text-muted-foreground">
              <UserRound className="w-4 h-4 mr-1" />
              {atom.vault?.position_count ?? 0}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                atomPosition(BigInt(atom.id));
              }}
              disabled={isVoting}
              className="border border-gray-400 text-white rounded-md px-2 py-1 text-sm
              hover:bg-gray-400 hover:text-black hover:scale-110
              transition-all duration-200 ease-in-out"
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

      {tags && <Tags tags={tags} />}

        {txHash && <p className="text-green-500 text-xs mt-2">Tx: {txHash}</p>}
      </div>
    )
  } catch (err) {
    console.error("AtomCard: error rendering atom, raw data:", atom, err)
    return (
      <pre className="p-2 bg-red-100 text-red-700 overflow-auto">
        {JSON.stringify(atom, null, 2)}
      </pre>
    )
  }
}

export default AtomCard
