import { ApolloClient, InMemoryCache, split } from "@apollo/client"
import { GraphQLWsLink } from "@apollo/client/link/subscriptions"
import { createClient } from "graphql-ws"
import { getMainDefinition } from "@apollo/client/utilities"
import { HttpLink } from "@apollo/client"


const ENV = "dev" // "local" | "dev" | "prod"

const ENDPOINTS = {
  local: {
    http: "http://localhost:8080/v1/graphql",
    ws: "ws://localhost:8080/v1/graphql"
  },
  dev: {
    http: "https://prod.base-sepolia.intuition-api.com/v1/graphql",
    ws: "wss://prod.base-sepolia.intuition-api.com/v1/graphql"
  },
  prod: {
    http: "https://prod.base.intuition-api.com/v1/graphql",
    ws: "wss://prod.base.intuition-api.com/v1/graphql"
  }
}

const { http, ws } = ENDPOINTS[ENV]

const httpLink = new HttpLink({
  uri: http,
  headers: {
    "Content-Type": "application/json"
   
  }
})

const wsLink = new GraphQLWsLink(
  createClient({
    url: ws,
    connectionParams: {
      headers: {
      
      }
    }
  })
)


const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  httpLink
)

export const apolloSubscriptionClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache()
})
