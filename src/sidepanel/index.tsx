import React from "react"

import "../styles/global.css"

import { configureClient } from "@0xintuition/graphql"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import Feed from "~src/pages/Feed"
import Home from "~src/pages/Home"
import Profile from "~src/pages/Profile"

import Navbar from "../components/layout/Navbar"
import { ThemeProvider } from "../components/ThemeProvider"

import RelatedClaimsTab from "~src/components/profile/RelatedClaims"
import YourClaimsTab from "~src/components/profile/YourClaimsTab"
import IdentityTab from "~src/components/profile/IdentityTab"
import FollowersTab from "~src/components/profile/FollowersTab"
import FollowingTab from "~src/components/profile/FollowingTab"
import CreateAtom from "../pages/CreateAtom"

import { GraphQLClient } from "graphql-request"


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
                  <Route path="/profile" element={<Profile />}>
                    <Route path="claims" element={<YourClaimsTab />} />
                    <Route path="related-claims" element={<RelatedClaimsTab />} />
                    <Route path="identity" element={<IdentityTab />} />
                    <Route path="followers" element={<FollowersTab />} />
                    <Route path="following" element={<FollowingTab />} />
                  </Route>
                  <Route path="/feed" element={<Feed />} />
                  <Route path="/createAtom" element={<CreateAtom />} />

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
