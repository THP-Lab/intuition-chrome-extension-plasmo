import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { type ReactNode } from "react"
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate
} from "react-router-dom"

import { configureClient } from "~src/graphql/src"
import PageForm from "~src/pages/PageForm"
import Feed from "~src/pages/Feed"
import Home from "~src/pages/Home"
import Profile from "~src/pages/Profile"
import RecentActivity from "~src/pages/RecentActivity"
import Search from "~src/pages/Search"
import { AtomSelectionProvider } from "./ui/AtomSelectionContext"
import AtomDetailPage from "~src/pages/AtomDetailPage"

import { NavigationProvider, useNavigation } from "./layout/NavigationProvider"
import NavArc from "./layout/NavArc"
import Navbar from "./layout/Navbar"
import NavbarUp from "./layout/NavbarUp"

import FollowersTab from "./profile/FollowersTab"
import FollowingTab from "./profile/FollowingTab"
import IdentityTab from "./profile/IdentityTab"
import YourClaimsTab from "./profile/YourClaimsTab"
import MyPositionsTab from "./profile/MyPositionsTab"
import IdentitiesVotedTab from "./profile/IdentitiesVotedTab"
import ProfileLayout from "./profile/ProfileLayout"

import "../styles/global.css"
import { ThemeProvider } from "./ThemeProvider"
import VideoBanner from "./HomeBanner/VideoBanner"

const API_URL = "https://prod.base.intuition-api.com/v1/graphql"
configureClient({ apiUrl: API_URL })

const queryClient = new QueryClient()

type ContentProps = {
  children?: ReactNode
}

const Content = ({ children }: ContentProps) => {
  const { navType } = useNavigation()

  return (
    <QueryClientProvider client={queryClient}>
      <AtomSelectionProvider>
        <Router>
          {navType === "classic" && <NavbarUp />}
            <main className="flex-1 overflow-auto pb-24 pt-14">
              {children}
              <div className="container mx-auto space-y-8 p-2">
                <Routes>
                  <Route path="*" element={<Home />} />
                  <Route path="/" element={<Home />} />

                  <Route path="/profile" element={<Profile />}>
                    <Route index element={<Navigate to="/profile/claims/all" />} />
                    <Route element={<ProfileLayout />}>
                      <Route path="claims">
                        <Route path="all" element={<MyPositionsTab />} />
                        <Route path="created" element={<YourClaimsTab />} />
                      </Route>

                      <Route path="identities">
                        <Route path="all" element={<IdentitiesVotedTab />} />
                        <Route path="created" element={<IdentityTab />} />
                      </Route>

                      <Route path="followers" element={<FollowersTab />} />
                      <Route path="following" element={<FollowingTab />} />
                    </Route>
                  </Route>

                  <Route path="/feed" element={<Feed />} />
                  <Route path="/page-form" element={<PageForm />} />
                  <Route path="/recent-activity" element={<RecentActivity />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/atoms/:id" element={<AtomDetailPage />} />
                </Routes>
              </div>
            </main>
            {navType === "classic" ? (
              <Navbar />
            ) : (
              <>
                <VideoBanner />
                <NavArc />
              </>
            )}
        </Router>
      </AtomSelectionProvider>
    </QueryClientProvider>
  )
}

export default Content
