import {
  useGetTriplesWithPositionsLazyQuery,
  useGetTriplesWithPositionsQuery,
  type GetTriplesWithPositionsQuery,
} from "@warzieram/graphql"
import React, { useEffect, useState } from "react"

import { useWalletAddress } from "~src/hooks/useWalletAddress"

import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"
import ClaimRowLite from "~src/components/ui/ClaimRowLite"

import TabSystem from "../components/TabSystem"

const Search: React.FC = () => {
  const [isSidePanel, setIsSidePanel] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("All")
  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState<GetTriplesWithPositionsQuery['triples']>(
    []
  )
  const walletAddress = useWalletAddress();

  const PAGE_SIZE = 20

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

  const {
    data: triplesData,
    loading,
    error
  } = useGetTriplesWithPositionsQuery({
    variables: {
      where: {
        _or: [
          { subject: { label: { _ilike: `%${searchTerm}%` } } },
          { predicate: { label: { _ilike: `%${searchTerm}%` } } },
          { object: { label: { _ilike: `%${searchTerm}%` } } }
        ]
      },
      limit: PAGE_SIZE,
      address: walletAddress,
      offset
    },
    skip: searchTerm.length < 2
  })

  // append the new data to the existing one when it changes
  useEffect(() => {
    if (!triplesData) return
    if (offset === 0) {
      setItems(triplesData.triples)
    } else {
      setItems((prev) => [...prev, ...triplesData.triples])
    }
  }, [triplesData])

  // adding a listener to adjust the offset on scroll
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10
      ) {
        setOffset((prev) => prev + PAGE_SIZE)
      }
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // reset the research when the user types
  useEffect(() => {
    setItems([])
    setOffset(0)
  }, [searchTerm])

  const renderResults = () => {
    console.log("Active tab:", activeTab)
    console.log("All Triples:", items)

    if (error) return <p className="text-red-500">Error loading results.</p>
    if (!items.length) return <p>No results found.</p>

    const filterFunctions: Record<
      string,
      (triple: GetTriplesWithPositionsQuery['triples'][number] ) => boolean
    > = {
      All: () => true,
      Tag: (triple) =>
        triple.predicate?.label?.toLowerCase().includes("tag") || false,
      User: (triple) =>
        triple.predicate?.label?.toLowerCase().includes("follow") || false
    }

    const filteredTriples = items.filter(
      filterFunctions[activeTab] || filterFunctions.All
    )

    console.log("Filtered triples:", filteredTriples)

    return (
      <div className="space-y-2">
        {filteredTriples.length === 0 && <p>No results found.</p>}
        {filteredTriples.map((triple, index) => (
          <ClaimRowLite key={`${triple.term_id}-${index}`} claim={triple} />
        ))}
        {loading && <p>Loading...</p>}
      </div>
    )
  }

  const tabs = ["All", "Tag", "User"].map((label) => ({
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
