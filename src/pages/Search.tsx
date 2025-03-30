import React, { useEffect, useState } from "react"
import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"
import TabSystem from '../components/TabSystem'

const Search: React.FC = () => {
  const [isSidePanel, setIsSidePanel] = useState(false)

  useEffect(() => {
    //verify if side panel 
    const checkWidth = () => {
      
      setIsSidePanel(window.innerWidth > 600)
    }

    checkWidth()
    window.addEventListener('resize', checkWidth)

    return () => window.removeEventListener('resize', checkWidth)
  }, [])

  const handleSearch = (value: string) => {
    console.log("Recherche:", value)
  }

  const tabs = [
    {
      label: 'All',
      content: <div>Contenu de All</div>
    },
    {
      label: 'Tag',
      content: <div>Contenu des Tags</div>
    },
    {
      label: 'Organization',
      content: <div>Contenu des Organizations</div>
    },
    {
      label: 'User',
      content: <div>Contenu des Users</div>
    }
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Recherche</h1>
      <div className="flex flex-col items-center space-y-8">
        <div className="w-full max-w-3xl">
          <IntuitionSearchIcon
            onSearch={handleSearch}
            size={80}
            position={{ 
              x: isSidePanel ? "200px" : "0px",
              y: "0px" 
            }}
            className="hover:opacity-80 transition-opacity"
          />
        </div>
        <div className="w-full max-w-3xl">
          <TabSystem tabs={tabs} />
        </div>
      </div>
    </div>
  )
}

export default Search