import { ApolloClient, InMemoryCache } from "@apollo/client"

export const client = new ApolloClient({
  uri: "https://prod.base.intuition-api.com/v1/graphql",
  cache: new InMemoryCache()
})
