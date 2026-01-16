import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { getMainDefinition } from "@apollo/client/utilities"
import { createClient } from "graphql-ws"
import { getGraphQLEndpoints, CURRENT_NETWORK } from "./config"

// Get endpoints based on environment
const endpoints = getGraphQLEndpoints(CURRENT_NETWORK)

const httpLink = new HttpLink({
  uri: endpoints.http
})

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({ 
          url: endpoints.ws,
          shouldRetry: () => true,
        })
      )
    : null

const splitLink =
  typeof window !== "undefined" && wsLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query)
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          )
        },
        wsLink,
        httpLink
      )
    : httpLink

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})
