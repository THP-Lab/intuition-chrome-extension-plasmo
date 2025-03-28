import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { type ReactNode } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import { configureClient } from "~src/graphql/src"
import PageForm from "~src/pages/PageForm"
import Feed from "~src/pages/Feed"
import Home from "~src/pages/Home"
import Profile from "~src/pages/Profile"
import RecentActivity from "~src/pages/RecentActivity"
import Search from "~src/pages/Search"

import Navbar from "./layout/Navbar"
import NavbarUp from "./layout/NavbarUp"
import FollowersTab from "./profile/FollowersTab"
import FollowingTab from "./profile/FollowingTab"
import IdentityTab from "./profile/IdentityTab"
import RelatedClaimsTab from "./profile/RelatedClaims"
import YourClaimsTab from "./profile/YourClaimsTab"
import MyPositionsTab from "./profile/MyPositionsTab"
import "../styles/global.css"
import { ThemeProvider } from "./ThemeProvider"

const API_URL = "https://prod.base.intuition-api.com/v1/graphql"
configureClient({
  apiUrl: API_URL
})

const queryClient = new QueryClient()

type ContentProps = {
  children?: ReactNode
}

const Content = ({ children }: ContentProps) => {
  return (
      <QueryClientProvider client={queryClient}>
        <Router>
            <NavbarUp />
            <main className="flex-1 overflow-auto pb-24 pt-14">
              {children}
              <div className="container mx-auto space-y-8 p-4">
                <Routes>
                  <Route path="*" element={<Home />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />}>
                    <Route path="claims" element={<YourClaimsTab />} />
                    <Route
                      path="related-claims"
                      element={<RelatedClaimsTab />}
                    />
                    <Route path="my-positions" element={<MyPositionsTab/>} />
                    <Route path="identity" element={<IdentityTab />} />
                    <Route path="followers" element={<FollowersTab />} />
                    <Route path="following" element={<FollowingTab />} />
                  </Route>
                  <Route path="/feed" element={<Feed />} />

                  <Route path="/page-form" element={<PageForm />} />

                  <Route path="/recent-activity" element={<RecentActivity />} />
                  <Route path="/search" element={<Search />} />
                </Routes>
              </div>
            </main>

            <Navbar />
        </Router>
      </QueryClientProvider>
  )
}

export default Content
