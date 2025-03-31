import React, { useEffect, useState } from "react"
import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"
import TabSystem from '../components/TabSystem'

const Search: React.FC = () => {
  const [isSidePanel, setIsSidePanel] = useState(false)

  useEffect(() => {
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
      content: <div>Coming soon...</div>
    },
    {
      label: 'Tag',
      content: <div>Coming soon...</div>
    },
    {
      label: 'Organization',
      content: <div>Coming soon...</div>
    },
    {
      label: 'User',
      content: <div>Coming soon...</div>
    }
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Coming soon</h1>
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