import React from 'react';
import { Link } from "react-router-dom"
import { UserRound } from 'lucide-react';


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
      position_count?: string;
      positions?: string;
  }

}

interface AtomCardProps {
  atom: Atom;
}

export const AtomCard: React.FC<AtomCardProps> = ({ atom }) => {
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
        <div className="ml-auto">
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

    </div>
  );
};

export default AtomCard;
