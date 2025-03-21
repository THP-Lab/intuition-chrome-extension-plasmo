import React from 'react';


export const ClaimItem: React.FC<{ claim: any }> = ({ claim }) => {
  const { id, subject, predicate, object } = claim;
    
  return (
    <div key={id} className="border p-4 my-2 rounded">
      {subject?.image && (
      <img
      src={subject.image}
      alt={subject.label}
      className="w-5 h-5 object-cover rounded"
      />
    )}

    <p className=" font-bold">Subject: {subject?.label} - Predicate: {predicate?.label} - Object: {object?.label}</p>

    {object?.image && (
      <img
      src={object.image}
      alt={object.label}
      className="w-8 h-8 object-cover rounded"
      />
    )}
    </div>
  )
}