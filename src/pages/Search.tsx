import React, { useEffect, useState } from "react"
import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"
import TabSystem from "../components/TabSystem"
import { useGetTriplesQuery } from "@0xintuition/graphql"
import ClaimRowLite from "~src/components/ui/ClaimRowLite";


const Search: React.FC = () => {
  const [isSidePanel, setIsSidePanel] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("All")

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
    isLoading,
    error
  } = useGetTriplesQuery({
    where: {
      _or: [
        { subject: { label: { _ilike: `%${searchTerm}%` } } },
        { predicate: { label: { _ilike: `%${searchTerm}%` } } },
        { object: { label: { _ilike: `%${searchTerm}%` } } }
      ]
    }
  }, {
    enabled: !!searchTerm
  })

  
  const triples = triplesData?.triples || []


    const renderResults = () => {
      console.log("Active tab:", activeTab)
      console.log("All Triples:", triples)
    
      if (isLoading) return <p>Loading...</p>
      if (error) return <p className="text-red-500">Error loading results.</p>
      if (!triples.length) return <p>No results found.</p>
    
      const filterFunctions: Record<string, (triple: Triple) => boolean> = {
        All: () => true,
        Tag: (triple) => triple.predicate?.label?.toLowerCase().includes("tag"),
        Organization: (triple) =>
          triple.predicate?.label?.toLowerCase().includes("organization"),
        User: (triple) => triple.predicate?.label?.toLowerCase().includes("follow")
      }
      
      const filteredTriples = triples.filter(filterFunctions[activeTab] || filterFunctions.All)
      
    
      console.log("Filtered triples:", filteredTriples)
    
      return (
        <div className="space-y-2">
          {filteredTriples.length === 0 && <p>No results found.</p>}
          {filteredTriples.map((triple, index) => (
            <ClaimRowLite
              key={triple.id}
              subjectLabel={triple.subject?.label ?? "No subject"}
              subjectImage={triple.subject?.image ?? undefined}
              predicateLabel={triple.predicate?.label ?? "No predicate"}
              predicateImage={triple.predicate?.image ?? undefined}
              objectLabel={triple.object?.label ?? "No object"}
              objectImage={triple.object?.image ?? undefined}
              numPositionsFor={triple.vault?.positions?.length ?? 0}
              numPositionsAgainst={triple.counter_vault?.positions?.length ?? 0}
              userStake={0}
              userCounterStake={0}
              isFirst={index === 0}
              isLast={index === filteredTriples.length - 1}
              vaultId={triple.vault_id ? BigInt(triple.vault_id) : undefined}
              counterVaultId={triple.counter_vault_id ? BigInt(triple.counter_vault_id) : undefined}
            />
          ))}
        </div>
      )
    }
    

  const tabs = ["All", "Tag", "Organization", "User"].map((label) => ({
    label,
    content: (
      <div>
        {renderResults()}
      </div>
    )
  }))

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <IntuitionSearchIcon
            onSearch={handleSearch}
            size={80}
            //position={{ x: isSidePanel ? "200px" : "0px", y: "0px" }}
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
