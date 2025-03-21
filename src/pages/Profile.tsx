import React from "react";
import { useGetTriplesQuery } from "../graphql/src";
import { useContext } from "react";

function Profile() {
  const { data, isLoading } = useGetTriplesQuery({
    limit: 10,
    offset: 0,
    orderBy: [{ block_number: "desc" }],
    where: {}, 
  });

  if (isLoading) return <div>Loading...</div>;


  return (
    <>
    <h1>Hello from Profile ! </h1>
    <div>
      <h2>Claims (Triples)</h2>
      {data?.triples.map((triple) => (
        <div key={triple.id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
          <p><strong>Subject:</strong> {triple.subject?.label || "N/A"}</p>
          <p><strong>Predicate:</strong> {triple.predicate?.label || "N/A"}</p>
          <p><strong>Object:</strong> {triple.object?.label || "N/A"}</p>
        </div>
      ))}
    </div>
    </>
  );
};


export default Profile;