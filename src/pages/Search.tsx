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

  console.log("🔍 Search term:", searchTerm)
console.log("📥 Triples data:", triplesData)
console.log("⚠️ Error:", error)
console.log(JSON.stringify({ search: searchTerm }))
  const filteredTriples = triples.filter((triple) => {
    if (activeTab === "Tag") {
      return triple.predicate?.label?.toLowerCase().includes("tag")
    }
    if (activeTab === "Organization") {
      return triple.predicate?.label?.toLowerCase().includes("organization")
    }
    if (activeTab === "User") {
      return triple.predicate?.label?.toLowerCase().includes("user")
    }
    return true // All
  })

  const renderResults = () => {
    if (isLoading) return <p>Loading...</p>
    if (error) return <p className="text-red-500">Error loading results.</p>
    if (!filteredTriples.length) return <p>No results found.</p>

    return (
      <div className="space-y-2">
      {triples.length === 0 && <p>Aucun résultat.</p>}
      {triples.map((triple, index) => (
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
          userStake={0} // À mettre à jour plus tard si tu veux afficher la position de l'utilisateur
          userCounterStake={0}
          isFirst={index === 0}
          isLast={index === triples.length - 1}
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
        <input
          type="text"
          placeholder="Search triples..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md"
        />
        {renderResults()}
      </div>
    )
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
          <TabSystem tabs={tabs} onTabChange={setActiveTab} />
        </div>
      </div>
    </div>
  )
}

export default Search
