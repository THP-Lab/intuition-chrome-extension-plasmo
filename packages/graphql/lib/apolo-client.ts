import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const httpLink = new HttpLink({
  uri: 'https://testnet.intuition.sh/v1/graphql', // replace with your API URL
})

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: 'wss://testnet.intuition.sh/v1/graphql',
        }),
      ) // replace with your WS endpoint
    : null

const splitLink =
  typeof window !== 'undefined' && wsLink
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query)

          return (
            def.kind === 'OperationDefinition' &&
            def.operation === 'subscription'
          )
        },

        wsLink,

        httpLink,
      )
    : httpLink

export const apolloClient = new ApolloClient({
  link: splitLink,

  cache: new InMemoryCache(),
})
