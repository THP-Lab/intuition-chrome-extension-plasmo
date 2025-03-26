import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { configureClient } from "~src/graphql/src"
import { ThemeProvider } from "./ThemeProvider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavbarUp from "./layout/NavbarUp";
import Home from "~src/pages/Home";
import Navbar from "./layout/Navbar";
import Profile from "~src/pages/Profile";
import YourClaimsTab from "./profile/YourClaimsTab";
import RelatedClaimsTab from "./profile/RelatedClaims";
import IdentityTab from "./profile/IdentityTab";
import FollowersTab from "./profile/FollowersTab";
import FollowingTab from "./profile/FollowingTab";
import Feed from "~src/pages/Feed";
import RecentActivity from "~src/pages/RecentActivity";
import Search from "~src/pages/Search";
import CreateAtom from "~src/pages/CreateAtom";

const API_URL = "https://dev.base.intuition-api.com/v1/graphql"
configureClient({
  apiUrl: API_URL
})

const queryClient = new QueryClient();


const Content = ({children}) => {
  return(
   <ThemeProvider defaultTheme="dark" storageKey="intuition-theme">
    <QueryClientProvider client={queryClient}>
        <Router>
        <div className="flex min-h-screen flex-col bg-background text-foreground">
        <NavbarUp />
            <main className="flex-1 overflow-auto pb-24 pt-14">
              <div className="container mx-auto space-y-8 p-4">
                {children}
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


                  <Route path="/recent-activity" element={<RecentActivity />} />
                  <Route path="/search" element={<Search />} />

                </Routes>
              </div>
            </main>
            
          </div>
            <Navbar />
          </Router>
          </QueryClientProvider>
        </ThemeProvider>
    
  )
}

export default Content
