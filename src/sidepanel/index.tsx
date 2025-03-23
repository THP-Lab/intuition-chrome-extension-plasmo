import "../global.css"

import { useState } from "react"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import Home from "~src/pages/Home"
import Profile from "~src/pages/Profile"

import Navbar from "../components/layout/Navbar"
import { ThemeProvider } from "../components/ThemeProvider"
import Feed from "../pages/Feed"
import { configureClient } from '@0xintuition/graphql'
import { createServerClient } from '@0xintuition/graphql'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request"

import { ApolloProvider } from "@apollo/client"
import { client as apolloClient } from "../lib/apollo" 


const API_URL = "https://dev.base.intuition-api.com/v1/graphql";
configureClient({ // client for intuition premade requests
  apiUrl: API_URL
})

const queryClient = new QueryClient()

function IndexSidepanel() {

  return (
    <ThemeProvider defaultTheme="light" storageKey="intuition-theme">
    <ApolloProvider client={apolloClient}> 
      <QueryClientProvider client={queryClient}>
        <Router>
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="*" element={<Home />} />
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/feed" element={<Feed />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </ApolloProvider>
  </ThemeProvider>
)
}
