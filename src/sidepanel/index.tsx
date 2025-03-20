import { useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "~src/pages/Home"
import Profile from "~src/pages/Profile"
import Navbar from "../components/layout/Navbar"
import Feed from "../pages/Feed"
import { configureClient } from '@0xintuition/graphql'
import { createServerClient } from '@0xintuition/graphql'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request"


const API_URL = "https://dev.base.intuition-api.com/v1/graphql";
configureClient({ // client for intuition premade requests
  apiUrl: API_URL
})

const queryClient = new QueryClient();

function IndexSidepanel() {

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navbar />
          <Routes>
          <Route path="*" element={<Home/>} />
            <Route path="/" element={<Home/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/feed" element={<Feed/>} />
          </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default IndexSidepanel
