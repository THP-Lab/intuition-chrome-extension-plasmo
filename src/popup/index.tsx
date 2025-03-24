import React, { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")
  
  const handleSidePanel = () => {
    chrome.runtime.sendMessage({ type: "open_sidepanel"})
  }

  return (
    <div
      style={{
        padding: 16
      }}>
      <button onClick={handleSidePanel} > Open in sidePanel </button>
    </div>
  )
}

export default IndexPopup
