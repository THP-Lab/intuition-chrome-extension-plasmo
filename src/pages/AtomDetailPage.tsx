import React from "react"
import { useParams } from "react-router-dom"

const AtomDetailPage = () => {
  const { id } = useParams()

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Atom details page</h1>
      <p className="mt-2">Atom ID: {id}</p>
    </div>
  )
}

export default AtomDetailPage;
