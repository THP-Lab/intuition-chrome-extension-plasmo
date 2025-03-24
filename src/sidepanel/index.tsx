import React from "react"

import "../styles/global.css"

import { configureClient } from "@0xintuition/graphql"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { GraphQLClient } from "graphql-request"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import Feed from "~src/pages/Feed"
import Home from "~src/pages/Home"
import Profile from "~src/pages/Profile"

import Navbar from "../components/layout/Navbar"
import { ThemeProvider } from "../components/ThemeProvider"

const API_URL = "https://dev.base.intuition-api.com/v1/graphql"
configureClient({
  apiUrl: API_URL
})

const queryClient = new QueryClient()

function IndexSidepanel() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="intuition-theme">
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="flex min-h-screen flex-col bg-background text-foreground">
            <main className="flex-1 overflow-auto pb-24">
              <div className="container mx-auto space-y-8 p-4">
                <Routes>
                  <Route path="*" element={<Home />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/feed" element={<Feed />} />
                </Routes>
              </div>
            </main>
            <Navbar />
          </div>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default IndexSidepanel
