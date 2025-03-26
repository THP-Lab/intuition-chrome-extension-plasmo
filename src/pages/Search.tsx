import React from "react"
import IntuitionSearchIcon from "~src/components/icons/IntuitionSearchBar"

const Search: React.FC = () => {
  const handleSearch = (value: string) => {
    console.log("Recherche:", value)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="relative w-full flex justify-center items-center">
        <div className="relative" style={{ width: "300px" }}>
          <IntuitionSearchIcon
            onSearch={handleSearch}
            size={80}
            position={{ x: "0px", y: "0px" }} // Utilisons les mêmes valeurs que NavbarUp
            className="hover:opacity-80 transition-opacity"
          />
        </div>
      </div>
    </div>
  )
}

export default Search