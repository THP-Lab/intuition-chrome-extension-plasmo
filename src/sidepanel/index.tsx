import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "~src/pages/Home"
import Profile from "~src/pages/Profile"


function IndexSidepanel() {
  const [data, setData] = useState("")

  return (
    <Router>
      <Routes>
      <Route path="*" element={<Home/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </Router>
  )
}

export default IndexSidepanel
