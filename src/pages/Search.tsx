import {
  useGetTriplesWithPositionsLazyQuery,
  useGetTriplesWithPositionsQuery,
  type Triples
} from "@warzieram/graphql"
import React, { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/dist/hook"

import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"

import TabSystem from "../components/TabSystem"

const Search: React.FC = () => {
  const [isSidePanel, setIsSidePanel] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [walletAddress] = useStorage<string>("metamask-account", "")

  useEffect(() => {
    const checkWidth = () => {
      setIsSidePanel(window.innerWidth > 600)
    }

    checkWidth()
    window.addEventListener("resize", checkWidth)

    return () => window.removeEventListener("resize", checkWidth)
  }, [])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const { data: triplesData, loading, error } = useGetTriplesWithPositionsQuery({
    variables: {
      where: {
        _or: [
          { subject: { label: { _ilike: `%${searchTerm}%` } } },
          { predicate: { label: { _ilike: `%${searchTerm}%` } } },
          { object: { label: { _ilike: `%${searchTerm}%` } } }
        ]
      },
      address: walletAddress
    },
    skip: searchTerm==="",
  })

  const triples = triplesData !== undefined ? triplesData.triples : []

  const renderResults = () => {
    console.log("Active tab:", activeTab)
    console.log("All Triples:", triples)

    if (loading) return <p>Loading...</p>
    if (error) return <p className="text-red-500">Error loading results.</p>
    if (!triples.length) return <p>No results found.</p>

    const filterFunctions: Record<
      string,
      (triple: (typeof triples)[0]) => boolean
    > = {
      All: () => true,
      Tag: (triple) =>
        triple.predicate?.label?.toLowerCase().includes("tag") || false,
      Organization: (triple) =>
        triple.predicate?.label?.toLowerCase().includes("organization") ||
        false,
      User: (triple) =>
        triple.predicate?.label?.toLowerCase().includes("follow") || false
    }

    const filteredTriples = triples.filter(
      filterFunctions[activeTab] || filterFunctions.All
    )

    console.log("Filtered triples:", filteredTriples)

    return (
      <div className="space-y-2">
        {filteredTriples.length === 0 && <p>No results found.</p>}
        {filteredTriples.map((triple, index) => (
          <ClaimRowLite key={`${triple.term_id}-${index}`} claim={triple} />
        ))}
      </div>
    )
  }

  const tabs = ["All", "Tag", "Organization", "User"].map((label) => ({
    label,
    content: <div>{renderResults()}</div>
  }))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <div className="flex flex-col items-center space-y-8">
        <div className="w-full max-w-3xl">
          <IntuitionSearchIcon
            onSearch={handleSearch}
            size={80}
            position={{ x: isSidePanel ? "200px" : "0px", y: "0px" }}
            className="hover:opacity-80 transition-opacity"
          />
        </div>
        <div className="w-full max-w-3xl">
          <TabSystem
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>
      </div>
    </div>
  )
}

export default Search
