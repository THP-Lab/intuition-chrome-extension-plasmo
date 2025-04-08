import React, { useState } from 'react';
import { Link } from "react-router-dom"
import { UserRound } from 'lucide-react';
import { useAtomPosition } from "../hooks/useAtomPosition"


interface Atom {
  id: string;
  data: string;
  type: string;
  label: string;
  image?: string;
  emoji?: string;
  value: {
    thing?: {
      name?: string;
      image?: string;
      description?: string;
      url?: string;
    };
    
  };
  vault: {
      total_shares?: string;
      current_share_price?: string;
      myPostion?: Array<{
        shares: string;
        account_id: string;
    }>
      position_count?: string;
      positions?: string;
  }
  vault_id: string;
}

interface AtomCardProps {
  atom: Atom;
}

export const AtomCard: React.FC<AtomCardProps> = ({ atom }) => {
  const { atomPosition } = useAtomPosition();
  const [error, setError] = useState<string | null>(null);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async () => {
    setError(null);
    setIsVoting(true);
    try {
      await atomPosition({ vaultId: BigInt(atom.id) })
    } catch (err: any) {
      setError(err.message || 'Failed to vote');
    } finally {
      setIsVoting(false);
    }
  }
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
        <div className="ml-auto" title={`${atom.vault.position_count} users staked on this atom`}>
        <p className="text-sm"><UserRound /> {atom.vault.position_count}</p>
        </div>
      </div>


      {atom.value.thing && (
        <div className="mt-2">
          {atom.value.thing.name && (
            <h3 className="text-lg font-semibold">
              {atom.value.thing.name}
            </h3>
              
          )}
          {atom.value.thing.description && (
            <p className="text-sm text-gray-600">
              {atom.value.thing.description}
            </p>
          )}
          {atom.value.thing.url && (
            <Link
            to={atom.value.thing.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline text-sm"
            >
            {atom.value.thing.url}
            </Link>
          )}
        </div>
      )}
      
      <div className="mt-4 flex flex-col items-start">
        <button
          onClick={handleVote}
          disabled={isVoting}
          className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/80 disabled:opacity-50"
        >
          {isVoting ? 'Voting...' : 'Vote for this atom'}
        </button>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    </div>
  );
};

export default AtomCard;
